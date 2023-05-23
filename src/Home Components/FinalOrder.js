import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./FinalOrder.module.css";
import { incrementQty, decrementQty, removeItem } from "../Redux/finalOrderSlice";
import { motion } from "framer-motion";

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
            <motion.div layout className={styles.finalOrderItem} initial={{ opacity: 0, scale: 0.5 }}  exit={{ opacity: 0 , scale:0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}>
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
            </motion.div>
      );
}

export default FinalOrder;
