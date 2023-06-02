import React from "react";
import styles from "./OrderCard.module.css";
import { v4 } from "uuid";
import Timer from "./Timer";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import deliveryImg from "../icons/liveview-delivery.png";
import pickUpImg from "../icons/liveview-pickup.png";
import dineInIng from "../icons/liveview-dinein.png";
import { liveOrderToCart } from "../Redux/finalOrderSlice";
import { useNavigate } from "react-router-dom";
import { setActive } from "../Redux/UIActiveSlice";
import { motion } from "framer-motion";

function OrderCard({ order, idx }) {
      const { IPAddress } = useSelector((state) => state.serverConfig);
      const queryClient = useQueryClient();
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const updateLiveOrders = async ({ orderStatus, orderId }) => {
            const DineInStatus = ["accepted", "printed", "settled"];
            let updatedStatus;

            const current = DineInStatus.findIndex((element) => element === orderStatus);
            updatedStatus = DineInStatus[current + 1];

            let { data } = await axios.put(`http://${IPAddress}:3001/liveorders`, { updatedStatus, orderId });
            return data;
      };

      const { mutate: orderMutation, isLoading } = useMutation({
            mutationFn: updateLiveOrders,
            // onSettled: () => {
            //       queryClient.invalidateQueries("liveOrders");
            // },
      });

      const getBtnTheme = (status) => {
            if (status === "accepted") {
                  return { name: "Save & Print", style: null };
            }

            if (status === "printed") {
                  return { name: "Save & Settle", style: { backgroundColor: "rgb(51, 51, 51)", color: "white" } };
            }
      };

      const getHeaderTheme = (type) => {
            if (type === "Delivery") {
                  return { style: { backgroundColor: "rgba(161, 118, 108, 0.41)" }, image: deliveryImg };
            }

            if (type === "Pick Up") {
                  return { style: { backgroundColor: "rgba(201, 182, 34, 0.41)" }, image: pickUpImg };
            } else {
                  return { style: { backgroundColor: "rgba(81, 161, 77, 0.41)" }, image: dineInIng };
            }
      };

      const moveOrderToHome = (order) => {
            dispatch(liveOrderToCart({ order }));
            dispatch(setActive({ key: "isCartActionDisable", name: true }));
            navigate("/Home");
      };

      return (
            <motion.div
                  layout
                  className={styles.orderCard}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.1, delay: idx * 0.05 }}>
                  <header className={styles.cardHeader} style={getHeaderTheme(order.order_type).style} onClick={() => moveOrderToHome(order)}>
                        <div>
                              <div> Martinoz...</div>
                              <Timer startTime={order.created_at} />
                              <img src={getHeaderTheme(order.order_type).image} alt="BigCo Inc. logo" />

                              <div>{`TABLE : ${order.dine_in_table_no || 12}`}</div>
                        </div>
                        <div>
                              <div>KOT : 1 | BILL : {order.order_number}</div>
                              <div>{order.order_type}</div>
                        </div>
                  </header>
                  <div className={styles.riderStatus}>Not Assign</div>

                  <div className={styles.customerDetail}>
                        {order.customer_name ? order.customer_name : "----"} | {order.phone_number ? order.phone_number : "----"} <br />{" "}
                        {order.complete_address ? order.complete_address : "------"}
                  </div>

                  <div className={styles.orderItems}>
                        {order.items.map((item) => {
                              return (
                                    <div className={styles.orderItem} key={v4()}>
                                          <div className={styles.orederItemQty}>{item.quantity} x</div>
                                          <div className={styles.orederItemDetail}>
                                                {item.item_name} {item.variation_name ? `- ${item.variation_name} ` : null}{" "}
                                                {item.itemAddons.length
                                                      ? item.itemAddons.map((addon) => {
                                                              return (
                                                                    <div key={v4()} className={styles.addon}>
                                                                          {addon.name} x {addon.quantity},
                                                                    </div>
                                                              );
                                                        })
                                                      : null}{" "}
                                          </div>
                                    </div>
                              );
                        })}
                  </div>
                  <div className={styles.statusBtn}>
                        <div className={styles.orderTotal}>₹ {order.total.toFixed(2)}</div>
                        <button
                              style={getBtnTheme(order.order_status).style}
                              onClick={() => orderMutation({ orderStatus: order.order_status, orderId: order.id })}
                              disabled={isLoading}>
                              {" "}
                              {isLoading ? "Loading..." : getBtnTheme(order.order_status).name}
                        </button>
                  </div>
            </motion.div>
      );
}

export default OrderCard;
