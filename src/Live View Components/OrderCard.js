import React, { useState } from "react";
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
import SettleOrderModal from "./SettleOrderModal";
import getDisplayName from "../Utils/getDisplayName";
import { executeBillPrint } from "../Utils/executePrint";
import { convertOrder } from "../Utils/convertOrder";

function OrderCard({ order, idx }) {
      const { IPAddress } = useSelector((state) => state.serverConfig);
      const printers = useSelector((state) => state.printerSettings);
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const [showSettleModal, setShowSettleModal] = useState(false);

      const updateLiveOrders = async ({ orderStatus, orderId, orderType, KOTId, print_count, tip, paymentType, customerPaid, settleAmount,multipay }) => {
            let { data } = await axios.put(`http://${IPAddress}:3001/liveorders`, {
                  orderStatus,
                  orderId,
                  orderType,
                  KOTId,
                  print_count,
                  tip,
                  paymentType,
                  customerPaid,
                  settleAmount,
                  multipay
            });
            return data;
      };

      const { mutate: orderMutation, isLoading } = useMutation({
            mutationFn: updateLiveOrders
      });

      const getBtnTheme = (orderStatus, orderType, print_count) => {

            const themes = [
                  {
                        orderType: "delivery",
                        statuses: [
                              { status: "accepted", btnName: "Food is ready", style: { backgroundColor: "rgb(179, 107, 0)", color: "white" } },
                              { status: "food_is_ready", btnName: "Dispatch", style: { backgroundColor: "rgb(0, 102, 61)", color: "white" } },
                              { status: "dispatched", btnName: "Delivered", style: { backgroundColor: "rgb(102, 0, 41)", color: "white" } },
                        ],
                  },
                  {
                        orderType: "dine_in",
                        statuses: [
                              { print_count: 0, btnName: "Save & Print", style: { backgroundColor: "rgb(51, 51, 51)", color: "white" } },
                              { print_count: 1, btnName: "Save & Settle", style: { backgroundColor: "rgb(51, 51, 51)", color: "white" } },
                        ],
                  },
                  {
                        orderType: "pick_up",
                        statuses: [
                              { status: "accepted", btnName: "Food is ready", style: { backgroundColor: "rgb(179, 107, 0)", color: "white" } },
                              { status: "food_is_ready", btnName: "Picked Up", style: { backgroundColor: "rgb(0, 102, 61)", color: "white" } },
                        ],
                  },
            ];

            
            const theme = themes.find((theme) => theme.orderType === orderType);

            if (theme.orderType === "dine_in") {
                  return theme?.statuses.find((status) => status.print_count === print_count);
            } else {
                  return theme?.statuses.find((status) => status.status === orderStatus);
            }
      };

      const getHeaderTheme = (type) => {
            if (type === "delivery") {
                  return { style: { backgroundColor: "rgba(161, 118, 108, 0.41)" }, image: deliveryImg };
            }

            if (type === "pick_up") {
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

      const handleClick = async () => {



            if (order.print_count === 1 && order.order_type === "dine_in") {
                  setShowSettleModal(true);
            } else {

                  if (order.print_count === 0 && order.order_type === "dine_in") {
                        const orderToPrint = convertOrder(order)
                        await executeBillPrint(orderToPrint,printers)
                  }

                  await orderMutation({
                        orderStatus: order.order_status,
                        orderId: order.id,
                        orderType: order.order_type,
                        KOTId: order.KOTDetail[0]?.id || 0,
                        print_count: order.print_count,
                        paymentType: null,
                        customerPaid: null,
                        tip: null,
                        settleAmount: null,
                        multipay:null
                  });
            }
      };

      // console.log(showSettleModal);

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
                              <div>
                                    KOT : {order.KOTDetail.map(kot=>kot.token_no).join(",")} | BILL : {order.order_number}
                              </div>
                              <div>{getDisplayName(order.order_type)}</div>
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
                        <button style={getBtnTheme(order.order_status, order.order_type, order.print_count).style} onClick={handleClick} disabled={isLoading }>
                              {" "}
                              {isLoading ? "Loading..." : getBtnTheme(order.order_status, order.order_type, order.print_count).btnName}
                        </button>
                  </div>
                  {showSettleModal && (
                        <SettleOrderModal show={showSettleModal} hide={() => setShowSettleModal(false)} order={order} orderMutation={orderMutation} />
                  )}
            </motion.div>
      );
}

export default OrderCard;
