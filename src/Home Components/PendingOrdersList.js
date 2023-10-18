import React, { memo } from "react";
import styles from "./PendingOrdersList.module.css";
import Loading from "../Feature Components/Loading";
import PendingOrderCard from "./PendingOrderCard";
import { useGetPrintersQuery } from "../Utils/customQueryHooks";
import sortPrinters from "../Utils/shortPrinters";

function PendingOrdersList({ pendingOrders, isLoading }) {
	const { data: printerArr } = useGetPrintersQuery();
	const printers = printerArr?.length ? sortPrinters(printerArr) : [];

	if (isLoading) {
		return <Loading />;
	}

	
	return (
		<div className={styles.pendingOrderContainer}>
			{pendingOrders.length ?pendingOrders.map((order, idx) => (
				<PendingOrderCard order={order} key={order.id} idx={idx} printers={printers} />
			))
			:
			<div className={styles.noPendingOrders}>There are no pending orders</div> }
		</div>
	);
}

export default memo(PendingOrdersList);
