import React, { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import styles from "./MainMenu.module.css";
import Categories from "./Categories";
import Items from "./Items";
import { useSelector, useDispatch } from "react-redux";
import { setMenuItems } from "../Redux/menuItemsSlice";

function MainMenu() {
     const bigMenu = useSelector((state) => state.bigMenu);
     const dispatch = useDispatch();
     let activeCategoryId;
     const searchItemRef = useRef("");

     //  get selected category Id which is active from child component Categories

     const getActiveId = (id) => {
          activeCategoryId = id;
     };

     //  set Menuitems according to search term

     const handleChange = () => {
          let searchTerm = searchItemRef.current.value;
          let searchItem = [];

          // set Menuitems only if search term length is morethan 3 char

          if (searchTerm.length >= 3) {
               bigMenu.forEach((category) => {
                    category.items.forEach((item) => {
                         if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                              searchItem.push(item);
                         }
                    });
               });
          }

          // if seach term length is 0 or search box is empty reset menuItems to selected active id that was aquired from activeCategoryId

          if (searchTerm.length === 0 && activeCategoryId) {
               let { items } = bigMenu.find((category) => category.id === activeCategoryId);
               dispatch(setMenuItems({ items }));
               return;
          }

          dispatch(setMenuItems({ items: searchItem }));
     };

     return (
          <div className={styles.mainMenu}>

            {/* item search bar */}

               <div className={styles.itemSearchContainer}>
                    <input
                         type="text"
                         className={`${styles.itemSearch} border-0 ps-3 py-1`}
                         ref={searchItemRef}
                         placeholder="Search item"
                         onChange={handleChange}
                    />
               </div>


               <div className={styles.displayMenu}>

                {/* category list component */}
                    <Categories getActiveId={getActiveId} />
                    
                 {/* items component that shows items according to selected category or search term   */}
                    <Items />
               </div>
          </div>
     );
}

export default MainMenu;
