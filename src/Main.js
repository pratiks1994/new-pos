import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import MainNav from "./Home Components/MainNav.js";
import Home from "./pages/Home";
import styles from "./Main.module.css";
import ServerConfig from "./pages/ServerConfig.js";
import LiveView from "./pages/LiveView.js";
import OrderView from "./Live View Components/OrderView.js";
import KOTView from "./Live View Components/KOTView.js";
import TableView from "./pages/TableView.js";
import Configuration from "./pages/Configuration.js";
import PrinterConfig from "./pages/PrinterConfig.js";
import PrintersList from "./pages/PrintersList.js";
import EditPrinter from "./pages/EditPrinter.js";
import PrinterAssign from "./pages/PrinterAssign.js";
import AssignBill from "./pages/AssignBill.js";
import AssignKot from "./pages/AssignKot.js";
import BillingScreenConfig from "./pages/BillingScreenConfig.js";
import EditBillingScreen from "./pages/EditBillingScreen.js";
import { setSystem } from "./Redux/serverConfigSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import axios from "axios";
import { modifyCartData } from "./Redux/finalOrderSlice.js";
import Loading from "./Feature Components/Loading.js";
import POSConfig from "./pages/POSConfig.js";


function Main() { 

      const dispatch = useDispatch()
      const navigate = useNavigate()
      const { systemType, IPAddress } = useSelector((state) => state.serverConfig);
      

      const getServerData = async () => {
		let data = await window.apiKey.request("getServerData", {})
		return data;
	};

      
      const getServerStatus = async () => {
		const { data } = await axios.get(`http://${IPAddress}:3001/defaultScreenData`, { timeout: 4000 });
		return data;
	};

	
	const { data: serverData,isLoading:serverDataLoading } = useQuery({
		queryKey: ["serverData"],
		queryFn: getServerData,
		onSuccess: async (data) => {

                  if(!data.sync_code){
                        navigate("./POSConfig")
                        return
                  }
                  
                  if(data.system_type === "server" && data.ip){
                        await window.apiKey.request("setup",{IPAddress:data.ip})
                  }
                  
                  if(data.ip)
                  {
			            dispatch(setSystem({ name: "IPAddress", value: data.ip }));
			            dispatch(setSystem({ name: "systemType", value: data.system_type }));
                  }

                  else{
                        navigate("./serverConfig")
                  }
		},
		onError: () => {
			dispatch(setSystem({ name: "IPAddress", value: "192.168.1.108" }));
			dispatch(setSystem({ name: "systemType", value: "client" }));
		},
            staleTime:5000000,
            refetchOnWindowFocus:false,
            refetchIntervalInBackground:false,
            retry:false,
            
	});

      const { data,isLoading } = useQuery({
		queryKey: ["defaultScreen"],
		queryFn: getServerStatus,
		onSuccess: async (data) => {

                  // socket = io(`http://${IPAddress}:3001`);
                  dispatch(modifyCartData({ orderType: data.default_order_type || "delivery"}));
			dispatch(modifyCartData({ paymentMethod: data.default_payment_type || "cash" }));
			data.default_view === "table_view" ? navigate("./Home/tableView") : navigate("./Home");
		},
		onError: () => {
                  navigate("./")
		},
            refetchOnWindowFocus:false,
            refetchIntervalInBackground:false,
            staleTime:5000000,
            retry:false,
            enabled : !!IPAddress
	});


      return (
            isLoading || serverDataLoading ? <div className={styles.loadingContainer}><Loading/></div> :
            <div className={styles.main}>
                  {/* <MainNav /> */}
                  <Routes>
                        <Route path="serverConfig" element={<ServerConfig />} />
                        <Route path="POSConfig" element={<POSConfig/>} />
                        <Route path="Home" element={<MainNav />}>
                              <Route index element={<Home />} />
                              <Route path="LiveView" element={<LiveView />}>
                                    <Route path="OrderView" element={<OrderView />} />
                                    <Route path="KOTView" element={<KOTView />} />
                              </Route>
                              <Route path="tableView" element={<TableView />} />
                              <Route path="configuration">
                                    <Route index element={<Configuration />} />
                                    <Route path="billingScreenConfig">
                                        <Route index element={<BillingScreenConfig/>}/>
                                        <Route path="editBillingScreen" element={<EditBillingScreen/>}/>
                                         
                                     </Route>     
                                    <Route path="printerConfig">
                                          <Route index element={<PrinterConfig />} />
                                          <Route path="PrintersList">
                                                <Route index element={<PrintersList />} />
                                                <Route path=":printerId" element={<EditPrinter />} />
                                                <Route path="printerAssign/:printerId">
                                                      <Route index  element={<PrinterAssign/>}/>
                                                      <Route path="assignKot" element={<AssignKot/>}/>
                                                      <Route path="assignBill" element={<AssignBill/>}/>
                                                </Route>      
                                          </Route>
                                    </Route>
                              </Route>
                        </Route>
                        {/* <Route path="*" element={<Navigate to="/" />} /> */}
                  </Routes>
            </div>
      );
}

export default Main;
