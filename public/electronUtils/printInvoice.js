const { PosPrinter } = require("electron-pos-printer");

const printInvoice = async (payload) =>{
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
	];

	let printTotalTax = [];

	data.totalTaxes.forEach((tax) => {
		printTotalTax.push({
			type: "text",
			value: `<div style="padding-left:65px" > ${tax.name} </div>
                  <div style="" > 2.5% :</div> 
                  <div style="padding-right : 10px" > ${tax.tax_amount.toFixed(2)} </div>`,
			style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "0px 8px 0 8px", fontFamily: "Roboto" },
		});
	});

	const printFooter = [
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
				borderTop: "1px solid black",
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

	const printData = [...printDataHeader, ...printDataCustomer, ...printOrderHeader, ...printOrderDetail, ...printTotal, ...printTotalTax, ...printFooter];

	const options = {
		preview: false,
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


}

module.exports = {printInvoice}