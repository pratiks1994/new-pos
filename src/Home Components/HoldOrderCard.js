import React from "react";
import styles from "./HoldOrderCard.module.css";
import { useMutation, useQueryClient } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { holdToFinalOrder } from "../Redux/finalOrderSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HoldOrderCard({ order, setShowHoldOrders }) {
	const dispatch = useDispatch();
	const { IPAddress } = useSelector(state => state.serverConfig);
	const navigate = useNavigate();

	const deletHoldOrders = async id => {
		let { data } = await axios.delete(`http://${IPAddress}:3001/holdOrder`, { params: { id } });
	};

	const holdOrderMutation = useMutation({
		mutationFn: deletHoldOrders,
	});

	const setAsFinalOrder = async order => {
		dispatch(holdToFinalOrder({ order }));
		holdOrderMutation.mutate(order.id);
		await setShowHoldOrders(false);
		navigate("/Home");
	};

	return (
		<div className={styles.holdOrderCard}>
			<div onClick={() => setAsFinalOrder(order)}>
				<div className={styles.cardHeader}>
					<div>
						HOLD NO : {order.id} | {order.order_type}
					</div>
					<div>{order.created_at}</div>
				</div>
				<div className={styles.total}>₹ {order.total}</div>
				<div className={styles.customerDetail}>
					{order.customer_name ? order.customer_name : "----"} | {order.phone_number ? order.phone_number : "----"}{" "}
				</div>
			</div>

			<div className={styles.actions}>
				<div>
					kept on hold by :<br /> biller
				</div>
				<button onClick={() => holdOrderMutation.mutate(order.id)}>Discard</button>
			</div>
		</div>
	);
}

export default HoldOrderCard;
