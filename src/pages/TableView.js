import React, { useState, useEffect } from "react";
import styles from "./TableView.module.css";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { v4 } from "uuid";
import TableCard from "../TableView Components/TableCard";
import { modifyCartData } from "../Redux/finalOrderSlice";
import { useNavigate } from "react-router-dom";
import socket from "../Utils/Socket";

function TableView() {
      const [orders, setOrders] = useState([]);
      const { IPAddress, refetchInterval } = useSelector((state) => state.serverConfig);
      // const queryClient = useQueryClient();
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const getLiveOrders = async () => {
            let { data } = await axios.get(`http://${IPAddress}:3001/liveorders`);
            return data;
      };

      // const getKOT = async () => {
      //       let { data } = await axios.get(`http://${IPAddress}:3001/liveKot`);
      //       return data;
      // };

      const { status, isLoading, error, isError } = useQuery("liveOrders", getLiveOrders, {
            refetchInterval: refetchInterval,
            refetchIntervalInBackground: refetchInterval,
            onSuccess: (data) => {
                  setOrders(() => [...data]);
            },
      });

      // const {
      //       data: KOTs,
      //       status:KOTStatus,
      //       isLoading:KOTIsLoading,
      //       error:KOTError,
      //       isError:KOTisError,
      // } = useQuery("KOTs", getKOT, {
      //       refetchInterval: 400000,
      //       refetchIntervalInBackground: 1000000,
      // });

      useEffect(() => {
            socket.on("orders", (orders) => {
                  console.log("orders");
                  setOrders(() => [...orders]);
            });

            return () => socket.off("orders");
      }, [socket]);

      const handleClick = (orderType) => {
            dispatch(modifyCartData({ orderType }));
            navigate(`..${orderType === "Dine In" ? "?openTable=true" : ""}`);
      };

      return (
            <div className={styles.tableView}>
                  <header>
                        <div className={styles.heading}> Table View</div>
                        <div className={styles.control}>
                              <button onClick={() => handleClick("Delivery")}> Delivery </button>
                              <button onClick={() => handleClick("Pick Up")}> Pick Up</button>
                              <button onClick={() => handleClick("Dine In")}>+ Add Table</button>
                        </div>
                  </header>
                  <main className={styles.tableList}>
                        {isLoading && <div>Loading....</div>}
                        {isError && <div>{error}</div>}
                        {orders
                              ?.filter((order) => order.order_type === "Dine In")
                              .map((order) => (
                                    <TableCard key={order.id} order={order} />
                              ))}
                  </main>
            </div>
      );
}

export default TableView;
