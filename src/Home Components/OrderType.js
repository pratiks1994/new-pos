import React from "react";
import styles from "./OrderType.module.css";
import OrderTypeDetail from "./OrderTypeDetail";
import { useSelector, useDispatch } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";
import { setActive } from "../Redux/UIActiveSlice";

const orderTypesMap = [
	{ name: "dine_in", displayName: "Dine In" },
	{ name: "delivery", displayName: "Delivery" },
	{ name: "pick_up", displayName: "Pick Up" },
];

function OrderType() {
	const dispatch = useDispatch();
	const orderType = useSelector((state) => state.finalOrder.orderType);
	const defaultRestaurantPrice = useSelector((state) => state.bigMenu.defaultSettings.default_restaurant_price);

	const handleOrderType = (orderType) => {
		if (orderType === "delivery" || orderType === "pick_up") {
			dispatch(modifyCartData({ tableNumber: "" }));
		}
		dispatch(setActive({ key: "restaurantPriceId", name: +defaultRestaurantPrice || null }));
		dispatch(modifyCartData({ orderType }));
	};

	return (
		<div className="flex-shrink-0">
			<div className={`d-flex ${styles.orderTypeBtn}`}>
				{orderTypesMap.map((type) => {
					return (
						<button key={type.name}
							className={`flex-grow-1 ${orderType === type.name ? "bg-danger" : "none"}`}
							onClick={() => handleOrderType(type.name)}>
							{type.displayName}
						</button>
					);
				})}
			</div>
			<OrderTypeDetail type={orderType} />
		</div>
	);
}

export default OrderType;
