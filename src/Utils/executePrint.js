export async function executeBillAndKotPrint(order, printers) {
	for (const printer of printers) {
		
		if (printer.billPrintStatus === 1) {
			for (const orderType of printer.billPrintOrderTypes) {
				if (orderType.orderType === order.orderType) {
					for (let i = 0; i < orderType.copyCount; i++) {
						console.log("billPrint", printer.printerName);

						try {
							let responce = await window.apiKey.request("printInvoice", { data: order, printerName: printer.printerName });
						} catch (err) {
							console.log(err);
						}
					}
				}
			}
		}

		if (printer.kotPrintStatus === 1) {
			const kotPrintCategoriesSet = new Set(printer.kotPrintCategories.split(","));
			const kotPrintItemsSet = new Set(printer.kotPrintItems.split(","));

			const filteredCart = order.orderCart.filter((item) => {
				const categoryId = item.categoryId.toString();
				const itemId = item.itemId.toString();

				if (printer.kotPrintCategories === "-1" && printer.kotPrintItems === "-1") {
					return true;
				}

				if (printer.kotPrintCategories === "-1") {
					return kotPrintItemsSet.has(itemId);
				}

				if (printer.kotPrintItems === "-1") {
					return kotPrintCategoriesSet.has(categoryId);
				}

				return kotPrintCategoriesSet.has(categoryId) || kotPrintItemsSet.has(itemId);
			});

			const newFilteredOrder = { ...order, orderCart: filteredCart };

			if (newFilteredOrder.orderCart.length) {
				for (const orderType of printer.kotPrintOrderTypes) {
					if (orderType.orderType === order.orderType) {
						for (let i = 0; i < orderType.copyCount; i++) {
							console.log("kot Print on", printer.printerName);

							try {
								let responce = await window.apiKey.request("printKot", { data: newFilteredOrder, printerName: printer.printerName });
							} catch (err) {
								console.log(err);
							}
						}
					}
				}
			}
		}
	}
}





export const executeBillPrint = async (order, printers) => {
	for (const printer of printers) {
		if (printer.billPrintStatus === 1) {
			for (const orderType of printer.billPrintOrderTypes) {
				if (orderType.orderType === order.orderType) {

					for (let i = 0; i < orderType.copyCount; i++) {
						console.log("billPrint", printer.printerName);

						try {
							let responce = await window.apiKey.request("printInvoice", { data: order, printerName: printer.printerName });
						} catch (err) {
							console.log(err);
						}
					}
				}
			}
		}
	}
};




export const executeKotPrint = async (order, printers) => {
	for (const printer of printers) {

		if (printer.kotPrintStatus === 1) {
			const kotPrintCategoriesSet = new Set(printer.kotPrintCategories.split(","));
			const kotPrintItemsSet = new Set(printer.kotPrintItems.split(","));

			const filteredCart = order.orderCart.filter((item) => {
				const categoryId = item.categoryId.toString();
				const itemId = item.itemId.toString();

				if (printer.kotPrintCategories === "-1" && printer.kotPrintItems === "-1") {
					return true;
				}

				if (printer.kotPrintCategories === "-1") {
					return kotPrintItemsSet.has(itemId);
				}

				if (printer.kotPrintItems === "-1") {
					return kotPrintCategoriesSet.has(categoryId);
				}

				return kotPrintCategoriesSet.has(categoryId) || kotPrintItemsSet.has(itemId);
			});

			const newFilteredOrder = { ...order, orderCart: filteredCart };

			if (newFilteredOrder.orderCart.length) {
				for (const orderType of printer.kotPrintOrderTypes) {
					if (orderType.orderType === order.orderType) {
						for (let i = 0; i < orderType.copyCount; i++) {
							// console.log("kot Print on", printer.printerName);

							try {
									let responce = await window.apiKey.request("kotPrint", { data: newFilteredOrder, printerName: printer.printerName })

								// let responce = await window.apiKey.request("printKot", { data: newFilteredOrder, printerName: printer.printerName });
								
							} catch (err) {
								console.log(err);
							}
						}
					}
				}
			}
		}
	}
};
