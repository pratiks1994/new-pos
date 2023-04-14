import React from "react";
import { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import styles from "./OrderPayment.module.css";
import PaymentBreakdown from "./PaymentBreakdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

function OrderPayment() {
     const finalOrder = useSelector((state) => state.finalOrder.orderCart);

     const cartTotal = () => {
          let total = 0;
          finalOrder.forEach((item) => {
               total += item.multiItemTotal;
          });
          return total;
     };

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

               <button
                    className={styles.paymentBreakdownToggle}
                    onClick={() => setShowPaymentBreakdown(!showPaymentBreakdown)}
               >
                    {chevronPosition}
               </button>

               <div className={`${styles.total} d-flex justify-content-end`}>
                    <div className="m-2 my-3 text-light fs-6">Total</div>
                    <div className="mx-3 my-3 text-warning fw-bold"> {cartTotal().toFixed(2)} </div>
               </div>

               <div className={`${styles.paymentModes} d-flex justify-content-around`}>
                    <label>
                         <input className="mx-2 my-2" type="radio" name="mode" value="Cash" />
                         Cash
                    </label>

                    <label>
                         <input className="mx-2 my-2" type="radio" name="mode" value="Card" />
                         Card
                    </label>
                    <label>
                         <input className="mx-2 my-2" type="radio" name="mode" value="Due" />
                         Due
                    </label>
                    <label>
                         <input className="mx-2 my-2" type="radio" name="mode" value="Other" />
                         Other
                    </label>
               </div>

               <div className={`${styles.paymentModesCheck} d-flex justify-content-center p-2  text-white`}>
                    <input type="checkbox" />
                    <label className="ms-3">its paid</label>
               </div>

               <div className={`${styles.ProcessOrderBtns} d-flex justify-content-center bg-light pt-3 pb-3 flex-wrap`}>
                    <Button variant="danger" size="sm" className="mx-1 py-1 px-4 fw-bold text-nowrap rounded-1">
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
