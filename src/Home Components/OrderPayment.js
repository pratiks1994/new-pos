import React from "react";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import styles from "./OrderPayment.module.css";
import PaymentBreakdown from "./PaymentBreakdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { calculateCartTotal, resetFinalOrder } from "../Redux/finalOrderSlice";
import { modifyCartData } from "../Redux/finalOrderSlice";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderPayment() {
     // get finalOrder state from redux store

     const finalOrder = useSelector((state) => state.finalOrder);
     const { IPAddress } = useSelector((state) => state.serverConfig);
     const dispatch = useDispatch();
     const notify = () => {
          toast.success("Order Placed!", {
               position: "top-center",
               autoClose: 2000,
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "colored",
          });
     };

     // add payment method to finalOrder redux state
     const handleChange = (e) => {
          let { name, value } = e.target;
          dispatch(modifyCartData({ [name]: value }));
     };

     // on save post api call to backend

     const saveOrder = async () => {
          if (finalOrder.orderCart.length !== 0) {
               let res = await axios.post(`http://${IPAddress}:3001/order`, finalOrder);

               notify();
          }

          // set finalorder redux state to initial state after api call completion

          dispatch(resetFinalOrder());

          let res = await window.apiKey.request("print", finalOrder);
     };

     //  calculate the tax ,subTotal, cartTotal every time finalOrder.orderCart changes and send/dispatch its value to finalOrder redux store

     useEffect(() => {
          let subTotal = 0;
          finalOrder.orderCart.forEach((item) => {
               subTotal += item.multiItemTotal;
          });

          let tax = subTotal * 0.05;
          let cartTotal = subTotal + tax;

          dispatch(calculateCartTotal({ subTotal, tax, cartTotal }));
     }, [finalOrder.orderCart, dispatch]);

     const [showPaymentBreakdown, setShowPaymentBreakdown] = useState(false);

     const chevronPosition = showPaymentBreakdown ? (
          <FontAwesomeIcon icon={faCaretDown} />
     ) : (
          <FontAwesomeIcon icon={faCaretUp} />
     );

     return (
          <div className={styles.orderPayment}>
               <PaymentBreakdown
                    showPaymentBreakdown={showPaymentBreakdown}
                    setShowPaymentBreakdown={setShowPaymentBreakdown}
               />
               <ToastContainer />

               <button
                    className={styles.paymentBreakdownToggle}
                    name="toggleBreakdown"
                    onClick={() => setShowPaymentBreakdown(!showPaymentBreakdown)}
               >
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
                              value="Cash"
                              checked={finalOrder.paymentMethod === "Cash"}
                         />
                         Cash
                    </label>

                    <label>
                         <input
                              className="mx-2 my-2"
                              type="radio"
                              name="paymentMethod"
                              onChange={handleChange}
                              value="Card"
                              checked={finalOrder.paymentMethod === "Card"}
                         />
                         Card
                    </label>
                    <label>
                         <input
                              className="mx-2 my-2"
                              type="radio"
                              name="paymentMethod"
                              onChange={handleChange}
                              value="Due"
                              checked={finalOrder.paymentMethod === "Due"}
                         />
                         Due
                    </label>
                    <label>
                         <input
                              className="mx-2 my-2"
                              type="radio"
                              name="paymentMethod"
                              onChange={handleChange}
                              value="Other"
                              checked={finalOrder.paymentMethod === "Other"}
                         />
                         Other
                    </label>
               </div>

               <div className={`${styles.paymentModesCheck} d-flex justify-content-center p-2  text-white`}>
                    <input type="checkbox" />
                    <label className="ms-3">its paid</label>
               </div>

               <div className={`${styles.ProcessOrderBtns} d-flex justify-content-center bg-light pt-3 pb-3 flex-wrap`}>
                    <Button
                         variant="danger"
                         size="sm"
                         className="mx-1 py-1 px-4 fw-bold text-nowrap rounded-1"
                         onClick={saveOrder}
                    >
                         {" "}
                         Save{" "}
                    </Button>
                    <Button variant="danger" size="sm" className="mx-1 py-1 px-2 fw-bold text-nowrap rounded-1">
                         {" "}
                         Save & Print
                    </Button>
                    {/* <Button variant="danger" size="sm" className="mx-1 py-1 fw-light px-2 fw-normal text-nowrap rounded-1"> Save & eBill </Button> */}
                    {/* <Button variant="secondary" size="sm" className="mx-1 py-1 fw-light px-2 fw-normal text-nowrap rounded-1"> KOT </Button> */}
                    <Button variant="secondary" size="sm" className="mx-1 py-1 px-2 fw-bold text-nowrap rounded-1">
                         {" "}
                         KOT & Print{" "}
                    </Button>
                    <Button
                         variant="white"
                         size="sm"
                         className="mx-1 py-1 px-2 fw-bold border-1 border border-dark text-nowrap rounded-1"
                    >
                         {" "}
                         HOLD{" "}
                    </Button>
               </div>
          </div>
     );
}

export default OrderPayment;
