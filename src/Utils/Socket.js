import { io } from "socket.io-client";

const IPAddress = localStorage.getItem("IP")
console.log(IPAddress)

const socket = io(`http://${IPAddress}:3001`); // Replace with your server URL

export default socket;