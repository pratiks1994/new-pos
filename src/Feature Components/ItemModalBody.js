import React from "react";
import Variant from "./Variant";
import styles from "./ItemModalBody.module.css";
import Topping from "./Topping";
import { useSelector } from "react-redux";

function ItemModalBody({ id }) {
   const menuItems = useSelector((state) => state.menuItems);
   const selectedVariantId = useSelector((state) => state.currentItem.variation_id);

   let item = menuItems.find((item) => item.id === id);

   let variants = item.variations;

   let addonGroups = variants.find((variant) => variant.variation_id === selectedVariantId).addonGroups;


   // const variants = [
   //    { id:1,type: "Slice", price: "155" },
   //    { id:2,type: "Regular", price:"165" },
   //    { id:3,type: "Medium", price: "355" },
   //    { id:4,type: "Large", price: "495" },
   //    { id:5,type: "Gaint", price: "895" },
   //    { id:6,type: "Monster", price: "1350" },
   // ];

   // const vegToppings = [
   //    { id: 1, type: "Onion", price: "30" },
   //    { id: 2, type: "Capsicum", price: "30" },
   //    { id: 3, type: "Paneer", price: "30" },
   //    { id: 4, type: "Olives", price: "30" },
   //    { id: 5, type: "Jalapenos", price: "30" },
   //    { id: 6, type: "Red Paprika", price: "30" },
   //    { id: 7, type: "Pineapple", price: "30" },
   //    { id: 8, type: "Sweet Corn", price: "30" },
   //    { id: 9, type: "Mushroom", price: "30" },
   //    { id: 11, type: "Fresh Tomatoes", price: "30" },
   //    { id: 12, type: "Baby Corns", price: "30" },
   // ];

   // const cheeseDeeps = [
   //    { id: 13, type: "Extra Cheese", price: "40" },
   //    { id: 14, type: "Cheese Dip", price: "40" },
   //    { id: 15, type: "Jalapenos Dip", price: "40" },
   //    { id: 16, type: "Hot & Garlic Dip", price: "40" },
   //    { id: 17, type: "Peri Peri Dip", price: "40" },
   //    { id: 18, type: "Korma Dip", price: "40" },
   //    { id: 19, type: "Pesto & Basil Dip", price: "40" },
   //    { id: 20, type: "Mexican Salsa Dip", price: "40" },
   // ];

   // const extras = [{ id: 20, type: "9 cheesy", price: "45" }];

   return (
      <div className={styles.modalBody}>
         <div className={styles.variation}>
            <div className="ms-2"> Variation</div>
            <div className="d-flex flex-wrap">
               {variants.map((variant) => (
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
            )
         )}

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
