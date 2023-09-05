import React, { useState, useMemo } from "react";
import styles from "./TableView.module.css";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { setBigMenu } from "../Redux/bigMenuSlice";
import { useSelector, useDispatch } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";
import { useNavigate } from "react-router-dom";
import useSocket from "../Utils/useSocket";
import { resetFinalOrder } from "../Redux/finalOrderSlice";
import DineInArea from "../TableView Components/DineInArea";
import { setActive } from "../Redux/UIActiveSlice";
import { useGetLiveOrdersQuery, useGetMenuQuery, useGetMenuQuery2 } from "../Utils/customQueryHooks";
import { matchOrderAndTables } from "../Utils/matchOrderAndTables";

function TableView() {

    const queryClient = useQueryClient() 
	const dispatch = useDispatch();
	const navigate = useNavigate();
	
	const { data : orders, isLoading, error, isError } = useGetLiveOrdersQuery()
	const { data : bigMenu } = useGetMenuQuery2()
	const areas = bigMenu?.areas || []
	const defaultRestaurantPrice = bigMenu?.defaultSettings?.default_restaurant_price || 0

	// const defaultRestaurantPrice = defaultSettings?.default_restaurant_price || 0 ;

	
	useSocket("orders", orders => {
		queryClient.setQueryData("liveOrders", orders)	
	});

	const handleClick = orderType => {
		dispatch(resetFinalOrder());
		dispatch(modifyCartData({ orderType }));
		dispatch(setActive({ key: "restaurantPriceId", name: +defaultRestaurantPrice || null }));
		navigate(`..${orderType === "dine_in" ? "?openTable=true" : ""}`);
	};

	const allAreas = useMemo(() => matchOrderAndTables(orders, areas), [areas, orders]);

	return (
		<div className={styles.tableView}>
			<header>
				<div className={styles.heading}> Table View</div>
				<div className={styles.control}>
					<button onClick={() => handleClick("delivery")}> Delivery </button>
					<button onClick={() => handleClick("pick_up")}> Pick Up</button>
					<button onClick={() => handleClick("dine_in")}>+ Add Table</button>
				</div>
			</header>
			<main className={styles.tableList}>
				{isLoading && <div>Loading....</div>}
				{isError && <div>{error}</div>}

				{allAreas?.map(area => {
					if (area.tables.length) {
						return <DineInArea area={area} key={area.id} restaurantPriceId={area.restaurant_price_id} />;
					} else {
						return null;
					}
				})}
			</main>
		</div>
	);
}

export default TableView;
