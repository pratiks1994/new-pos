import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./FinalOrder.module.css";
import { incrementQty, decrementQty, removeItem } from "../Redux/finalOrderSlice";

function FinalOrder({ currentOrderItemId, itemQty, itemName, itemTotal, variantName, multiItemTotal }) {
      const dispatch = useDispatch();

      const addQty = (id) => {
            dispatch(incrementQty({ id }));
      };

      const removeQty = (id) => {
            dispatch(decrementQty({ id }));
      };

      const remove = (itemId) => {
            dispatch(removeItem({ itemId }));
      };

      return (
            <div className={styles.finalOrderItem}>
                  <div className={styles.name}>
                        <span
                              className={styles.remove}
                              onClick={() => {
                                    remove(currentOrderItemId);
                              }}>
                              {" "}
                              x{" "}
                        </span>
                        {` ${itemName} `}
                  </div>
                  <div className={styles.qty}>
                        <button onClick={() => removeQty(currentOrderItemId)} className={styles.btn}>
                              -
                        </button>
                        {itemQty}
                        <button className={styles.btn} onClick={() => addQty(currentOrderItemId)}>
                              +
                        </button>
                  </div>
                  <div className={styles.total}>{multiItemTotal.toFixed(2)}</div>
            </div>
      );
}

export default FinalOrder;
