import React from "react";
import styles from "./LiveViewNav.module.css";
import { Link, NavLink, useLocation, useNavigate, useResolvedPath } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setActive } from "../Redux/UIActiveSlice";
import BackButton from "../Feature Components/BackButton";
import { AnimatePresence, motion } from "framer-motion";

function LiveViewNav() {
	const { liveViewOrderStatus } = useSelector(state => state.UIActive);
	const dispatch = useDispatch();
	const path = useResolvedPath();

	const handleClick = name => {
		const key = "liveViewOrderStatus";

		dispatch(setActive({ key, name }));
	};

	const fitlers = [
		{ name: "FoodReady", number: 0 },
		{ name: "Dispatch", number: 0 },
		{ name: "Deliver", number: 0 },
	];

	const isKOT = path.pathname === "/Home/LiveView/KOTView";

	return (
		<nav className={styles.liveViewNav}>
			<NavLink to="OrderView" end className={({ isActive }) => (isActive ? `${styles.active} ${styles.navLink}` : styles.navLink)}>
				Order View
			</NavLink>
			<NavLink to="KOTView" end className={({ isActive }) => (isActive ? `${styles.active} ${styles.navLink}` : styles.navLink)}>
				KOT View
			</NavLink>
			<div className={styles.OrderStatusFilter}>
				<AnimatePresence>
					{!isKOT &&
						fitlers.map((filter, idx) => {
							return (
								<motion.div
									layout
									initial="collapsed"
									animate="open"
									exit="collapsed"
									variants={{
										open: { x: 0, opacity: 1 },
										collapsed: { x: 80, opacity: 0 },
									}}
									transition={{ duration: 0.15, delay: idx * 0.07 }}
									key={filter.name}
									className={liveViewOrderStatus === filter.name ? `${styles.filter} ${styles.active}` : `${styles.filter}`}
									onClick={() => handleClick(filter.name)}>
									<span>{filter.name}</span> <div className={styles.badge}>{filter.number}</div>
								</motion.div>
							);
						})}
				</AnimatePresence>

				<Link to="../" className={styles.backBtn}>
					{" "}
					&#x2190; Back
				</Link>
			</div>
		</nav>
	);
}

export default React.memo(LiveViewNav);
