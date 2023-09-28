import React from "react";
import styles from "./TotalTiles.module.css";
import { AnimatePresence, motion } from "framer-motion";

function TotalTiles({ title, amount, bgColor }) {
	return (
		<AnimatePresence>
			{" "}
			<motion.div
				layout
				key="totalTiles"
				initial="collapsed"
				animate="open"
				exit="collapsed"
				variants={{
					open: { opacity: 1, scale: 1 },
					collapsed: { opacity: 0, scale: 0.8 },
				}}
				transition={{ type: "spring", stiffness: 600, damping: 20 }}
				className={styles.tile}
				style={{ backgroundColor: bgColor }}>
				<div className={styles.tileName}>{title}</div>
				<div className={styles.tileAmount}>
					{" "}
					₹{" "}
					{amount.toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}{" "}
				</div>
			</motion.div>
		</AnimatePresence>
	);
}

export default TotalTiles;
