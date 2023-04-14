import React from "react";
import styles from "./CustomerDetail.module.css";
import { useDispatch, useSelector } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";

function CustomerDetail({ showDetailType }) {
     const dispatch = useDispatch();
     const { customerName, customerAdd, customerContact, customerLocality } = useSelector((state) => state.finalOrder);

     let showCustomerDetail =
          showDetailType === "customerDetail" ? `${styles.show} ${styles.customerDetail}` : `${styles.customerDetail}`;

     const handleChange = (e) =>{
      let {name,value} = e.target ;
      dispatch(modifyCartData({[name]:value}))
     }     

     return (
          <div className={showCustomerDetail}>
               <div className="mb-2">
                    <span className="">Contact :</span>
                    <input
                         type="text"
                         name="customerContact"
                         value={customerContact}
                         className={`${styles.customerContact}`}
                         onChange={(e) => handleChange(e)}
                    />
               </div>
               <div className="mb-2">
                    <span className="">Name :</span>
                    <input
                         type="text"
                         name="customerName"
                         value={customerName}
                         className={`${styles.customerName}`}
                         onChange={(e) => handleChange(e)}
                    />
               </div>
               <div className="mb-2">
                    <span className="">Add :</span>
                    <input
                         type="text"
                         name="customerAdd"
                         value={customerAdd}
                         className={`${styles.customerAddress}`}
                         onChange={(e) => handleChange(e)}
                    />
               </div>
               <div className="mb-2">
                    <span className="">Locality :</span>
                    <input
                         type="text"
                         name="customerLocality"
                         value={customerLocality}
                         className={`${styles.customerContact}`}
                         onChange={(e) => handleChange(e)}
                    />
               </div>
          </div>
     );
}

export default CustomerDetail;
