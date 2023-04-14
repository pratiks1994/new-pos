import React, { useState, useEffect } from "react";
import { faLocationDot, faUser, faUsers, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableNumber from "./TableNumber";
import CustomerDetail from "./CustomerDetail";
import PersonCount from "./PersonCount";
import OrderComment from "./OrderComment";
import styles from './OrderType.module.css'

function OrderTypeDetail({ type }) {


   const [showDetailType, setShowDetailType] = useState(null);


   const handleDetailType = (detailType) => {
      if (detailType === showDetailType) {
         setShowDetailType(null);
      } else {
         setShowDetailType(detailType);
      }
   };


   useEffect(() => {
      if (showDetailType && showDetailType !== "orderComment") {
         if (type === "Delivery" || type === "Pick Up") {
            setShowDetailType("customerDetail");
         }
      }
   }, [type, setShowDetailType]);



   return (
      <div>
         <div className={`${styles.orderTypeDetail} d-flex`}>
            {type === "Dine In" && (
               <>
                  <div
                     className={`${styles.orderIcon} ${showDetailType === "tableNumber" ? "text-danger" : ""}`}
                     onClick={() => handleDetailType("tableNumber")}
                  >
                     <FontAwesomeIcon icon={faLocationDot} />{" "}
                  </div>
                  <div
                     className={`${styles.orderIcon} ${showDetailType === "personCount" ? "text-danger" : ""}`}
                     onClick={() => handleDetailType("personCount")}
                  >
                     <FontAwesomeIcon icon={faUsers} />{" "}
                  </div>
               </>
            )}

            <div
               className={`${styles.orderIcon} ${showDetailType === "customerDetail" ? "text-danger" : ""}`}
               onClick={() => handleDetailType("customerDetail")}
            >
               <FontAwesomeIcon icon={faUser} />{" "}
            </div>
            <div
               className={`${styles.orderIcon} ${showDetailType === "orderComment" ? "text-danger" : ""}`}
               onClick={() => handleDetailType("orderComment")}
            >
               {" "}
               <FontAwesomeIcon icon={faPenToSquare} />
            </div>
            <div className={`${styles.orderIcon} ${styles.right}`}> {type}</div>
         </div>
         <TableNumber showDetailType={showDetailType} />
         <CustomerDetail showDetailType={showDetailType} />
         <PersonCount showDetailType={showDetailType} />
         <OrderComment showDetailType={showDetailType} />
      </div>
   );
}

export default OrderTypeDetail;
