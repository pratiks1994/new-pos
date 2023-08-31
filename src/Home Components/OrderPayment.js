import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./OrderPayment.module.css";
import PaymentBreakdown from "./PaymentBreakdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { resetFinalOrder } from "../Redux/finalOrderSlice";
import { modifyCartData } from "../Redux/finalOrderSlice";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useQueryClient, useMutation } from "react-query";
import { setActive } from "../Redux/UIActiveSlice";
import OrderExistAlertModal from "./OrderExistAlertModal";
import KOTExistAlertModal from "./KOTExistAlertModal";
import notify from "../Feature Components/notify";
import { executeBillPrint, executeKotPrint } from "../Utils/executePrint";
import { convertOrder } from "../Utils/convertOrder";

function OrderPayment() {
	// get finalOrder state from redux store
	const queryClient = useQueryClient();
	const finalOrder = useSelector((state) => state.finalOrder);
	const printers = useSelector((state) => state.printerSettings);

	const isCartActionDisable = useSelector((state) => state.UIActive.isCartActionDisable);
	const [shouldPrintOrder, setShouldPrintOrder] = useState(false);
	const [showOrderExistModal, setShowOrderExistModal] = useState(false);
	const [showKOTExistMOdal, setShowKOTExistModal] = useState(false);

	const { IPAddress } = useSelector((state) => state.serverConfig);
	const dispatch = useDispatch();

	// add payment method to finalOrder redux state
	const handleChange = (e) => {
		let { name, value } = e.target;
		dispatch(modifyCartData({ [name]: value }));
	};

	// on save post api call to backend

	const saveOrder = async (finalOrder, printers) => {
		if (finalOrder.orderType === "dine_in" && finalOrder.tableNumber === "") {
			notify("err", "please Enter Table No.");
			return;
		}

		if (finalOrder.orderCart.length !== 0) {
			const { data } = await axios.post(`http://${IPAddress}:3001/order`, finalOrder);
			if (data.isOldKOTsExist) {
				setShowKOTExistModal(true);
				return;
			}

			notify("success", "order Placed");
			// set finalorder redux state to initial state after api call completion
			// let responce = await window.apiKey.request("print", finalOrder);

			dispatch(resetFinalOrder());
			queryClient.invalidateQueries({ queryKey: ["KOTs", "liveOrders"] });
		} else {
			notify("err", "Cart is Empty");
		}
	};

	const saveAndPrintOrder = async (finalOrder, printers) => {
		if (finalOrder.orderType === "dine_in" && finalOrder.tableNumber === "") {
			notify("err", "please Enter Table No.");
			return;
		}

		if (finalOrder.orderCart.length !== 0) {
			const { data } = await axios.post(`http://${IPAddress}:3001/order`, { ...finalOrder, printCount: 1 });

			if (data.isOldKOTsExist) {
				setShouldPrintOrder(true);
				setShowKOTExistModal(true);
				return;
			}

			const orderToPrint = convertOrder(data.order);

			await executeBillPrint(orderToPrint, printers);

			if (!data.isOldOrderExist) {
				await executeKotPrint({ ...finalOrder, kotTokenNo: data.kotTokenNo, orderNo: data.orderNo }, printers);
			}

			notify("success", "order Placed");

			dispatch(resetFinalOrder());
			queryClient.invalidateQueries({ queryKey: ["KOTs", "liveOrders"] });
		} else {
			notify("err", "Cart is Empty");
		}
	};

	const holdOrder = async () => {
		if (finalOrder.orderCart.length !== 0) {
			let res = await axios.post(`http://${IPAddress}:3001/holdOrder`, finalOrder);
			if (res.statusText === "OK") {
				notify("success");
				// set finalorder redux state to initial state after api call completion
				dispatch(resetFinalOrder());
			}
		} else {
			notify("err", "Cart is Empty");
		}
	};

	const createKOT = async (finalOrder, printers) => {
		if (finalOrder.orderType === "dine_in" && finalOrder.tableNumber === "") {
			notify("err", "please Enter Table No.");
			return;
		}

		if (finalOrder.orderCart.length !== 0) {
			let res = await axios.post(`http://${IPAddress}:3001/KOT`, finalOrder);
			console.log(res.data);

			if (res.statusText === "OK" && !res.data.orderExist) {
				finalOrder = { ...finalOrder, kotTokenNo: res.data.kotTokenNo };

				await executeKotPrint(finalOrder, printers);

				queryClient.invalidateQueries("KOTs");

				notify("success", "KOT Success");
				// set finalorder redux state to initial state after api call completion

				dispatch(resetFinalOrder());
			} else if (res.statusText === "OK" && res.data.orderExist) {
				setShowOrderExistModal(true);
			} else {
				notify("err", "something went wrong");
			}
		} else {
			notify("err", "Cart is Empty");
		}
	};

	const updateLiveOrders = async ({ orderStatus, orderId }) => {
		const DineInStatus = ["accepted", "printed", "settled"];
		let updatedStatus;

		const current = DineInStatus.findIndex((element) => element === orderStatus);
		updatedStatus = DineInStatus[current + 1];

		try {
			let { data } = await axios.put(`http://${IPAddress}:3001/liveorders`, { updatedStatus, orderId });
			console.log(data);

			if (data === "updated") {
				if (updatedStatus === "settled") {
					dispatch(resetFinalOrder());
					dispatch(setActive({ key: "isCartActionDisable", name: false }));
				} else {
					dispatch(modifyCartData({ order_status: updatedStatus }));
				}
				notify("success", "status updated");
			} else {
				notify("err", "something Went wrong");
			}

			return data;
		} catch (err) {
			notify("err", "Something Went Wrong");
		}
	};

	const { mutate: orderMutation, isLoading } = useMutation({
		mutationFn: updateLiveOrders,
		// onSettled: () => {
		//       queryClient.invalidateQueries("liveOrders");
		// },
	});

	const getBtnTheme = (status) => {
		if (status === "accepted") {
			return { name: "Save & Print", style: null };
		}

		if (status === "printed") {
			return { name: "Save & Settle", style: { backgroundColor: "rgb(51, 51, 51)", color: "white" } };
		}
	};
	//  calculate the tax ,subTotal, cartTotal every time finalOrder.orderCart changes and send/dispatch its value to finalOrder redux store

	
	const [showPaymentBreakdown, setShowPaymentBreakdown] = useState(false);

	const chevronPosition = showPaymentBreakdown ? <FontAwesomeIcon icon={faCaretDown} /> : <FontAwesomeIcon icon={faCaretUp} />;

	return (
		<div className={styles.orderPayment}>
			<PaymentBreakdown
				showPaymentBreakdown={showPaymentBreakdown}
				setShowPaymentBreakdown={setShowPaymentBreakdown}
			/>

			<button
				className={styles.paymentBreakdownToggle}
				name="toggleBreakdown"
				onClick={() => setShowPaymentBreakdown(!showPaymentBreakdown)}>
				{chevronPosition}
			</button>

			<div className={`${styles.total} d-flex justify-content-end`}>
				<div className="m-2 my-3 text-light fs-6">Total</div>
				<div className="mx-3 my-3 text-warning fw-bold"> ₹ {finalOrder.cartTotal.toFixed(2)} </div>
			</div>

			<div className={`${styles.paymentModes} d-flex justify-content-around`}>
				<label>
					<input
						className="mx-2 my-2"
						type="radio"
						name="paymentMethod"
						onChange={handleChange}
						value="cash"
						checked={finalOrder.paymentMethod === "cash"}
					/>
					Cash
				</label>

				<label>
					<input
						className="mx-2 my-2"
						type="radio"
						name="paymentMethod"
						onChange={handleChange}
						value="card"
						checked={finalOrder.paymentMethod === "card"}
					/>
					Card
				</label>
				<label>
					<input
						className="mx-2 my-2"
						type="radio"
						name="paymentMethod"
						onChange={handleChange}
						value="due"
						checked={finalOrder.paymentMethod === "due"}
					/>
					Due
				</label>
				<label>
					<input
						className="mx-2 my-2"
						type="radio"
						name="paymentMethod"
						onChange={handleChange}
						value="other"
						checked={finalOrder.paymentMethod === "other"}
					/>
					Other
				</label>
			</div>

			<div className={`${styles.paymentModesCheck} d-flex justify-content-center p-2  text-white`}>
				<input type="checkbox" />
				<label className="ms-3">its paid</label>
			</div>

			<div className={`${styles.ProcessOrderBtns} d-flex justify-content-center bg-light pt-3 pb-3 flex-wrap`}>
				{!isCartActionDisable ? (
					<div>
						<Button
							variant="danger"
							size="sm"
							className="mx-1 py-1 px-4 fw-bold text-nowrap rounded-1"
							onClick={() => saveOrder(finalOrder, printers)}>
							{" "}
							Save{" "}
						</Button>
						<Button
							variant="danger"
							size="sm"
							className="mx-1 py-1 px-2 fw-bold text-nowrap rounded-1"
							onClick={() => saveAndPrintOrder(finalOrder, printers)}>
							{" "}
							Save & Print
						</Button>
						{/* <Button variant="danger" size="sm" className="mx-1 py-1 fw-light px-2 fw-normal text-nowrap rounded-1"> Save & eBill </Button> */}
						{/* <Button variant="secondary" size="sm" className="mx-1 py-1 fw-light px-2 fw-normal text-nowrap rounded-1"> KOT </Button> */}
						<Button
							variant="secondary"
							size="sm"
							className="mx-1 py-1 px-2 fw-bold text-nowrap rounded-1"
							onClick={() => createKOT(finalOrder, printers)}>
							{" "}
							KOT & Print{" "}
						</Button>
						<Button
							variant="white"
							size="sm"
							className="mx-1 py-1 px-2 fw-bold border-1 border border-dark text-nowrap rounded-1"
							onClick={holdOrder}>
							{" "}
							HOLD{" "}
						</Button>
					</div>
				) : (
					<div>
						<Button
							variant="danger"
							size="sm"
							className="mx-1 py-1 px-4 fw-bold text-nowrap rounded-1"
							// onClick={() => orderMutation({ orderStatus: finalOrder.order_status, orderId: finalOrder.id })}
							style={{ pointerEvents: "all" }}>
							{getBtnTheme(finalOrder.order_status).name}
						</Button>
					</div>
				)}
			</div>
			{showOrderExistModal && (
				<OrderExistAlertModal
					show={showOrderExistModal}
					hide={() => setShowOrderExistModal(false)}
					IPAddress={IPAddress}
					finalOrder={finalOrder}
					printers={printers}
					notify={notify}
				/>
			)}
			{showKOTExistMOdal && (
				<KOTExistAlertModal
					show={showKOTExistMOdal}
					hide={() => {
						setShowKOTExistModal(false);
					}}
					shouldPrintOrder={shouldPrintOrder}
					setShouldPrintOrder={setShouldPrintOrder}
					printers={printers}
					IPAddress={IPAddress}
					finalOrder={finalOrder}
					notify={notify}
				/>
			)}
		</div>
	);
}

export default OrderPayment;
