import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainNav from "./Home Components/MainNav.js";
import Home from "./pages/Home";
import styles from "./Main.module.css";
import ServerConfig from "./pages/ServerConfig.js";

function Main() {
     return (
          <div className={styles.main}>
               {/* <MainNav /> */}
               <Routes>
                    <Route path="/" element={<ServerConfig />} />
                    <Route path="/POS" element={<MainNav />}>
                         <Route path="Home" element={<Home />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" />} />
               </Routes>
          </div>
     );
}

export default Main;
