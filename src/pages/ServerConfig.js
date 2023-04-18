import React from "react";
import styles from "./ServerConfig.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setSystem } from "../Redux/serverConfigSlice";
import { useNavigate } from "react-router-dom";


function ServerConfig() {
     const system = useSelector((state) => state.serverConfig);

     const dispatch = useDispatch();
     const navigate = useNavigate()

     const handleChange = (e) => {
          let system = e.target.value;
          dispatch(setSystem({ system }));
     };

     
     const handleClick = async (system) => {
          

          if(system === "server"){
               let res = await window.apiKey.request("setup", system );
               
          }
          setTimeout(() => {
               navigate("../POS/Home")
               
          }, 1500);

      
     
     }

     return (
          <div className={styles.serverConfig}>
               <div className={styles.main}>
                    <div>
                         <input
                              className={styles.radio}
                              id="server"
                              type="radio"
                              name="system"
                              value="server"
                              checked={system === "server"}
                              onChange={handleChange}
                         />{" "}
                         <label htmlFor="server">setup as server </label>
                    </div>

                    <div>
                         <input
                              className={styles.radio}
                              id="client"
                              type="radio"
                              name="system"
                              value="client"
                              checked={system === "client"}
                              onChange={handleChange}
                         />{" "}
                         <label htmlFor="client"> setup as client </label>
                    </div>
                    <button className={styles.btn} onClick={()=>handleClick(system)}>Next</button>
               </div>
          </div>
     );
}

export default ServerConfig;
