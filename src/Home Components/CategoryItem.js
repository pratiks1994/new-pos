import React from "react";
import styles from "./CategoryItem.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMenuItems } from "../Redux/menuItemsSlice";

function CategoryItem({ display_name, id, setActive, active }) {
     const dispatch = useDispatch();
     const {categories} = useSelector(state=>state.bigMenu)
     const isCartActionDisable = useSelector(state=>state.UIActive.isCartActionDisable)


     // get items list from bigMenu redux state according to active category id and set menuItem redux state with aquired items

     const handleClick = (id) => {
          setActive(id);
          // const { data } = await axios.get(`http://localhost:3001/categories/${id}`);
          let {items} = categories.find(category=>category.id===id)

          dispatch(setMenuItems({ items }));
     };

     

     let selected = active === id ? styles.selected : "";

     return (
          <div
               className={`${styles.catagoryItem} ${selected}`}
               onClick={() => {
                    handleClick(id);
               }}
               
          >
               {display_name}
          </div>
     );
}

export default CategoryItem;
