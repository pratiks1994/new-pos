import React from "react";
import styles from "./KOTView.module.css";
import { setKOT, modifyKOT } from "../Redux/KOTSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useQuery } from "react-query";
import { v4 as uuidv4 } from "uuid";
import KOTCards from "./KOTCards";

function KOTView() {
      const { IPAddress } = useSelector((state) => state.serverConfig);

      const getKOT = async () => {
            let { data } = await axios.get(`http://${IPAddress}:3001/liveKot`);
            return data;
      };

      let {
            data: KOTS,
            status,
            isLoading,
            isError
      } = useQuery("KOTs", getKOT, {
            refetchInterval: 400000,
            refetchIntervalInBackground: 10000,
      });


      if (KOTS) {
            return (
                  <main className={styles.mainKOT}>
                        {KOTS.map((KOT) => {
                              return <KOTCards KOT={KOT} key={uuidv4()} />;
                        })}
                  </main>
            );
      } else {
            return <div>LOADING....</div>;
      }
}

export default KOTView;
