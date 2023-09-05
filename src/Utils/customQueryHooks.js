import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query"
import { setBigMenu } from "../Redux/bigMenuSlice";



// ====================================== to get Full Menu ====================================================

export const useGetMenuQuery = () => {
	const dispatch = useDispatch();
	const { IPAddress } = useSelector(state => state.serverConfig);

	const getBigMenu = async () => {
		let res = await axios.get(`http://${IPAddress}:3001/menuData`);
		return res.data;
	};

	return useQuery({
		queryKey: ["bigMenu"],
		queryFn: getBigMenu,
		onSuccess: data => dispatch(setBigMenu({ data })),
		staleTime:120000,
		enabled: !!IPAddress,
	});
};

// ====================================== to get Full Menu without Dispatch/redux state  ====================================================

export const useGetMenuQuery2 = () => {
	const { IPAddress } = useSelector(state => state.serverConfig);

	const getBigMenu = async () => {
		let res = await axios.get(`http://${IPAddress}:3001/menuData`);
		return res.data;
	};
	return useQuery({
		queryKey: ["bigMenu"],
		queryFn: getBigMenu,
		staleTime: 1200000,
		enabled: !!IPAddress,
	});
};

// ====================================== to get printers settings ============================================

export const useGetPrintersQuery = () => {
	const { IPAddress } = useSelector(state => state.serverConfig);
	const getPrinters = async () => {
		const { data } = await axios.get(`http://${IPAddress}:3001/getPrinters`);
		return data;
	};

	return useQuery({
		queryKey: ["printers"],
		queryFn: getPrinters,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: false,
		staleTime : 1200000,
		enabled: !!IPAddress,
	});
};

// ====================================== to get live KOTs ====================================================

export const useGetLiveKotsQuery = () => {
	const { IPAddress } = useSelector(state => state.serverConfig);

    const getKOT = async () => {
        console.log("get KOT")
		let { data } = await axios.get(`http://${IPAddress}:3001/liveKot`);
		return data;
	};

	return useQuery({
        initialData:[],
		queryKey: ["KOTs"],
		queryFn: getKOT,
		refetchIntervalInBackground: 500000,
		enabled: !!IPAddress ,               	 	
	});
}


// ====================================== to get live orders ====================================================

export const useGetLiveOrdersQuery = () => {
	const { IPAddress } = useSelector(state => state.serverConfig);
    const getLiveOrders = async () => {
		let { data } = await axios.get(`http://${IPAddress}:3001/liveorders`);
		return data;
	};

	return useQuery({
        initialData:[],
		queryKey: ["liveOrders"],
		queryFn: getLiveOrders,
		refetchIntervalInBackground: 500000,
		refetchOnWindowFocus:false,
        refetchIntervalInBackground:false,
		enabled: !!IPAddress ,               	 	
	});
}

export const useGetConnectedPrintersQuery = () => {
	const getConnectedPrinters = async () => {
		const data = await window.apiKey.request("getConnectedPrinters");
		return data;
	}

	return useQuery({
		queryFn: getConnectedPrinters,
		queryKey: "connectedPrinters",
		refetchOnWindowFocus: false,
		staleTime:1200000,
	});
}





