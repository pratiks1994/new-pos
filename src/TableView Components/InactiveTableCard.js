import React from "react";
import styles from "./InactiveTableCard.module.css";
import { resetFinalOrder } from "../Redux/finalOrderSlice";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";
import { useNavigate } from "react-router-dom";
import { setActive } from "../Redux/UIActiveSlice";

function InactiveTableCard({ table }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleTableClick = (tableNo) => {
        dispatch(resetFinalOrder())
		dispatch(setActive({key:"isCartActionDisable",name:false}))
		dispatch(modifyCartData({ tableNumber: tableNo }));
		dispatch(modifyCartData({ orderType: "dine_in" }));
		navigate("..?openTable=true" );
	};

	return (
		<motion.div
			layout
			className={styles.container}
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.15 }}>
			<div
				className={styles.tableCard}
				onClick={() => handleTableClick(table.table_no)}>
				<div className={styles.tableNo}>{table.table_no} </div>
				<div className={styles.message}> Click to Add</div>
			</div>
		</motion.div>
	);
}

export default InactiveTableCard;
