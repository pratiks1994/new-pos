import React from "react";
import styles from "./OrderArea.module.css";
import FinalOrder from "./FinalOrder";
import { useSelector, useDispatch } from "react-redux";

function OrderArea() {
      const orderItems = useSelector((state) => state.finalOrder.orderCart);

      return (
            <div className={`${styles.orderArea} flex-shrink-1`}>
                  <div className={`d-flex ${styles.orderInfo}`}>
                        <div className={styles.name}>ITEMS</div>
                        <div className={styles.qty}>QTY.</div>
                        <div className={styles.total}>PRICE</div>
                  </div>

                  <div className={styles.finalOrder}>
                        {orderItems.map((item) => (
                              <FinalOrder key={item.currentOrderItemId} {...item} />
                        ))}
                  </div>
            </div>
      );
}

export default OrderArea;
