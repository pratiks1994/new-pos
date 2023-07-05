import { io } from "socket.io-client";

const getSocket =  () => {
      const IPAddress = localStorage.getItem("IP");
      const socket = io(`http://${IPAddress}:3001`); // Replace with your server URL
      return socket;
};

export default getSocket;
