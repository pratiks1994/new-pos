import React from "react";
import styles from "./OrderType.module.css";

import { useState } from "react";
import OrderTypeDetail from "./OrderTypeDetail";
import { useSelector, useDispatch } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";

function OrderType() {
      let orderType = useSelector((state) => state.finalOrder.orderType);
      const dispatch = useDispatch();

      const handleOrderType = (orderType) => {
            dispatch(modifyCartData({ orderType }));
      };

      return (
            <div className="flex-shrink-0">
                  <div className={`d-flex ${styles.orderTypeBtn}`}>
                        <button className={`flex-grow-1 ${orderType === "Dine In" ? "bg-danger" : "none"}`} onClick={() => handleOrderType("Dine In")}>
                              Dine in
                        </button>
                        <button className={`flex-grow-1 ${orderType === "Delivery" ? "bg-danger" : "none"}`} onClick={() => handleOrderType("Delivery")}>
                              Delivery
                        </button>
                        <button className={`flex-grow-1 ${orderType === "Pick Up" ? "bg-danger" : "none"}`} onClick={() => handleOrderType("Pick Up")}>
                              Pick up
                        </button>
                  </div>

                  <OrderTypeDetail type={orderType} />
            </div>
      );
}

export default OrderType;
