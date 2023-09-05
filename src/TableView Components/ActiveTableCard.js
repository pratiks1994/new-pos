import React, { useState } from "react";
import styles from "./ActiveTableCard.module.css";
import MinTimer from "./MinTimer";
import saveAndPrint from "../icons/save-print.png";
import saveAndSettle from "../icons/save-settle.png";
import { setActive } from "../Redux/UIActiveSlice";
import { liveOrderToCart } from "../Redux/finalOrderSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import SettleOrderModal from "../Live View Components/SettleOrderModal";
import { convertOrder } from "../Utils/convertOrder";
import { executeBillPrint } from "../Utils/executePrint";
import { useGetPrintersQuery } from "../Utils/customQueryHooks";
import sortPrinters from "../Utils/shortPrinters";

function ActiveTableCard({ order }) {

	const { IPAddress } = useSelector(state => state.serverConfig);
	const {data: printerArr} = useGetPrintersQuery()
	const printers = printerArr?.length ?  sortPrinters(printerArr) : []

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [showSettleModal, setShowSettleModal] = useState(false);

	const updateLiveOrders = async ({ orderStatus, orderId, orderType, KOTId, print_count, tip, paymentType, customerPaid, settleAmount, multipay }) => {
		let { data } = await axios.put(`http://${IPAddress}:3001/liveorders`, {
			orderStatus,
			orderId,
			orderType,
			KOTId,
			print_count,
			tip,
			paymentType,
			customerPaid,
			settleAmount,
			multipay,
		});
		return data;
	};

	const { mutate: orderMutation, isLoading } = useMutation({
		mutationFn: updateLiveOrders,
	});

	const getTableTheme = print_count => {
		if (print_count !== 0) {
			return { style: { backgroundColor: `rgba(0, 72, 167, 0.301)` }, icon: saveAndSettle };
		} else {
			return { style: {}, icon: saveAndPrint };
		}
	};

	const moveOrderToHome = order => {
		dispatch(liveOrderToCart({ order }));
		dispatch(setActive({ key: "isCartActionDisable", name: true }));
		navigate("/Home");
	};

	const handleClick = async () => {
		if (order.print_count === 1 && order.order_type === "dine_in") {
			setShowSettleModal(true);
		} else {
			const orderToPrint = convertOrder(order);
			await executeBillPrint(orderToPrint, printers);

			orderMutation({
				orderStatus: order.order_status,
				orderId: order.id,
				orderType: order.order_type,
				KOTId: order.KOTDetail.id,
				print_count: order.print_count,
				paymentType: null,
				customerPaid: null,
				tip: null,
				settleAmount: null,
				multipay: null,
			});
		}
	};

	return (
		<motion.div layout className={styles.container} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}>
			<div className={styles.tableCard} style={getTableTheme(order.print_count).style} onClick={() => moveOrderToHome(order)}>
				<div>
					<MinTimer startTime={order.created_at} />
				</div>
				<div className={styles.tableNo}>{order.dine_in_table_no}</div>
				<div className={styles.total}>₹ {order.total.toFixed(2)}</div>
			</div>
			<img className={styles.actionIcon} src={getTableTheme(order.print_count).icon} onClick={handleClick} />
			{showSettleModal && <SettleOrderModal show={showSettleModal} hide={() => setShowSettleModal(false)} order={order} orderMutation={orderMutation} isLoading={isLoading} />}
		</motion.div>
	);
}

export default ActiveTableCard;
