import React from "react";
import { Route, Routes } from "react-router-dom";
import MainNav from "./Home Components/MainNav.js";
import Home from "./pages/Home";
import styles from "./Main.module.css"

function Main() {
   return (
      <div className={styles.main}>
         <MainNav />
         <Routes>
            <Route path="/" element={<Home />} />
         </Routes>
      </div>
   );
}

export default Main;
