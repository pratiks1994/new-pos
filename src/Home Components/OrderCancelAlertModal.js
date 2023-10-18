import React, { useRef, useState } from "react";
import styles from "./OrderCancelAlertModal.module.css";
import { Modal } from "react-bootstrap";
import { useCancelOrderMutation } from "../Utils/customMutationHooks";

function OrderCancelAlertModal({ show, hide, finalOrder }) {
	const { mutate: cancelOrderMutate } = useCancelOrderMutation();
	const passwordRef = useRef();
	const [errorMessage, setErrorMessage] = useState("");

	const cancelOrder = finalOrder => {
		
		if (passwordRef.current.value === "biller") {
			cancelOrderMutate({ ...finalOrder, order_status: "cancelled" });
			hide();
		} else {
			
			setErrorMessage("Please enter correct password");
		}
	};

	return (
		<Modal show={show} onHide={hide} backdrop="static" centered animation={false}>
			<Modal.Header closeButton>
				<div className={styles.modalTital}>You want to cancel order !</div>
			</Modal.Header>
			<Modal.Body className={styles.modalBody}>
				<label>Please enter password :</label>
				<input
					ref={passwordRef}
					type="password"
					placeholder="Password"
					onChange={e => {
						
						setErrorMessage("");
					}}
				/>
			</Modal.Body>
			<Modal.Footer className={styles.footer}>
				{errorMessage !== "" && <div className={styles.errMsg}>{errorMessage}</div>}
			
				<button onClick={hide} className={styles.noBtn}>
					NO
				</button>
				<button className={styles.yesBtn} onClick={() => cancelOrder(finalOrder)}>
					{" "}
					Yes{" "}
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default OrderCancelAlertModal;
