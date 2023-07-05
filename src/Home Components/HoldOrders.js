import axios from "axios";
import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useQuery } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import HoldOrderCard from "./HoldOrderCard";
import styles from "./HoldOrders.module.css";
import { v4 } from "uuid";
// import getSocket from "../Utils/Socket";
import { setActive } from "../Redux/UIActiveSlice";
import useSocket from "../Utils/useSocket";

function HoldOrders({ showHoldOrders, setShowHoldOrders }) {
      const { IPAddress, refetchInterval } = useSelector((state) => state.serverConfig);
      const dispatch = useDispatch();
      const [holdOrders, setHoldOrders] = useState([]);

      const handleClose = () => setShowHoldOrders(false);

      const getHoldOrders = async () => {
            let { data } = await axios.get(`http://${IPAddress}:3001/holdOrder`);
            return data;
      };

      // useEffect(() => {
      //       const socket = getSocket();

      //       socket.on("holdOrders", (holdOrders) => {
      //             setHoldOrders(() => [...holdOrders]);
      //             dispatch(setActive({ key: "holdOrderCount", name: holdOrders.length }));
      //       });

      //       return () => socket.off("holdOrders");
      // }, []);

      useSocket("holdOrders", (holdOrders) => {
            setHoldOrders(() => [...holdOrders]);
            dispatch(setActive({ key: "holdOrderCount", name: holdOrders.length }));
      });

      const { status, isLoading, isError } = useQuery("holdOrders", getHoldOrders, {
            refetchInterval: 500000,
            refetchIntervalInBackground: 500000,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                  setHoldOrders(() => [...data]);
                  dispatch(setActive({ key: "holdOrderCount", name: data.length }));
            },
      });

      return (
            <Offcanvas show={showHoldOrders} onHide={handleClose} placement="end">
                  <Offcanvas.Header closeButton className={styles.holdOrderHeader}>
                        Hold Orders
                  </Offcanvas.Header>
                  <Offcanvas.Body className={styles.holdOrdersBody}>
                        {isLoading && <div>please wait...getting data</div>}
                        {isError && <div>sorry...something Went wrong..</div>}
                        {holdOrders?.length ? (
                              <div className={styles.holdOrders}>
                                    {holdOrders.map((order) => (
                                          <HoldOrderCard order={order} setShowHoldOrders={setShowHoldOrders} key={v4()} />
                                    ))}
                              </div>
                        ) : (
                              <div>no hold orders.</div>
                        )}
                  </Offcanvas.Body>
            </Offcanvas>
      );
}

export default HoldOrders;
