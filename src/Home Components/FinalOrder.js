import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./FinalOrder.module.css";
import { incrementQty, decrementQty, removeItem } from "../Redux/finalOrderSlice";
import { motion } from "framer-motion";
import FinalOrderItemModal from "./FinalOrderItemModal";

function FinalOrder({ currentOrderItemId, itemQty, itemName, itemTotal, variantName, multiItemTotal, itemTax, toppings, itemNotes, defaultPriceType }) {
	const [showItemModal, setShowItemModal] = useState(false);

	const totalTax = itemTax.reduce((acc, tax) => (acc += tax.tax), 0);

	const dispatch = useDispatch();

	const addQty = id => {
		dispatch(incrementQty({ id }));
	};

	const removeQty = id => {
		dispatch(decrementQty({ id }));
	};

	const remove = itemId => {
		dispatch(removeItem({ itemId }));
	};

	return (
		<motion.div
			layout
			className={styles.finalOrderItem}
			initial={{ opacity: 0, scale: 0.5 }}
			exit={{ opacity: 0, scale: 0.5 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.15 }}>
			<div className={styles.itemNameContainer}>
				<div
					className={styles.removeBtn}
					onClick={() => {
						remove(currentOrderItemId);
					}}>
					x
				</div>
				<div
					className={styles.itemName}
					onClick={e => {
						setShowItemModal(true);
						e.stopPropagation();
					}}>
					{itemName} {variantName ? `- ${variantName}` : null}
				</div>
			</div>
			<div className={styles.quantityControls}>
				<div className={styles.minusBtn} onClick={() => removeQty(currentOrderItemId)}>
					-
				</div>
				<div className={styles.itemQuantity}>{itemQty}</div>
				<div className={styles.plusbtn} onClick={() => addQty(currentOrderItemId)}>
					+
				</div>
			</div>
			<div className={styles.itemPrice}>
				<div>{defaultPriceType === "with_tax" ? (multiItemTotal + totalTax).toFixed(2) : multiItemTotal.toFixed(2)}</div>
			</div>

			{/* <div
				className={styles.name}
				onClick={e => {
					setShowItemModal(true);
					e.stopPropagation();
				}}>
				<span
					className={styles.remove}
					onClick={() => {
						remove(currentOrderItemId);
					}}>
					{" "}
					x{" "}
				</span>
				{` ${itemName} `}
			</div>
			<div className={styles.qty}>
				<button
					onClick={() => removeQty(currentOrderItemId)}
					className={styles.btn}>
					-
				</button>
				{itemQty}
				<button
					className={styles.btn}
					onClick={() => addQty(currentOrderItemId)}>
					+
				</button>
			</div>
			<div className={styles.total}>{defaultPriceType === "with_tax" ? (multiItemTotal + totalTax).toFixed(2) : multiItemTotal.toFixed(2)}</div> */}

			{showItemModal && (
				<FinalOrderItemModal
					show={showItemModal}
					hideModal={() => setShowItemModal(false)}
					currentOrderItemId={currentOrderItemId}
					itemTax={itemTax}
					toppings={toppings}
					itemName={itemName}
					variantName={variantName}
					itemNotes={itemNotes}
				/>
			)}
		</motion.div>
	);
}

export default FinalOrder;
