import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import notify from "../Feature Components/notify";
import { resetFinalOrder } from "../Redux/finalOrderSlice";
import { modifyUIActive } from "../Redux/UIActiveSlice";
import { executeBillPrint, executeKotPrint } from "./executePrint";
import { convertOrder } from "./convertOrder";
import { printModifiedKots } from "./printModifiedKots";

//============================================for save order and modify existing order ===================================================================//

export const useOrderMutation = setShowKOTExistModal => {
	const dispatch = useDispatch();
	const { IPAddress } = useSelector(state => state.serverConfig);
	const queryClient = useQueryClient();

	const orderRequest = async finalOrder => {
		const isModify = finalOrder.cartAction === "modifyOrder";
		const url = isModify ? `http://${IPAddress}:3001/modifyOrder` : `http://${IPAddress}:3001/order`;
		const { data } = await axios.post(url, { finalOrder });
		return { data, isModify }; // Include isModify in the result
	};

	return useMutation({
		mutationKey: ["order"],
		mutationFn: orderRequest,
		onSuccess: ({ data, isModify }) => {
			// Destructure isModify from the result
			if (!isModify && data.isOldKOTsExist) {
				setShowKOTExistModal(true);
				return;
			}
			const successMessage = isModify ? "order modified" : "order Placed";
			dispatch(resetFinalOrder());
			dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
			notify("success", successMessage);

			if (isModify) {
				queryClient.invalidateQueries({ queryKey: ["liveOrders"] });
			} else {
				queryClient.invalidateQueries({ queryKey: ["KOTs", "liveOrders"] });
			}
		},
		onError: error => {
			console.error(error);
			notify("err", "something went wrong");
		},
		enabled: !!IPAddress,
	});
};

// ====================================================== save and print order ===============================================================================

export const usePrintOrderMutation = (setShowKOTExistModal, setShouldPrintOrder, printers) => {
	const dispatch = useDispatch();
	const { IPAddress } = useSelector(state => state.serverConfig);
	const queryClient = useQueryClient();

	const printOrderRequest = async finalOrder => {
		const url = finalOrder.cartAction === "modifyOrder" ? `http://${IPAddress}:3001/modifyOrder` : `http://${IPAddress}:3001/order`;
		const { data } = await axios.post(url, { finalOrder });
		return { data, finalOrder };
	};

	return useMutation({
		mutationKey: ["printOrder"],
		mutationFn: printOrderRequest,
		onSuccess: async ({ data, finalOrder }) => {
			if (data.isOldKOTsExist && finalOrder.cartAction !== "modifyOrder") {
				setShouldPrintOrder(true);
				setShowKOTExistModal(true);
				return;
			}

			if (!data.isOldOrderExist && finalOrder.cartAction !== "modifyOrder") {
				await executeKotPrint({ ...finalOrder, kotTokenNo: data.kotTokenNo, orderNo: data.orderNo, isModified: false }, printers);
			}

			const orderToPrint = convertOrder(data.order);
			await executeBillPrint(orderToPrint, printers);

			if (finalOrder.cartAction === "modifyOrder") {
				queryClient.invalidateQueries({ queryKey: ["liveOrders"] });
				notify("success", "order modified");
			} else {
				queryClient.invalidateQueries({ queryKey: ["KOTs", "liveOrders"] });
				notify("success", "order Success");
			}
			dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
			dispatch(resetFinalOrder());
		},
		onError: error => {
			console.error(error);
			notify("err", "something went wrong");
		},
		enabled: !!IPAddress,
	});
};

//======================================= cancel already existing order =============================================================================================//

export const useCancelOrderMutation = () => {
	const dispatch = useDispatch();
	const { IPAddress } = useSelector(state => state.serverConfig);
	const queryClient = useQueryClient();

	const cancelOrderRequest = async finalOrder => {
		const { data } = await axios.post(`http://${IPAddress}:3001/modifyOrder`, { finalOrder });
		return data;
	};

	return useMutation({
		mutationKey: ["cancelOrder"],
		mutationFn: cancelOrderRequest,
		onSuccess: data => {
			// Destructure isModify from the result
			notify("success", "order Cancelled");
			dispatch(resetFinalOrder());
			dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
			queryClient.invalidateQueries({ queryKey: ["liveOrders"] });
		},
		onError: error => {
			console.error(error);
			notify("err", "something went wrong");
		},
		enabled: !!IPAddress,
	});
};

//============================ click save on already existing kot from cart (converting kot to order ) ================================//

export const useKotToOrderMutation = () => {
	const dispatch = useDispatch();
	const { IPAddress } = useSelector(state => state.serverConfig);
	const queryClient = useQueryClient();

	const kotToOrderRequest = async finalOrder => {
		const { data } = await axios.post(`http://${IPAddress}:3001/kotToOrder`, { finalOrder });
		return data;
	};

	return useMutation({
		mutationKey: ["kotToOrder"],
		mutationFn: kotToOrderRequest,
		onSuccess: data => {
			// Destructure isModify from the result
			notify("success", "Order placed success ");
			dispatch(resetFinalOrder());
			dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
			queryClient.invalidateQueries({ queryKey: ["liveOrders"] });
		},
		onError: error => {
			console.error(error);
			notify("err", "something went wrong");
		},
		enabled: !!IPAddress,
	});
};

export const useKotToPrintOrderMutation = printers => {
	const dispatch = useDispatch();
	const { IPAddress } = useSelector(state => state.serverConfig);
	const queryClient = useQueryClient();

	const kotToPrintOrderRequest = async finalOrder => {
		const { data } = await axios.post(`http://${IPAddress}:3001/kotToOrder`, { finalOrder });
		return { data, finalOrder };
	};

	return useMutation({
		mutationKey: ["kotToPrintOrder"],
		mutationFn: kotToPrintOrderRequest,
		onSuccess: async ({ data, finalOrder }) => {
			await printModifiedKots(finalOrder, data.kotTokenNo, data.newKotTokenNo, printers);
			const orderToPrint = convertOrder(data.order);
			await executeBillPrint(orderToPrint, printers);
			notify("success", "Order placed success ");
			dispatch(resetFinalOrder());
			dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
			queryClient.invalidateQueries({ queryKey: ["liveOrders"] });
		},
		onError: error => {
			console.error(error);
			notify("err", "something went wrong");
		},
		enabled: !!IPAddress,
	});
};

//===================================================================================================================================================//

export const useKotMutation = (printers, setShowOrderExistModal) => {
	const dispatch = useDispatch();
	const { IPAddress } = useSelector(state => state.serverConfig);
	const queryClient = useQueryClient();

	const createKot = async finalOrder => {
		const { data } = await axios.post(`http://${IPAddress}:3001/KOT`, finalOrder);
		return { data, finalOrder };
	};

	return useMutation({
		mutationKey: ["createKOT"],
		mutationFn: createKot,
		onSuccess: async ({ data, finalOrder }) => {
			if (!data.orderExist) {
				finalOrder = { ...finalOrder, kotTokenNo: data.kotTokenNo, isModified: false };

				try {
					await executeKotPrint(finalOrder, printers);
				} catch (error) {
					console.log(error);
				}

				queryClient.invalidateQueries(["KOTs"]);
				dispatch(resetFinalOrder());
				dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
				notify("success", "KOT Success");
			} else if (data.orderExist) {
				setShowOrderExistModal(true);
			}
		},
		onError: error => {
			console.error(error);
			notify("err", "something went wrong");
		},
		enabled: !!IPAddress,
	});
};

//===================================================================================================================================================//

export const useModifyKotMutation = printers => {
	const dispatch = useDispatch();
	const { IPAddress } = useSelector(state => state.serverConfig);
	const queryClient = useQueryClient();

	const modifyKot = async finalOrder => {
		const { data } = await axios.post(`http://${IPAddress}:3001/modifyKot`, { finalOrder });
		return { data, finalOrder };
	};

	return useMutation({
		mutationKey: ["modifyKOT"],
		mutationFn: modifyKot,
		onSuccess: async ({ data, finalOrder }) => {
			await printModifiedKots(finalOrder, data.kotTokenNo, data.newKotTokenNo, printers);
			queryClient.invalidateQueries(["KOTs"]);
			dispatch(resetFinalOrder());
			dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
			notify("success", "KOT Success");
		},
		onError: error => {
			console.error(error);
			notify("err", "something went wrong");
		},
		enabled: !!IPAddress,
	});
};

//=================================================================================================================================================//

export const useUpdateOrderPrintCountMutation = () => {
	const { IPAddress } = useSelector(state => state.serverConfig);

	const updateOrderPrintCount = async (orderId, printCount) => {
		const { data } = await axios.put(`http://${IPAddress}:3001/orderPrintCount`, { orderId, printCount });
		return data;
	};

	return useMutation({
		mutationKey: ["updateOrderPrintCount"],
		mutationFn: updateOrderPrintCount,
		onSuccess: async () => {},
		onError: error => {
			console.error(error);
			notify("err", "something went wrong");
		},
		enabled: !!IPAddress,
	});
};

//====================================================================================================================================================//

export const usePendingOrderToOrderMutation = printers => {
	const dispatch = useDispatch();
	const { IPAddress } = useSelector(state => state.serverConfig);
	const queryClient = useQueryClient();

	const pendingOrderToOrderRequest = async pendingOrderDetail => {
		const { data } = await axios.post(`http://${IPAddress}:3001/pendingOrderToOrder`, { pendingOrderDetail });
		return data;
	};

	return useMutation({
		mutationKey: ["pendingOrderToOrder"],	
		mutationFn: pendingOrderToOrderRequest,
		onSuccess: data => {
			// Destructure isModify from the result

			const finalOrder = data.finalOrder;
			if (finalOrder.order_status === "rejected") {
				return;
			}
			executeBillPrint(finalOrder, printers);
			executeKotPrint({ ...finalOrder, isModified: false }, printers);
			queryClient.invalidateQueries(["KOTs", "liveOrders"]);
		},
		onError: error => {
			console.error(error);
			notify("err", "something went wrong");
		},
		enabled: !!IPAddress,
	});
};
