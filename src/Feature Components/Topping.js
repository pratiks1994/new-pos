import React, {memo} from "react";
import styles from "./Topping.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addTopping, removeTopping } from "../Redux/currentItemSlice";

function Topping({ type, price, id }) {
      const dispatch = useDispatch();

      const handleClick = (id, type, price) => {
            dispatch(addTopping({ id, type, price }));
      };

      const topping = useSelector((state) => state.currentItem.toppings.find((topping) => id === topping.id));


      // let topping = currentToppings.find((topping) => id === topping.id);

      const remove = (id) => {
            dispatch(removeTopping({ id, price }));
      };
      return (
            <div className="p-0 position-relative">
                  <div className={styles.topping} onClick={() => handleClick(id, type, price)}>
                        <div>{type}</div>
                        <div>₹ {price}</div>
                        {topping && <div className={styles.qty}>{topping.qty}</div>}
                  </div>
                  {topping && (
                        <div className={styles.remove} onClick={() => remove(id)}>
                              -
                        </div>
                  )}
            </div>
      );
}

export default  memo(Topping);
