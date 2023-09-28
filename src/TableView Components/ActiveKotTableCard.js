import { motion } from "framer-motion";
import React, { useMemo } from "react";
import MinTimer from "./MinTimer";
import styles from "./ActiveKotTableCard.module.css";
import saveAndPrint from "../icons/save-print.png";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import { convertOrder } from "../Utils/convertOrder";
import { executeBillPrint } from "../Utils/executePrint";
import notify from "../Feature Components/notify";
import { useGetPrintersQuery } from "../Utils/customQueryHooks";

function ActiveKotTableCard({ orders, areaId ,printers  }) {
	const IPAddress = useSelector(state => state.serverConfig.IPAddress);
	

	const allKotOnTableTotal = useMemo(
		() =>
			orders.reduce((acc1, order) => {
				return (acc1 += order.items.reduce((acc2, item) => {
					return (acc2 += (item.price + item.tax) * item.quantity);
				}, 0));
			}, 0),
		[orders]
	);

	const convertKotsToOrder = async emptyOrder => {
		let { data } = await axios.post(`http://${IPAddress}:3001/includeKOTsAndCreateOrder`, emptyOrder);
		return data;
	};

	const { mutate, isLoading } = useMutation({
		mutationKey: "includeKOTsAndCreateOrder",
		mutationFn: convertKotsToOrder,
		onSuccess: async data => {
			const { orderNo, kotTokenNo, order } = data;
			const orderToPrint = convertOrder(order);

			try {
				await executeBillPrint(orderToPrint, printers);
				notify("success", "order Created")
			} catch (error) {
				console.log(error);
			}
		},
	});

	const saveAndPrintOrder = orders => {
		const emptyOrder = {
			id: "",
			printCount: 1,
			customerName: orders[0].customer_name,
			customerContact: orders[0].phone_number.toString(),
			customerAdd: orders[0].address,
			customerLocality: orders[0].landmark,
			tableArea: areaId,
			orderCart: [],
			subTotal: 0,
			tax: 0,
			deliveryCharge: 0,
			packagingCharge: 0,
			discount: 0,
			paymentMethod: "cash",
			tableNumber: orders[0].table_no.toString(),
			personCount: 0,
			orderType: "dine_in",
			orderComment: "",
			cartTotal: 0,
			order_status: "accepted",
		};

		mutate(emptyOrder);
	};

	return (
		<motion.div layout className={styles.container} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}>
			<div className={styles.tableCard}>
				<div>
					<MinTimer startTime={orders[0].created_at} />
				</div>
				<div className={styles.tableNo}>{orders[0].table_no}</div>
				<div className={styles.total}>₹ {allKotOnTableTotal.toFixed(2)}</div>
			</div>
			<img className={styles.actionIcon} src={saveAndPrint} onClick={() => saveAndPrintOrder(orders)} />
		</motion.div>
	);
}

export default ActiveKotTableCard;
