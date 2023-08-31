import React, { useState, useMemo } from "react";
import styles from "./TableView.module.css";
import { useQuery } from "react-query";
import axios from "axios";
import { setBigMenu } from "../Redux/bigMenuSlice";
import { useSelector, useDispatch } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";
import { useNavigate } from "react-router-dom";
import useSocket from "../Utils/useSocket";
import { resetFinalOrder } from "../Redux/finalOrderSlice";
import DineInArea from "../TableView Components/DineInArea";
import { setActive } from "../Redux/UIActiveSlice";

function TableView() {
	const [orders, setOrders] = useState([]);
	const { areas, defaultSettings } = useSelector((state) => state.bigMenu);
	const { IPAddress, refetchInterval } = useSelector((state) => state.serverConfig);
	const defaultRestaurantPrice = defaultSettings.default_restaurant_price;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const matchOrderAndTables = (orders, areas) => {
		const ListedTableNo = []; // to list all the tables available in databse

		const areasWithOrders = areas?.map((area) => {
			const updatedTableWithOrder = area.tables.map((table) => {
				ListedTableNo.push(table.table_no);
				const orderOnTable = orders.filter((order) => order.order_type === "dine_in" && order.dine_in_table_no === table.table_no);
				return { ...table, orders: orderOnTable };
			});
			return { ...area, tables: updatedTableWithOrder };
		});

		const otherOrders = orders.filter((order) => order.order_type === "dine_in" && !ListedTableNo.includes(order.dine_in_table_no));
		const otherTables = otherOrders.map((order) => {
			return { id: +order.id, table_no: order.dine_in_table_no.toString(), area_id: areas.length + 1, orders: [order] };
		});

		const otherArea = {
			id: areas.length + 1,
			restaurant_id: 1,
			restaurant_price_id: 4,
			area: "Other Tables",
			tables: otherTables,
		};

		return [...areasWithOrders, otherArea];
	};

	const getLiveOrders = async () => {
		let { data } = await axios.get(`http://${IPAddress}:3001/liveorders`);
		return data;
	};

	const { status, isLoading, error, isError } = useQuery("liveOrders", getLiveOrders, {
		refetchInterval: refetchInterval,
		refetchIntervalInBackground: refetchInterval,
		onSuccess: (data) => {
			setOrders(() => [...data]);
		},
		enabled: !!IPAddress,
	});

	const getCategories = async () => {
		let { data } = await axios.get(`http://${IPAddress}:3001/menuData`);
		return data;
	};

	//   react query api call for data chashing, loading and error state management
	const { data } = useQuery("bigMenu", getCategories, {
		staleTime: 1200000,
		onSuccess: (data) => {
			dispatch(setBigMenu({ data }));
		},
		enabled: !!IPAddress,
	});

	useSocket("orders", (data) => {
		setOrders(() => [...data]);
	});

	const handleClick = (orderType) => {
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

				{allAreas?.map((area) => {
					if (area.tables.length) {
						return (
							<DineInArea
								area={area}
								key={area.id}
								restaurantPriceId={area.restaurant_price_id}
							/>
						);
					} else {
						return null;
					}
				})}
			</main>
		</div>
	);
}

export default TableView;
