import React, { useEffect, useRef } from "react";
import styles from "./DiscountModal.module.css";
import { Modal } from "react-bootstrap";
import DiscountDetail from "./DiscountDetail";
import { useDispatch, useSelector } from "react-redux";
import { applyDiscount, modifyCartData } from "../Redux/finalOrderSlice";

function DiscountModal({ show, hide }) {
	const dispatch = useDispatch();
	
	const flatDiscountRef = useRef();
	const percentDiscountRef = useRef();
	const discountRef = useRef();

	const addDiscount = () => {
		const discountType = flatDiscountRef.current.checked ? flatDiscountRef.current.value : percentDiscountRef.current.value;
		const discount = +discountRef.current.value;
		dispatch(applyDiscount({discountType,discount}))
		hide()
		

	};



	
	return (
		<Modal show={show} onHide={hide} size="md" aria-labelledby="contained-modal-title-vcenttyer" centered animation={false} backdrop="static">
			<Modal.Header closeButton className={styles.modelHeader}>
				Discount
			</Modal.Header>
			<Modal.Body className={styles.modalBody}>
				<DiscountDetail flatDiscountRef={flatDiscountRef} percentDiscountRef={percentDiscountRef} discountRef={discountRef} />
			</Modal.Body>
			<Modal.Footer className={styles.modelFooter}>
				<button onClick={hide} className={styles.closeBtn}>
					Cancel
				</button>
				<button className={styles.saveBtn} onClick={() => addDiscount()}>
					{" "}
					Apply{" "}
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default DiscountModal;
