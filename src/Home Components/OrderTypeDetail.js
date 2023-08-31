import React, { useState, useEffect } from "react";
import { faLocationDot, faUser, faUsers, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableNumber from "./TableNumber";
import CustomerDetail from "./CustomerDetail";
import PersonCount from "./PersonCount";
import OrderComment from "./OrderComment";
import styles from "./OrderType.module.css";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const orderDetailsMap = [
	{ name: "tableNumber", icon: faLocationDot, displayInOrderType: ["dine_in"] },
	{ name: "personCount", icon: faUsers, displayInOrderType: ["dine_in"] },
	{ name: "customerDetail", icon: faUser, displayInOrderType: ["dine_in", "pick_up", "delivery"] },
	{ name: "orderComment", icon: faPenToSquare, displayInOrderType: ["dine_in", "pick_up", "delivery"] },
];


function OrderTypeDetail({ type }) {
	const [showDetailType, setShowDetailType] = useState(null);
	let [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		if (showDetailType && showDetailType !== "orderComment" && showDetailType !== "customerDetail") {
			if (type === "delivery" || type === "pick_up") {
				setShowDetailType(null);
			}
		}
	}, [type, setShowDetailType]);

	useEffect(() => {
		if (searchParams.get("openTable") === "true") {
			setShowDetailType("tableNumber");
		}
	}, []);

	const filteredDetails = orderDetailsMap.filter((detail) => detail.displayInOrderType.includes(type));

	return (
		<div>
			<div className={`${styles.orderTypeDetail} d-flex`}>
				{filteredDetails.map((detail,idx) => (
					<motion.div
						layout
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.2 }}
						key={detail.name}
						className={`${styles.orderIcon} ${showDetailType === detail.name ? "text-danger" : ""}`}
						onClick={() => setShowDetailType(showDetailType === detail.name ? null : detail.name)}>
						<FontAwesomeIcon icon={detail.icon} />{" "}
					</motion.div>
				))}
			</div>
			<TableNumber showDetailType={showDetailType} />
			<CustomerDetail showDetailType={showDetailType} />
			<PersonCount showDetailType={showDetailType} />
			<OrderComment showDetailType={showDetailType} />
		</div>
	);
}

export default OrderTypeDetail;
