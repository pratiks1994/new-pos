import React from "react";
import styles from "./PaymentBreakdown.module.css";

function PaymentBreakdown({ showPaymentBreakdown, setShowPaymentBreakdown }) {
   let showBreakdown = showPaymentBreakdown ? `${styles.showBreakdown} ${styles.paymentBreakdown}` : `${styles.paymentBreakdown}`;

   return (
      <div className={showBreakdown}>
         <button className={styles.breakDownHideBtn} onClick={() => setShowPaymentBreakdown(false)}>
            {" "}
            &#8964;
         </button>
         <div className={`${styles.breakDownItem} d-flex justify-content-between`}>
            <div className="ms-4">Sub Total</div>
            <div className="me-4">0.00</div>
         </div>
         <div className={`${styles.breakDownItem} d-flex justify-content-between`}>
            <div className="ms-4">Discount</div>
            <div className="me-4">0.00</div>
         </div>
         <div className={`${styles.breakDownItem} d-flex justify-content-between py-1 align-items-center`}>
            <div className="ms-4">Delivery Charge</div>
            <input className="me-4" defaultValue="0" />
         </div>
         <div className={`${styles.breakDownItem} d-flex justify-content-between py-1 align-items-center`}>
            <div className="ms-4">Containe Charge</div>
            <input className="me-4" defaultValue="0" />
         </div>
         <div className={`${styles.breakDownItem} d-flex justify-content-between`}>
            <div className="ms-4">Tax</div>
            <div className="me-4">0.00</div>
         </div>
         <div className={`${styles.breakDownItem} d-flex justify-content-between`}>
            <div className="ms-4">Round Of</div>
            <div className="me-4">0.00</div>
         </div>
         <div className={`${styles.breakDownItem} d-flex justify-content-between py-1 align-items-center`}>
            <div className="ms-4">Customer Paid</div>
            <input className="me-4" defaultValue="0" />
         </div>
         <div className={`${styles.breakDownItem} d-flex justify-content-between`}>
            <div className="ms-4">Return to Customer</div>
            <div className="me-4">0.00</div>
         </div>
         <div className={`${styles.breakDownItem} d-flex justify-content-between py-1 align-items-center`}>
            <div className="ms-4">Tip</div>
            <input className="me-4" defaultValue="0" />
         </div>
      </div>
   );
}

export default PaymentBreakdown;
