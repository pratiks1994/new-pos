import React, { useEffect, useState } from "react";
import styles from "./EditPrinter.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BackButton from "../Feature Components/BackButton";
import { motion } from "framer-motion";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";

import SelectPrinter from "../Edit Printer Components/SelectPrinter";
import AssignPrinterToBill from "../Edit Printer Components/AssignPrinterToBill";
import AssignPrinterToKot from "../Edit Printer Components/AssignPrinterToKot";
import ToggleSwitch from "../Live View Components/ToggleSwitch";
import notify from "../Feature Components/notify";
import SelectCategoriesToPrint from "../Edit Printer Components/SelectCategoriesToPrint";
import axiosInstance from "../Feature Components/axiosGlobal";
import { setBigMenu } from "../Redux/bigMenuSlice";
import SelectItemsToPrint from "../Edit Printer Components/SelectItemsToPrint";

function EditPrinter() {
	const { IPAddress } = useSelector((state) => state.serverConfig);
	const { categories } = useSelector((state) => state.bigMenu);
	const { printerId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const queryClient = useQueryClient();

	const [printer, setPrinter] = useState({
		id: parseInt(printerId),
		printer_display_name: "",
		selectedPrinter: "",
		assignToKotStatus: false,
		assignToBillStatus: false,
		printerType: "",
	});

	const [printerBillOrderType, setPrinterBillOrderType] = useState([
		{ order_type: "Delivery", isChecked: false, copyCount: "", id: 1 },
		{ order_type: "Dine In", isChecked: false, copyCount: "", id: 2 },
		{ order_type: "Pick Up", isChecked: false, copyCount: "", id: 3 },
	]);

	const [printerKotOrderType, setPrinterKotOrderType] = useState([
		{ order_type: "Delivery", isChecked: false, copyCount: "", id: 1 },
		{ order_type: "Dine In", isChecked: false, copyCount: "", id: 2 },
		{ order_type: "Pick Up", isChecked: false, copyCount: "", id: 3 },
	]);

	const [selectedCategory, setSelectedCategory] = useState({ allSelected: true, selectedCategoryIds: [] });
	const [selectedItems, setSelectedItems] = useState({ allSelected: true, selectedItemIds: [] });

	const getCategories = async () => {
		let { data } = await axiosInstance.get(`/menuData`);
		return data;
	};

	const { data, status } = useQuery("bigMenu", getCategories, {
		staleTime: 1200000,
		onSuccess: (data) => dispatch(setBigMenu({ data })),
	});

	const getPrinters = async () => {
		const { data } = await axios.get(`http://${IPAddress}:3001/getPrinters`);
		return data;
	};

	const getConnectedPrinters = async () => {
		const data = await window.apiKey.request("getConnectedPrinters");
		return data;
	};

	const updatePrinter = async (printer) => {
		// console.log("ran");
		const { data } = await axios.put(`http://${IPAddress}:3001/updatePrinter`, printer);
		return data;
	};

	const {
		data: printers,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: "printers",
		queryFn: getPrinters,
		onSuccess: (data) => {
			const printerDetail = data?.find((printer) => parseInt(printerId) === printer.id);

		 let start = performance.now()

			setPrinter((state) => ({
				...state,
				printer_display_name: printerDetail.printer_display_name,
				selectedPrinter: printerDetail.printer_name,
				assignToKotStatus: printerDetail.kot_print_status,
				assignToBillStatus: printerDetail.bill_print_status,
				printerType: printerDetail.printer_type,
			}));

			setPrinterBillOrderType((prev) => {
				return prev.map((orderType) => {
					const id = orderType.id;
					const isChecked = printerDetail.bill_print_ordertypes.includes(id.toString()) || false;
					const copyCount = printerDetail.bill_print_copy_count.split(",")[id - 1] || 1;
					return { ...orderType, isChecked, copyCount };
				});
			});

			setPrinterKotOrderType((prev) => {
				return prev.map((orderType) => {
					const id = orderType.id;
					const isChecked = printerDetail.kot_print_ordertypes.includes(id.toString());
					const copyCount = printerDetail.kot_print_copy_count.split(",")[id - 1];
					return { ...orderType, isChecked, copyCount };
				});
			});

			setSelectedCategory((prev) => {
				if (printerDetail.kot_print_categories.toString() === "-1") {
					return { allSelected: true, selectedCategoryIds: [] };
				} else {
					return { allSelected: false, selectedCategoryIds: printerDetail.kot_print_categories.split(",").map(id=>+id)  };
				}
			});

			console.log(printerDetail.kot_print_categories)
			setSelectedItems((prev) => {
				if (printerDetail.kot_print_items.toString() === "-1") {
					return { allSelected: true, selectedItemIds: [] };
				} else {
					return { allSelected: false, selectedItemIds: printerDetail.kot_print_items.split(",").map(id => +id) };
				}
			});

			console.log(performance.now() - start)
		},

		refetchOnWindowFocus: false,
	});

	const { data: connectedPrinters } = useQuery({
		queryFn: getConnectedPrinters,
		queryKey: "connectedPrinters",
		refetchOnWindowFocus: false,
	});

	const printerMutation = useMutation({
		mutationFn: updatePrinter,
		onSuccess: () => {
			queryClient.invalidateQueries("printers");
			notify("success", "Printer Assigned success");
			setTimeout(() => navigate(".."), 500);
		},
		onError: () => {
			notify("error", "something went wrong");
		},
	});

	const handleSave = async (printer, printerKotOrderType, printerBillOrderType) => {
		const billPrintOrderTypes = printerBillOrderType.reduce((acc, orderType) => (orderType.isChecked ? [...acc, orderType.id] : acc), []).join(",");
		const billPrintCopyCount = printerBillOrderType.map((ordertype) => ordertype.copyCount || 0).join(",");

		const kotPrintOrderTypes = printerKotOrderType.reduce((acc, orderType) => (orderType.isChecked ? [...acc, orderType.id] : acc), []).join(",");
		const kotPrintCopyCount = printerKotOrderType.map((ordertype) => ordertype.copyCount || 0).join(",");

		const printCategories = selectedCategory.allSelected || !selectedCategory.selectedCategoryIds.length ? "-1" : selectedCategory.selectedCategoryIds.join(",");
		const printItems = selectedItems.allSelected || !selectedItems.selectedItemIds.length ? "-1" : selectedItems.selectedItemIds.join(",");

		console.log(printCategories, printItems);

		printerMutation.mutate({ ...printer, kotPrintCopyCount, kotPrintOrderTypes, billPrintCopyCount, billPrintOrderTypes, printCategories, printItems });
	};

	return (
		<motion.div
			className={styles.editPrinterBody}
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.1 }}>
			<header className={styles.editPrinterHeading}>
				<div>Edit Printer - {printer.printer_display_name} </div>
				<BackButton onClick={() => navigate("..")} />
			</header>
			{isLoading && <div className={styles.editPrinterOptions}> Loading...</div>}
			{!isLoading && (
				<div className={styles.editPrinterOptions}>
					<SelectPrinter
						printer={printer}
						setPrinter={setPrinter}
						connectedPrinters={connectedPrinters}
					/>

					<AssignPrinterToBill
						printer={printer}
						setPrinter={setPrinter}
						printerBillOrderType={printerBillOrderType}
						setPrinterBillOrderType={setPrinterBillOrderType}
					/>

					<AssignPrinterToKot
						printer={printer}
						setPrinter={setPrinter}
						printerKotOrderType={printerKotOrderType}
						setPrinterKotOrderType={setPrinterKotOrderType}
					/>
					<SelectCategoriesToPrint
						selectedCategory={selectedCategory}
						setSelectedCategory={setSelectedCategory}
						categories={categories}
					/>
					<SelectItemsToPrint
						selectedItems={selectedItems}
						setSelectedItems={setSelectedItems}
						categories={categories}
					/>
				</div>
			)}
			<div className={styles.editPrinterControl}>
				<button
					className={styles.saveBtn}
					onClick={() => handleSave(printer, printerKotOrderType, printerBillOrderType)}>
					Save
				</button>
				<button
					className={styles.cancelBtn}
					onClick={() => navigate("..")}>
					Cancel
				</button>
			</div>
		</motion.div>
	);
}

export default EditPrinter;
