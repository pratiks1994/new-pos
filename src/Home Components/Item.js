import React, { useState, useCallback, useEffect } from "react";
import styles from "./Item.module.css";
import CenteredModal from "../Feature Components/CenteredModal";
import ItemModalBody from "../Feature Components/ItemModalBody";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentItem, clearCurrentItem } from "../Redux/currentItemSlice";
import { addOrderItem } from "../Redux/finalOrderSlice";
import { v4 as uuidv4, v4 } from "uuid";
import { motion } from "framer-motion";

function Item({ name, id, variations, has_variation, price, display_name, item_tax }) {
      const dispatch = useDispatch();

      const [modelShow, setModalShow] = useState(false);
      const [err, setErr] = useState("");
      const currentItem = useSelector((state) => state.currentItem);

      const getIdentifier = (item) => {
            let { itemId, variation_id, toppings } = item;
            let identifier = [itemId, variation_id];

            toppings
                  .slice()
                  .sort((a, b) => {
                        return a.id - b.id;
                  })
                  .forEach((topping) => {
                        identifier.push(topping.id);
                        identifier.push(topping.qty);
                  });

            return identifier.join("_");
      };

      const addItem = (id, name) => {
            let orderItemId = v4();
            if (has_variation === 1) {
                  setModalShow(true);
                  let defaultVariantName = variations[0].name;
                  let defaultVariantId = variations[0].variation_id;
                  let defaultVariantPrice = variations[0].price;
                  dispatch(addCurrentItem({ id, name, orderItemId, defaultVariantName, defaultVariantId, defaultVariantPrice }));
            } else {
                  let currentItem = {
                        currentOrderItemId: orderItemId,
                        itemQty: 1,
                        itemId: id,
                        itemName: display_name,
                        variation_id: "",
                        variantName: "",
                        basePrice: price,
                        toppings: [],
                        itemTotal: price,
                        multiItemTotal: price,
                        itemIdentifier: id,
                        itemNotes: "",
                  };

                  const itemTax = item_tax.map((tax) => {
                        return { id: tax.id, name: tax.name, tax: (currentItem.multiItemTotal * tax.tax) / 100 };
                  });

                  dispatch(addOrderItem({ ...currentItem, itemTax }));
            }
      };

      const handleCancel = () => {
            dispatch(clearCurrentItem());
            setModalShow(false);
      };

      const handleSave = () => {
            let itemIdentifier = getIdentifier(currentItem);
            const itemTax = item_tax.map((tax) => {
                  return { id: tax.id, name: tax.name, tax: (currentItem.multiItemTotal * tax.tax) / 100 };
            });

            dispatch(addOrderItem({ ...currentItem, itemIdentifier, itemTax }));
            dispatch(clearCurrentItem());
            setModalShow(false);
      };

      return (
            <>
                  <motion.div
                        className={`bg-white ${styles.item}`}
                        onClick={() => addItem(id, name)}
                        initial={{ opacity: 0.5, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15 }}>
                        {display_name}
                  </motion.div>
                  <CenteredModal
                        show={modelShow}
                        onHide={handleCancel}
                        handleCancel={handleCancel}
                        handleSave={handleSave}
                        name={name}
                        err={err}
                        setErr={setErr}
                        body={<ItemModalBody id={id} />}
                        total={currentItem.itemTotal}
                  />
            </>
      );
}

export default Item;
