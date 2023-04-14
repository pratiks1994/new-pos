import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import styles from "./Categories.module.css";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux";
import { setBigMenu } from "../Redux/bigMenuSlice";

function Categories() {
   // const [categories, setCategories] = useState([]);

   const categories = useSelector(state => state.bigMenu)
   const [active,setActive] = useState()

   const dispatch = useDispatch();

   const getCategories = async () => {
      let { data } = await axios.get("http://192.168.1.208:3001/categories");
      // console.log(data)
      dispatch(setBigMenu({data}))
   };

   useEffect(() => {
      getCategories();
   }, [getCategories]);


   return (
      <div className={`${styles.categoryList}`}>
         {categories.map((cat)=> <CategoryItem key={cat.id} id={cat.id} display_name={cat.display_name} setActive={setActive} active={active}/>)}
      </div>
   );
}

export default Categories;
