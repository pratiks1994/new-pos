import React from "react";
import styles from "./OrderArea.module.css";
import FinalOrder from "./FinalOrder";
import { useSelector, useDispatch } from "react-redux";
import emptyCartImg from "../icons/no-order.png"

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
                        {orderItems.length ? orderItems.map((item) => (
                              <FinalOrder key={item.currentOrderItemId} {...item} />
                        )) : null
                        // <div className={styles.emptyCart}> <img className={styles.noItemsImg} src={emptyCartImg} /> </div>
                            }
                  </div>
            </div>
      );
}

export default OrderArea;
