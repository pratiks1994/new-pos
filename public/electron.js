const { fork, spawn } = require("child_process");
const { app, BrowserWindow, protocol, ipcMain, webContents } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const { PosPrinter } = require("electron-pos-printer");

// const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require("node-thermal-printer");
let mainWindow;
// Create the native browser window.
async function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 768,
		// Set the path of an additional "preload" script that can be used to
		// communicate between node-land and browser-land.
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	// In production, set the initial browser path to the local bundle generated
	// by the Create React App build process.
	// In development, set it to localhost to allow live/hot-reloading.

	const appURL = app.isPackaged
		? url.format({
				pathname: path.join(__dirname, "dist/index.html"),
				protocol: "file:",
				slashes: true,
		  })
		: "http://localhost:3006/POS/Home";
	mainWindow.loadURL(appURL);
}

function setupLocalFilesNormalizerProxy() {
	protocol.registerHttpProtocol(
		"file",
		(request, callback) => {
			const url = request.url.substr(8);
			callback({ path: path.normalize(`${__dirname}/${url}`) });
		},
		(error) => {
			if (error) console.error("Failed to register protocol");
		}
	);
}

app.whenReady().then(() => {
	createWindow();
	// setupLocalFilesNormalizerProxy();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.

const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
	contents.on("will-navigate", (event, navigationUrl) => {
		const parsedUrl = new URL(navigationUrl);

		if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
			event.preventDefault();
		}
	});
});

ipcMain.handle("setup", async (event, data) => {
	const posServer = fork("../POS/server/server");
	return { status: "started" };
	// const posServer = require("../server/server");

	// const serverProcess = spawn('node', ["../POS/server/server"]);
	// for final build use path 'resources/server/server.js'
	// path.join("resources", "server","server.js")

	// serverProcess.stdout.on('data', (data) => {
	//   console.log(`Server stdout: ${data}`);
	// });

	// serverProcess.stderr.on('data', (data) => {
	//   console.error(`Server stderr: ${data}`);
	// });

	// serverProcess.on('close', (code) => {
	//   console.log(`Server process exited with code ${code}`);
	// });
});

ipcMain.handle("getConnectedPrinters", async (event, data) => {
	const connectedPrinters = await mainWindow.webContents.getPrintersAsync();
	// console.log(connectedPrinters)
	return connectedPrinters;
});

ipcMain.handle("kotPrint", async (event, payload) => {
	const { data, printerName } = payload;
	// const win = new BrowserWindow({width:305,height:1000});

	// const options = {
	// 	silent: false,
	// 	deviceName: "POS-usb",
	// 	margins: {
	// 		marginType: "custom",
	// 		top: 0,
	// 		bottom: 0,
	// 		left: 0,
	// 		right: 0,
	// 	},

	//  pageSize:{width:78000,height:10000}
	// };

	const fullDate = new Date();
	console.log(fullDate.getMonth());
	const date = `${fullDate.getDate()}/${fullDate.getMonth() + 1}/${fullDate.getFullYear()}`;
	const time = `${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}`;

	const htmlContent = `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Print Content</title>
		<style>
			* {
				margin: 0;
				padding: 0;
			}
			body {
				font-family: Arial, sans-serif;
				font-size: 14px;
				width : 100%;
			}
			.printHeader {
				display: flex;
				justify-content: center;
				flex-direction: column;
				border-bottom: 2px dashed;
				padding: 5px 0px;
				align-items: center;
			}
			.bold{
				font-weight: 700;
			}
			.biller{
				padding: 5px;
				border-bottom: 2px dashed;
			}
			.itemTitle{
				display: flex;
      			justify-content: flex-start;
      			align-items: flex-start;
				padding: 5px;
			}
			.itemQtyTitle{
				min-width: 40px;
				text-align : center;
			}
			.itemNameTitle{
				flex-grow: 1;
			}
			.itemCard{
				display: flex;
      			justify-content: flex-start;
      			align-items: flex-start;
				padding: 5px;
			}
			.itemQty{
				min-width : 40px;
				text-align : center ;
			}
			.itemName{
				flex-grow : 1 ;
			}
			.addonCard{
				display: flex;
				font-size: 13px;
				margin: 2px 0px 2px 60px;
				font-style: italic;
			}
		
		</style>
	</head>
	<body>
		<div class="printMain">
			<header class="printHeader">
				<div class="dateAndTime">${date} ${time}</div>
				<div class="kotText bold">KOT - ${data.kotTokenNo}</div>
				<div class="orderType bold">${data.orderType}</div>
				${data.orderType === "dine_in" ? `<div class="tableNo bold">Table No: ${data.tableNumber}</div> ` : ""}
			</header>		
			<section class="biller">Biller - biller</section>
			<section class="itemTitle">
				<div class="itemQtyTitle">Qty.</div>
				<div class="itemNameTitle">Item</div>
			</section>
			<section class="itemContainer">

			${data.orderCart
				.map((item) => {
					const itemCard=`<article class="itemCard">
										<div class="itemQty">${item.itemQty}</div>
										<div class="itemName bold">${item.itemName} ${item.variantName ? " - " + item.variantName : ""}</div>
			    					</article>`;

					const addonCard = item.toppings.length
						? item.toppings
								?.map((topping) => {
									return `<article class="addonCard">
												<div class="addonName">${topping.type} - </div>
					  							<div class="addonQty">${topping.qty}</div>
					  						</article>`;
								})
								.join(" ")
						: "";
					return itemCard + addonCard;
				})
				.join(" ")}
			</section>
			
		</div>
	</body>
	</html>
  `;

	// win.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(htmlContent)}`);

	// win.once("ready-to-show", () => {
	// 	win.webContents.print(options, (success, errorType) => {
	// 		if (!success) {
	// 			console.log(`Printing failed: ${errorType}`);
	// 		} else {
	// 			console.log("Printing successful.");
	// 		}

	// 		win.close();
	// 	});
	// });

	const kotPrint = [
		{
			type: "text",
			value: htmlContent,
			style: {},
		},
	];

	const options = {
		preview: true,
		margin: "0px 0px 0px 0px",
		silent: true,
		copies: 1,
		printerName: printerName,
		timeOutPerLine: 600,
		pageSize: "76mm", // page size,
		color: false,
		printBackground: false,
		dpi: 300,
	};

	PosPrinter.print(kotPrint, options).catch((error) => {
		console.error(error);
	});
});



ipcMain.handle("printInvoice", async (event, payload) => {
	const { data, printerName } = payload;

	const fullDate = new Date();
	const date = `${fullDate.getDate()}/${fullDate.getMonth() + 1}/${fullDate.getFullYear()}`;
	const time = `${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}`;

	const printDataHeader = [
		{
			type: "text",
			value: "Martino'z Pizza (Rajkot)",
			style: { fontWeight: "700", textAlign: "center", fontSize: "15px", fontFamily: "Roboto" },
		},
		{
			type: "text",
			value: "Plot no. 1&2, Royal Avenue Gate-1,nr, nana mauva circle, 150ft ringroad, opp.silver height,nana mauva main road,<br> Rajkot -360004",
			style: { fontWeight: "700", textAlign: "center", fontSize: "15px", fontFamily: "Roboto" },
		},
		{
			type: "text",
			value: "Mob. No. 9978964000",
			style: { fontWeight: "700", textAlign: "center", fontSize: "15px", fontFamily: "Roboto" },
		},
		{
			type: "text",
			value: "GST NO :24AABCY 4639H1ZB ",
			style: { fontWeight: "700", textAlign: "center", fontSize: "15px", borderBottom: "1px solid", paddingBottom: "3px", fontFamily: "Roboto" },
		},
	];

	const printDataCustomer = [
		{
			type: "text",
			value: `Name : ${data.customerName || ""} <br> M: ${data.customerContact || ""}`,
			style: { textAlign: "left", fontSize: "13px", margin: "5px 0 0 5px", fontFamily: "Roboto" },
		},
		{
			type: "text",
			value: `Add : ${data.customerAdd || ""} ${data.customerLocality || ""}`,
			style: { textAlign: "left", fontSize: "13px", margin: "0 0 0 5px", borderBottom: "1px solid", paddingBottom: "3px", fontFamily: "Roboto" },
		},
		{
			type: "text",
			value: `<div> Date : ${date} </div> <div>  ${data.orderType} <div>`,
			style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "5px 8px 0 8px", fontFamily: "Roboto" },
		},
		{
			type: "text",
			value: `<div>  ${time} </div> <div>  Order No :${data.orderNo} <div>`,
			style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "2px 8px 0 8px", fontFamily: "Roboto" },
		},
		{
			type: "text",
			value: `<div> Cashier : biller </div> <div style="font-weight : bold ">  Token No :${data.kotTokenNo} <div>`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				display: "flex",
				justifyContent: "space-between",
				margin: "2px 8px 0 8px",
				borderBottom: "1px solid black",
				paddingBottom: "3px",
				fontFamily: "Roboto",
			},
		},
	];

	const printOrderHeader = [
		{
			type: "text",
			value: `<div style="flex : 8" > Item </div>
                  <div style="flex : 3; text-align:center" > QTY </div> 
                  <div style="flex : 3; text-align:center "> Price </div>
                  <div style="flex : 3; text-align:center"> Amount </div>`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				display: "flex",
				justifyContent: "space-between",
				margin: "5px 8px 0 8px",
				borderBottom: "1px solid black",
				paddingBottom: "3px",
				fontWeight: "bold",
				fontFamily: "Roboto",
			},
		},
	];

	let printOrderDetail = [];

	data.orderCart.forEach((item) => {
		const orderitem = {
			type: "text",
			value: `<div style="flex : 8" > ${item.itemName} ${item.variationName} </div>
                  <div style="flex : 3 ; text-align:center"> x${item.itemQty} </div> 
                  <div style="flex : 3 ; text-align:center" > ${item.itemTotal} </div>
                  <div style="flex : 3 ; text-align:center"> ${item.multiItemTotal.toFixed(2)}</div>`,
			style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "5px 8px 5px 8px", fontFamily: "Roboto" },
		};
		printOrderDetail.push(orderitem);

		if (item.toppings) {
			item.toppings.forEach((topping) => {
				const orderTopping = {
					type: "text",
					value: `<div> ${topping.type}[topping] : ${topping.qty} x ${topping.price} = ${topping.price * topping.qty}  </div>`,
					style: {
						textAlign: "left",
						fontStyle: "italic",
						fontSize: "12px",
						display: "flex",
						justifyContent: "start",
						margin: "5px 8px 5px 20px",
						fontFamily: "Roboto",
					},
				};

				printOrderDetail.push(orderTopping);
			});
		}
	});

	const printTotal = [
		{
			type: "text",
			value: `<div style="padding-left:65px" > Item Qty : ${data.orderCart.length}  </div>
                  <div style="" > Sub Total :</div> 
                  <div style="padding-right : 10px" > ${data.subTotal.toFixed(2)} </div>`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				display: "flex",
				justifyContent: "space-between",
				margin: "5px 8px 0 8px",
				borderTop: "1px solid black",
				padding: "5px 0",
				fontFamily: "Roboto",
			},
		},
		{
			type: "text",
			value: `<div style="padding-left:65px" > CGST </div>
                  <div style="" > 2.5% :</div> 
                  <div style="padding-right : 10px" > ${(data.subTotal * 0.025).toFixed(2)} </div>`,
			style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "0px 8px 0 8px", fontFamily: "Roboto" },
		},
		{
			type: "text",
			value: `<div style="padding-left:65px" > SGST </div>
                  <div style="" > 2.5% :</div> 
                  <div style="padding-right : 10px" > ${(data.subTotal * 0.025).toFixed(2)} </div>`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				display: "flex",
				justifyContent: "space-between",
				margin: "0px 8px 0 8px",
				borderBottom: "1px solid black",
				padding: "5px 0",
				fontFamily: "Roboto",
			},
		},
		{
			type: "text",
			value: `<div style="padding-left:65px" > Grand Total </div>
                  <div style="padding-right : 10px" > ₹ ${data.cartTotal.toFixed(2)} </div>`,
			style: {
				textAlign: "left",
				fontSize: "14px",
				display: "flex",
				justifyContent: "space-between",
				margin: "0px 8px 0 8px",
				fontWeight: "bold",
				padding: "5px 0",
				fontFamily: "Roboto",
			},
		},
		{
			type: "text",
			value: `<div > ${data.paymentMethod} </div>`,
			style: {
				textAlign: "left",
				fontSize: "12px",
				display: "flex",
				justifyContent: "flex-start",
				margin: "0px 8px 0 8px",
				borderBottom: "1px solid black",
				padding: "5px 10px",
				fontFamily: "Roboto",
			},
		},
		{
			type: "text",
			value: `<div > FSSAI Lic NO. 10722030000046 </div>
                  <div > Thanks...Visit...Again.. </div>`,
			style: { textAlign: "center", fontSize: "12px", margin: "5px 8px 0 8px", fontFamily: "Roboto", fontWeight: "bold" },
		},
	];

	const printData = [...printDataHeader, ...printDataCustomer, ...printOrderHeader, ...printOrderDetail, ...printTotal];

	const options = {
		preview: true,
		margin: "0px 0px 0px 0px",
		silent: true,
		copies: 1,
		printerName: printerName,
		timeOutPerLine: 600,
		pageSize: "76mm", // page size,
		color: false,
		printBackground: false,
		dpi: 300,
	};

	PosPrinter.print(printData, options).catch((error) => {
		console.error(error);
	});
});

// ipcMain.handle("printKot", async (event, payload) => {
// 	const { data, printerName } = payload;

// 	const fullDate = new Date();
// 	const date = `${fullDate.getDate()}/${fullDate.getMonth()+1}/${fullDate.getFullYear()}`;
// 	const time = `${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}`;

// 	const printDataHeader = [
// 		{
// 			type: "text",
// 			value: `KOT - ${data.kotTokenNo}`,
// 			// value:"kam karva mand ne",
// 			style: { fontWeight: "700", textAlign: "center", fontSize: "30px", borderBottom: "1px solid", fontFamily: "Roboto" },
// 		},
// 		// {
// 		// 	type: "text",
// 		// 	value: "Plot no. 1&2, Royal Avenue Gate-1,nr, nana mauva circle, 150ft ringroad, opp.silver height,nana mauva main road,<br> Rajkot -360004",
// 		// 	style: { fontWeight: "700", textAlign: "center", fontSize: "15px", fontFamily: "Roboto" },
// 		// },
// 		// {
// 		// 	type: "text",
// 		// 	value: "Mob. No. 9978964000",
// 		// 	style: { fontWeight: "700", textAlign: "center", fontSize: "15px", fontFamily: "Roboto" },
// 		// },
// 		// {
// 		// 	type: "text",
// 		// 	value: "GST NO :24AABCY 4639H1ZB ",
// 		// 	style: { fontWeight: "700", textAlign: "center", fontSize: "15px", borderBottom: "1px solid", paddingBottom: "3px", fontFamily: "Roboto" },
// 		// },
// 	];

// 	const printDataCustomer = [
// 		// {
// 		// 	type: "text",
// 		// 	value: `Name : ${data.customerName} <br> M: ${data.customerContact}`,
// 		// 	style: { textAlign: "left", fontSize: "13px", margin: "5px 0 0 5px", fontFamily: "Roboto" },
// 		// },
// 		// {
// 		// 	type: "text",
// 		// 	value: `Add : ${data.customerAdd} ${data.customerLocality}`,
// 		// 	style: { textAlign: "left", fontSize: "13px", margin: "0 0 0 5px", borderBottom: "1px solid", paddingBottom: "3px", fontFamily: "Roboto" },
// 		// },
// 		// {
// 		// 	type: "text",
// 		// 	value: `<div> Date : ${date} </div> <div>  ${data.orderType} <div>`,
// 		// 	style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "5px 8px 0 8px", fontFamily: "Roboto" },
// 		// },
// 		// {
// 		// 	type: "text",
// 		// 	value: `<div>  ${time} </div> <div>  Order No :120 <div>`,
// 		// 	style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "2px 8px 0 8px", fontFamily: "Roboto" },
// 		// },
// 		// {
// 		// 	type: "text",
// 		// 	value: `<div> Cashier : biller </div> <div style="font-weight : bold ">  Token No :120 <div>`,
// 		// 	style: {
// 		// 		textAlign: "left",
// 		// 		fontSize: "13px",
// 		// 		display: "flex",
// 		// 		justifyContent: "space-between",
// 		// 		margin: "2px 8px 0 8px",
// 		// 		borderBottom: "1px solid black",
// 		// 		paddingBottom: "3px",
// 		// 		fontFamily: "Roboto",
// 		// 	},
// 		// },
// 	];

// 	const printOrderHeader = [
// 		// {
// 		// 	type: "text",
// 		// 	value: `<div style="flex : 8" > Item </div>
// 		//       <div style="flex : 3; text-align:center" > QTY </div>
// 		//       <div style="flex : 3; text-align:center "> Price </div>
// 		//       <div style="flex : 3; text-align:center"> Amount </div>`,
// 		// 	style: {
// 		// 		textAlign: "left",
// 		// 		fontSize: "13px",
// 		// 		display: "flex",
// 		// 		justifyContent: "space-between",
// 		// 		margin: "5px 8px 0 8px",
// 		// 		borderBottom: "1px solid black",
// 		// 		paddingBottom: "3px",
// 		// 		fontWeight: "bold",
// 		// 		fontFamily: "Roboto",
// 		// 	},
// 		// },
// 	];

// 	let printOrderDetail = [];

// 	data.orderCart.forEach((item) => {
// 		const orderitem = {
// 			type: "text",
// 			value: `<div style="flex : 8" > ${item.itemName} ${item.variantName} </div>
//                   <div style="flex : 3 ; text-align:center"> x${item.itemQty} </div>
//                   <div style="flex : 3 ; text-align:center" > ${item.itemTotal} </div>
//                   <div style="flex : 3 ; text-align:center"> ${item.multiItemTotal}</div>`,
// 			style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "5px 8px 0 8px", fontFamily: "Roboto" },
// 		};
// 		printOrderDetail.push(orderitem);

// 		if (item.toppings) {
// 			item.toppings.forEach((topping) => {
// 				const orderTopping = {
// 					type: "text",
// 					value: `<div> ${topping.type}[topping] : ${topping.qty} x ${topping.price} = ${topping.price * topping.qty}  </div>`,
// 					style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "start", margin: "0px 8px 0 20px", fontFamily: "Roboto" },
// 				};

// 				printOrderDetail.push(orderTopping);
// 			});
// 		}
// 	});

// 	const printTotal = [
// 		{
// 			type: "text",
// 			value: `<div style="padding-left:65px" > Item Qty : ${data.orderCart.length}  </div>
//                   <div style="" > Sub Total :</div>
//                   <div style="padding-right : 10px" > ${data.subTotal.toFixed(2)} </div>`,
// 			style: {
// 				textAlign: "left",
// 				fontSize: "13px",
// 				display: "flex",
// 				justifyContent: "space-between",
// 				margin: "5px 8px 0 8px",
// 				borderTop: "1px solid black",
// 				padding: "5px 0",
// 				fontFamily: "Roboto",
// 			},
// 		},
// 		{
// 			type: "text",
// 			value: `<div style="padding-left:65px" > CGST </div>
//                   <div style="" > 2.5% :</div>
//                   <div style="padding-right : 10px" > ${(data.subTotal * 0.025).toFixed(2)} </div>`,
// 			style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "0px 8px 0 8px", fontFamily: "Roboto" },
// 		},
// 		{
// 			type: "text",
// 			value: `<div style="padding-left:65px" > SGST </div>
//                   <div style="" > 2.5% :</div>
//                   <div style="padding-right : 10px" > ${(data.subTotal * 0.025).toFixed(2)} </div>`,
// 			style: {
// 				textAlign: "left",
// 				fontSize: "13px",
// 				display: "flex",
// 				justifyContent: "space-between",
// 				margin: "0px 8px 0 8px",
// 				borderBottom: "1px solid black",
// 				padding: "5px 0",
// 				fontFamily: "Roboto",
// 			},
// 		},
// 		{
// 			type: "text",
// 			value: `<div style="padding-left:65px" > Grand Total </div>
//                   <div style="padding-right : 10px" > ₹ ${data.cartTotal.toFixed(2)} </div>`,
// 			style: {
// 				textAlign: "left",
// 				fontSize: "14px",
// 				display: "flex",
// 				justifyContent: "space-between",
// 				margin: "0px 8px 0 8px",
// 				fontWeight: "bold",
// 				padding: "5px 0",
// 				fontFamily: "Roboto",
// 			},
// 		},
// 		{
// 			type: "text",
// 			value: `<div > ${data.paymentMethod} </div>`,
// 			style: {
// 				textAlign: "left",
// 				fontSize: "12px",
// 				display: "flex",
// 				justifyContent: "flex-start",
// 				margin: "0px 8px 0 8px",
// 				borderBottom: "1px solid black",
// 				padding: "5px 10px",
// 				fontFamily: "Roboto",
// 			},
// 		},
// 		{
// 			type: "text",
// 			value: `<div > FSSAI Lic NO. 10722030000046 </div>
//                   <div > Thanks...Visit...Again.. </div>`,
// 			style: { textAlign: "center", fontSize: "12px", margin: "5px 8px 0 8px", fontFamily: "Roboto", fontWeight: "bold" },
// 		},
// 	];

// 	const printData = [...printDataHeader, ...printOrderDetail];
// 	// const printData = [...printDataHeader, ...printDataCustomer];

// 	const options = {
// 		preview: false,
// 		margin: "0px 0px 0px 0px",
// 		silent: false,
// 		copies: 1,
// 		printerName: printerName,
// 		timeOutPerLine: 600,
// 		pageSize: "76mm", // page size,
// 		color: false,
// 		printBackground: false,
// 		dpi: 300,
// 	};

// 	PosPrinter.print(printData, options).catch((error) => {
// 		console.error(error);
// 	});
// });
