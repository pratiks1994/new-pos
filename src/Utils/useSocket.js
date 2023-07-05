import { io } from "socket.io-client";
import { useEffect } from "react";
const IPAddress = localStorage.getItem("IP");
const socket = io(`http://${IPAddress}:3001`);

const useSocket = (event, callBack) => {
    
      useEffect(() => {
            // socket.emit("getInitialKOTs");
            socket.on(event, callBack);
            return () => socket.off(event, callBack);
      }, []);
};

export default useSocket;
