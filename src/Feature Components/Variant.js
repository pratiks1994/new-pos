import React, { useEffect } from "react";
import styles from "./Variant.module.css";
import { useDispatch, useSelector } from "react-redux";
import { selectVariant, clearToppings } from "../Redux/currentItemSlice";

function Variant({ variation_id, item_variation_id, price, name, addonGroups }) {
      const dispatch = useDispatch();
      const selectedVariantId = useSelector((state) => state.currentItem.variation_id);

      const setVariant = (variation_id, name, price) => {
            dispatch(selectVariant({ variation_id, name, price }));
      };

      // useEffect(()=>{

      //  dispatch(clearToppings())

      // },[selectedVariantId])

      return (
            <div className={`${styles.variant} ${selectedVariantId === variation_id ? styles.selected : ""}`} onClick={() => setVariant(variation_id, name, price)}>
                  <div>{name}</div>
                  <div> ₹ {price}</div>
            </div>
      );
}

export default Variant;
