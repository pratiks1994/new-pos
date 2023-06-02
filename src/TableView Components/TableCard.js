import React from "react";
import styles from "./TableCard.module.css";
import MinTimer from "./MinTimer";
import saveAndPrint from "../icons/save-print.png";
import saveAndSettle from "../icons/save-settle.png";
import { setActive } from "../Redux/UIActiveSlice";
import { liveOrderToCart } from "../Redux/finalOrderSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function TableCard({ order }) {
      const DineInStatus = ["accepted", "printed", "settled"];
      const { IPAddress } = useSelector((state) => state.serverConfig);
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const updateLiveOrders = async ({ orderStatus, orderId }) => {
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

      const getTableTheme = (status) => {
            if (status === "printed") {
                  return { style: { backgroundColor: `rgba(0, 72, 167, 0.301)` }, icon: saveAndSettle };
            } else {
                  return { style: {}, icon: saveAndPrint };
            }
      };

      const moveOrderToHome = (order) => {
            dispatch(liveOrderToCart({ order }));
            dispatch(setActive({ key: "isCartActionDisable", name: true }));
            navigate("/Home");
      };

      return (
            <motion.div layout className={styles.container}  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration:0.15 }}>
                  <div className={styles.tableCard} style={getTableTheme(order.order_status).style} onClick={() => moveOrderToHome(order)}>
                        <div>
                              <MinTimer startTime={order.created_at} />
                        </div>
                        <div>{order.dine_in_table_no}</div>
                        <div className={styles.total}>₹ {order.total.toFixed(2)}</div>
                  </div>
                  <img
                        className={styles.actionIcon}
                        src={getTableTheme(order.order_status).icon}
                        onClick={() => orderMutation({ orderStatus: order.order_status, orderId: order.id })}
                  />
            </motion.div>
      );
}

export default TableCard;
