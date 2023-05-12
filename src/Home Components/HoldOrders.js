import axios from "axios";
import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import HoldOrderCard from "./HoldOrderCard";
import styles from "./HoldOrders.module.css";
import { v4 } from "uuid";

function HoldOrders({ showHoldOrders, setShowHoldOrders }) {
      const { IPAddress } = useSelector((state) => state.serverConfig);
      const handleClose = () => setShowHoldOrders(false);

      const getHoldOrders = async () => {
            let { data } = await axios.get(`http://${IPAddress}:3001/holdOrder`);
            return data;
      };

      const { data: holdOrders, status, isLoading, isError } = useQuery("holdOrders", getHoldOrders);


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
