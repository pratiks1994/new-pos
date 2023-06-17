import axios from "axios";
import store from "../Redux/store";
// import serverConfigSlice from "../Redux/serverConfigSlice";

const state = store.getState() 

const ipAddress = state.serverConfig.IPAddress 

const axiosInstance = axios.create({
      baseURL: `http://${ipAddress}:3001`,
});

export default axiosInstance;
