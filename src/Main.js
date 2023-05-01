import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainNav from "./Home Components/MainNav.js";
import Home from "./pages/Home";
import styles from "./Main.module.css";
import ServerConfig from "./pages/ServerConfig.js";
import LiveView from "./pages/LiveView.js";
import OrderView from "./Live View Components/OrderView.js";
import KOTView from "./Live View Components/KOTView.js";

function Main() {
     return (
          <div className={styles.main}>
               {/* <MainNav /> */}
               <Routes>
                    <Route path="/" element={<ServerConfig />} />
                    <Route path="Home" element={<MainNav />}>
                         <Route index element={<Home />} />
                         <Route path="LiveView" element={<LiveView />}>
                              <Route path="OrderView" element={<OrderView />} />
                              <Route path="KOTView" element={<KOTView />} />
                         </Route>
                    </Route>
                    {/* <Route path="*" element={<Navigate to="/" />} /> */}
               </Routes>
          </div>
     );
}

export default Main;
