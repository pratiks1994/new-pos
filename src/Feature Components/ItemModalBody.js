import React from "react";
import Variant from "./Variant";
import styles from "./ItemModalBody.module.css";
import Topping from "./Topping";
import { useSelector } from "react-redux";

function ItemModalBody({ id , restaurantPriceVariations}) {
      const menuItems = useSelector((state) => state.menuItems);
      const selectedVariantId = useSelector((state) => state.currentItem.variation_id);
      // const {restaurantPriceId}= useSelector(state=> state.UIActive)

      let item = menuItems.find((item) => item.id === id);

      let variants = item.variations;

      let addonGroups = variants.find((variant) => variant.variation_id === selectedVariantId).addonGroups;

      return (
            <div className={styles.modalBody}>
                  <div className={styles.variation}>
                        <div className="ms-2"> Variation</div>
                        <div className="d-flex flex-wrap">
                              {restaurantPriceVariations.map((variant) => (
                                    <Variant key={variant.variation_id} {...variant} />
                              
                             ))}
                        </div>
                  </div>
                  {addonGroups.map((group) => (
                        <div key={group.addongroup_id} className={styles.addOnGroup}>
                              <div className="ms-2">{group.name}</div>
                              <div className="d-flex flex-wrap">
                                    {" "}
                                    {group.addonItems.map((item) => (
                                          <Topping key={item.id} type={item.name} price={item.price} id={item.id} />
                                    ))}{" "}
                              </div>
                        </div>
                  ))}

                  {/* <div className={styles.addOnGroup}>
            <div className="ms-2">Veg Toppings</div>
            <div className="d-flex flex-wrap">
               {" "}
               {vegToppings.map((topping, idx) => (
                  <Topping key={idx} type={topping.type} price={topping.price} id={topping.id} />
               ))}{" "}
            </div>
         </div>
         <div className={styles.addOnGroup}>
            <div className="ms-2">Cheese & Dips</div>
            <div className="d-flex flex-wrap">
               {" "}
               {cheeseDeeps.map((dip, idx) => (
                  <Topping key={idx} type={dip.type} price={dip.price} id={dip.id} />
               ))}{" "}
            </div>
         </div>
         <div className={styles.addOnGroup}>
            <div className="ms-2">Extra</div>
            <div className="d-flex flex-wrap">
               {" "}
               {extras.map((extra, idx) => (
                  <Topping key={idx} type={extra.type} price={extra.price} id={extra.id} />
               ))}{" "}
            </div>
         </div> */}
            </div>
      );
}

export default ItemModalBody;
