import React from "react";
import styles from "./KOTExistAlertModal.module.css";
import { Modal, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { resetFinalOrder } from "../Redux/finalOrderSlice";
import { useMutation } from "react-query";
import { executeBillPrint, executeKotPrint } from "../Utils/executePrint";
import { convertOrder } from "../Utils/convertOrder";

function KOTExistAlertModal({ show, hide, IPAddress, finalOrder, notify, printers, shouldPrintOrder, setShouldPrintOrder }) {
	const dispatch = useDispatch();

	const handleConfirm = async (finalOrder) => {
		const printCount = shouldPrintOrder ? 1 : 0;
		let { data } = await axios.post(`http://${IPAddress}:3001/includeKOTsAndCreateOrder`, { ...finalOrder, printCount });
		return data;
	};

	const { mutate, isLoading } = useMutation({
		mutationKey: "includeKOTsAndCreateOrder",
		mutationFn: handleConfirm,
		onSuccess: async (data) => {
			console.log(data);
			const { orderNo, kotTokenNo, order } = data;

			if (shouldPrintOrder) {
				try {
					const orderToPrint = convertOrder(order);
					await executeKotPrint({ ...finalOrder, kotTokenNo }, printers);
					await executeBillPrint(orderToPrint, printers);
				} catch (err) {
					console.log(err);
				}
			}

			setShouldPrintOrder(false);
			hide();
			dispatch(resetFinalOrder());
			notify("success", "Orders and KOT updated");
		},
	});

	const handleCancel = () => {
		hide();
		setShouldPrintOrder(false);
	};

	return (
		<Modal
			show={show}
			onHide={hide}
			backdrop="static"
			centered
			animation={false}>
			<Modal.Body className={styles.modalBody}>
				<Row>
					<Col className={styles.message}>There are some older KOTs exist in mentioned table do you want to merge into current order</Col>
				</Row>
				<Row>
					<Col className={styles.modalControl}>
						<button
							className={styles.okBtn}
							onClick={() => mutate(finalOrder)}
							disabled={isLoading}>
							{isLoading ? "Loading" : "OK"}
						</button>
						<button
							className={styles.cancelBtn}
							onClick={handleCancel}>
							Cancel
						</button>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	);
}

export default KOTExistAlertModal;
