import React, { useState,useEffect } from "react";
import styles from "./Timer.module.css";

function Timer({ startTime }) {
      const [timer, setTimer] = useState();

      const initialDate = new Date(startTime);
      const initalTime = initialDate.getTime();

      
        function getTimeDifference(initialTime) {
            const now = new Date();
            const difference = now - initialTime;
            const minutes = Math.floor(difference / 60000);
            const seconds = ((difference % 60000) / 1000).toFixed(0);
            const timer =  `${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`;
            setTimer(timer)
          }
            

           setInterval(() => {
            getTimeDifference(initalTime)
            
        }, 1000);

         

      return <div className={styles.timer}>{timer}</div>;
}

export default Timer;
