import React from "react";
import styles from "./OrderType.module.css";

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
                        <button className={`flex-grow-1 ${orderType === "dine_in" ? "bg-danger" : "none"}`} onClick={() => handleOrderType("dine_in")}>
                              Dine In
                        </button>
                        
                        <button className={`flex-grow-1 ${orderType === "delivery" ? "bg-danger" : "none"}`} onClick={() => handleOrderType("delivery")}>
                              Delivery
                        </button>
                        <button className={`flex-grow-1 ${orderType === "pick_up" ? "bg-danger" : "none"}`} onClick={() => handleOrderType("pick_up")}>
                              Pick up
                        </button>
                  </div>

                  <OrderTypeDetail type={orderType} />
            </div>
      );
}

export default OrderType;
