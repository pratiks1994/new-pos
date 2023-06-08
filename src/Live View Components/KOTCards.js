import React from "react";
import styles from "./KOTCards.module.css";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function KOTCards({ KOT, idx }) {
      const { IPAddress } = useSelector((state) => state.serverConfig);

      const queryClient = useQueryClient();

      const updateKOT = async ({ id, order_id, order_type }) => {
            let { data } = await axios.put(`http://${IPAddress}:3001/liveKot`, { id, order_id, order_type });
            return data;
      };

      const {
            mutate: KOTmutation,
            isLoading,
            isError,
      } = useMutation({
            mutationFn: updateKOT,
            // onMutate: async (id) => {
            //       await queryClient.cancelQueries({ queryKey: ["KOTs"] });
            //       const previousKOTs = queryClient.getQueryData(["KOTs"]);
            //       queryClient.setQueryData(["KOTs"], (oldKOTs) => {
            //             return oldKOTs.filter((KOT) => KOT.id !== id);
            //       });
            //       return { previousKOTs };
            // },
            // onError: (err, id, context) => {
            //       queryClient.setQueryData(["KOTs"], context.previousKOTs);
            // },

            // onSettled: (data) => {
            //       queryClient.invalidateQueries("KOTs");
            // },
      });

      const getColor = (type) => (type !== "Dine In" ? { backgroundColor: "rgba(116, 116, 0, 0.87)" } : null);

      return (
            <motion.div layout className={styles.KOTCard} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.1, delay: idx * 0.03 }}>
                  <div className={styles.CardHeader} style={getColor(KOT.order_type)}>
                        <div>
                              {KOT.table_no && <div>{KOT.table_no}</div>}
                              <div>{KOT.order_type} </div>
                        </div>
                        <div className={styles.token}>
                              <div>{KOT.token_no}</div>
                              <div>Token No.</div>
                        </div>
                        <div>10:10</div>
                  </div>
                  {KOT.customer_name && (
                        <div className={styles.KOTCustomerDetail}>
                              <div>{KOT.customer_name}</div>
                              <div>{KOT.number}</div>
                        </div>
                  )}
                  <div className={styles.KOTItemHeader}>
                        <div>Item</div>
                        <div>QTY.</div>
                  </div>
                  <div className={styles.KOTBiller}>
                        <div>Biller (biller)</div>
                  </div>
                  {KOT.items.map((item) => {
                        return (
                              <div className={styles.KOTItemsDetail} key={uuidv4()}>
                                    <div className={styles.KOTItemName}>
                                          {item.item_name} {item.variation_name ? `- ${item.variation_name}` : null}{" "}
                                          {item.itemAddons.length
                                                ? item.itemAddons.map((addon) => (
                                                        <span key={uuidv4()}>
                                                              / {addon.type} ({addon.qty})
                                                        </span>
                                                  ))
                                                : null}
                                    </div>
                                    <div className={styles.KOTItemQty}>{item.quantity}</div>
                              </div>
                        );
                  })}
                  <div className={styles.footer}>
                        <button onClick={() => KOTmutation({ id: KOT.id, order_id: KOT.order_id, order_type: KOT.order_type })} disabled={isLoading}>
                              {isLoading ? "loading..." : "Food Is Ready"}
                        </button>
                  </div>
            </motion.div>
      );
}

export default KOTCards;
