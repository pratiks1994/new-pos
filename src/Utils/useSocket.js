import { io } from "socket.io-client";
import { useEffect } from "react";
import { useSelector } from "react-redux";

let socket = null;

const useSocket = (event, callBack) => {
	const ipAddress = useSelector((state) => state.serverConfig.IPAddress);

	useEffect(() => {
		console.log("socket ip", ipAddress);

		if (!socket && ipAddress) {
			socket = io(`http://${ipAddress}:3001`);
		}

		socket?.on(event, callBack);

		console.log(socket);
		return () => {
			socket?.off(event, callBack);
		};
	}, []);
};

export default useSocket;
