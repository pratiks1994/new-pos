import Reac from "react";
import styles from "./KOTView.module.css";
import { setKOT, modifyKOT } from "../Redux/KOTSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useQuery } from "react-query";
// import { v4 as uuidv4 } from "uuid";
import KOTCards from "./KOTCards";
// import { useState } from "react";
// import getSocket from "../Utils/Socket";
import { motion } from "framer-motion";
import useSocket from "../Utils/useSocket";

function KOTView() {
      const { IPAddress, refetchInterval } = useSelector((state) => state.serverConfig);
      const KOTs = useSelector((state) => state.KOTs);
      const dispatch = useDispatch();

      const getKOT = async () => {
            let { data } = await axios.get(`http://${IPAddress}:3001/liveKot`);
            return data;
      };

      let { status, isLoading, isError } = useQuery({
            queryKey: ["KOTs"],
            queryFn: getKOT,
            refetchInterval: 500000,
            refetchIntervalInBackground: 500000,
            onSuccess: (data) => {
                  dispatch(setKOT({ data }));
            },
      });

      useSocket("KOTs", (data) => {
            dispatch(setKOT({ data }));
      });

      // useEffect(() => {
      //       const socket = getSocket();
      //       // socket.emit("getInitialKOTs");
      //       socket.on("KOTs", (data) => {
      //             dispatch(setKOT({ data }));
      //       });

      //       return () => socket.off("KOTs");
      // }, []);

      if (KOTs) {
            return (
                  <motion.main layout className={styles.mainKOT} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}>
                        {KOTs.map((KOT, idx) => {
                              return <KOTCards KOT={KOT} key={KOT.id} idx={idx} />;
                        })}
                  </motion.main>
            );
      } else {
            return <div>LOADING....</div>;
      }
}

export default KOTView;
