import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import styles from "./Categories.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setBigMenu } from "../Redux/bigMenuSlice";
import { useQuery } from "react-query";


function Categories({ getActiveId }) {
     // const [categories, setCategories] = useState([]);

     const categories = useSelector((state) => state.bigMenu);
     const {IPAddress} = useSelector(state => state.serverConfig)
     const [active, setActive] = useState();

     useEffect(() => {
          getActiveId(active);
     }, [active]);

     const dispatch = useDispatch();

     // api call everytime component Mounts to get FULL MENU items and set as bigMenu redux state

     const getCategories = async () => {
          let { data } = await axios.get(`http://${IPAddress}:3001/categories`);
          
          
          return data;
     };

   //   react query api call for data chashing, loading and error state management
     const { data, status, isLoading } = useQuery("bigMenu", getCategories,{
          staleTime: 1200000
     });

     useEffect(() => {
          if (status === "success") {
               dispatch(setBigMenu({ data }));
          }
     }, [status, data]);

     return (
          <div className={`${styles.categoryList}`}>
               {isLoading ? (
                    <div>Loading...</div>
               ) : (
                    categories.map((cat) => (
                         <CategoryItem
                              key={cat.id}
                              id={cat.id}
                              display_name={cat.display_name}
                              setActive={setActive}
                              active={active}
                         />
                    ))
               )}
          </div>
     );
}

export default Categories;
