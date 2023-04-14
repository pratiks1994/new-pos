import React from "react";
import styles from "./CategoryItem.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMenuItems } from "../Redux/menuItemsSlice";

function CategoryItem({ display_name, id, setActive, active }) {
     const dispatch = useDispatch();
     const bigMenu = useSelector(state=>state.bigMenu)

     const handleClick = (id) => {
          setActive(id);
          // const { data } = await axios.get(`http://localhost:3001/categories/${id}`);
          let {items} = bigMenu.find(category=>category.id===id)

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
