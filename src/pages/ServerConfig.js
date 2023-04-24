import React, { useEffect, useState } from "react";
import styles from "./ServerConfig.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setSystem } from "../Redux/serverConfigSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ServerConfig() {
     const [err, setErr] = useState("");
     const { systemType, IPAddress } = useSelector((state) => state.serverConfig);

     const dispatch = useDispatch();
     const navigate = useNavigate();

     const handleChange = (e) => {
          let { name, value } = e.target;
          dispatch(setSystem({ name, value }));
     };

     const handleClick = async (system) => {
          setErr("");
          if (system === "server") {
               let res = await window.apiKey.request("setup", system);
          
          try {
               const { status } = await axios.get(`http://${IPAddress}:3001/ping`);
                    if (status === 200) {
                    localStorage.setItem("IP", IPAddress);
                    localStorage.setItem("systemType", systemType);
                    navigate("../POS/Home");
               }
          } catch (err) {
               setErr("server is not responding");
          }

     }
     };

    

     return (
          <div className={styles.serverConfig}>
               <div className={styles.main}>
                    <div>
                         <input
                              className={styles.radio}
                              id="server"
                              type="radio"
                              name="systemType"
                              value="server"
                              checked={systemType === "server"}
                              onChange={handleChange}
                         />{" "}
                         <label htmlFor="server">setup as server </label>
                    </div>

                    <div>
                         <input
                              className={styles.radio}
                              id="client"
                              type="radio"
                              name="systemType"
                              value="client"
                              checked={systemType === "client"}
                              onChange={handleChange}
                         />{" "}
                         <label htmlFor="client"> setup as client </label>
                    </div>
                    <div>
                         <label>Server IP Address :</label>
                         <input
                              type="text"
                              className={styles.ipAddress}
                              name="IPAddress"
                              value={IPAddress}
                              placeholder="192.168.1.208"
                              onChange={handleChange}
                         />
                    </div>
                    {err && <div className={styles.err}> {err} </div>}
                    <button className={styles.btn} onClick={() => handleClick(systemType)}>
                         Next
                    </button>
               </div>
          </div>
     );
}

export default ServerConfig;
