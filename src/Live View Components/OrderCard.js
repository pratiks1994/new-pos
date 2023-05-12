import React from "react";
import styles from "./OrderCard.module.css";
import { v4 } from "uuid";
import Timer from "./Timer";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

function OrderCard({ order }) {
      const { IPAddress } = useSelector((state) => state.serverConfig);
      const queryClient = useQueryClient();
      const DineInStatus = ["accepted", "printed", "settled"];

      const updateLiveOrders = async ({ orderStatus, orderId }) => {
            let updatedStatus;

            const current = DineInStatus.findIndex((element) => element === orderStatus);
            updatedStatus = DineInStatus[current + 1];

            let { data } = await axios.put(`http://${IPAddress}:3001/liveorders`, { updatedStatus, orderId });
            return data;
      };

      const { mutate: orderMutation, isLoading } = useMutation({
            mutationFn: updateLiveOrders,
            onSettled: () => {
                  queryClient.invalidateQueries("liveOrders");
            },
      });

      const getBtnTheme = (status) => {
            if (status === "accepted") {
                  return { name: "Save & Print", style: null };
            }

            if (status === "printed") {
                  return { name: "Save & Settle", style: { backgroundColor: "rgb(51, 51, 51)", color: "white" } };
            }
      };

      return (
            <div className={styles.orderCard}>
                  <header className={styles.cardHeader}>
                        <div>
                              <div> Martinoz...</div>
                              <Timer startTime={order.created_at} />
                              <div>{`TABLE : ${order.dine_in_table_no || 12}`}</div>
                        </div>
                        <div>
                              <div>KOT : 1 | BILL : {order.order_number}</div>
                              <div>{order.order_type}</div>
                        </div>
                  </header>
                  <div className={styles.riderStatus}>Not Assign</div>
                  {order.customer_name && (
                        <div className={styles.customerDetail}>
                              {order.customer_name} | {order.phone_number} <br /> {order.complete_address}
                        </div>
                  )}
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
                        <div className={styles.orderTotal}>₹ {order.total}</div>
                        <button style={getBtnTheme(order.order_status).style} onClick={() => orderMutation({ orderStatus: order.order_status, orderId: order.id })} disabled={isLoading}>
                              {" "}
                              {isLoading ? "Loading...":getBtnTheme(order.order_status).name}
                        </button>
                  </div>
            </div>
      );
}

export default OrderCard;
