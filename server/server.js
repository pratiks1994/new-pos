// const { getCategories } = require("./menuData/getData");
const { createServer } = require("http");
const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createOrder } = require("./orders/createOrder");
const { getUserSuggest } = require("./users/usersSuggest");
const { createKot } = require("./KOT/createKot");
const { getLiveKOT } = require("./KOT/getLiveKOT");
const { getLiveOrders } = require("./orders/getLiveOrders");
const { updateKOT } = require("./KOT/updateKot");
const { updateLiveOrders } = require("./orders/updateLiveOrders");
const { createHoldOrder } = require("./holdOrder/createHoldOrder");
const { getHoldOrders } = require("./holdOrder/getHoldOrders");
const { deletHoldOrder } = require("./holdOrder/deletHoldOrder");
const { checkAndUpdateOrder } = require("./orders/checkAndUpdateOrder");
const { checkExistingOrder } = require("./orders/checkExistingOrder");
const { getPrinters } = require("./printers/getPrinters");
const { checkOldKOTs } = require("./KOT/checkOldKOTs");
const { mergeKOTandOrder } = require("./common/mergeKOTandOrder");
const { updateKOTUserId } = require("./KOT/updateKOTUserId");
const { updatePrinter } = require("./printers/updatePrinter");
const { getOldKOTs } = require("./KOT/getOldKOTs");
const { getMenuData } = require("./menuData/getMenuData");
const { setMenuData } = require("./menuData/setMenuData");
const { assignPrinterToBill } = require("./printers/assignPrinterToBill");
const { updateDefaultScreenData } = require("./settings/updateDefaultScreenData");
const { getDefaultScreenData } = require("./settings/getDefaultScreenData");
const { getOrder } = require("./orders/getOrder");
const { addOrderIdToOldKots } = require("./KOT/addOrderIdToOldKots");
// const appPath = process.argv
// console.log(appPath)


const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
    console.log("A client has connected:", socket.id);

    // You can perform any necessary actions here when a client connects.

    socket.on("disconnect", () => {
        console.log("A client has disconnected:", socket.id);
        
        // You can perform cleanup or other actions when a client disconnects.
    });
});


app.use(cors("*"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/menuData", (req, res) => {
	const menuData = getMenuData();
	res.status(200).json(menuData);
});


app.get("/ping", async (req, res) => {
	res.status(200).json({ status: "success" });
});

app.get("/liveOrders", (req, res) => {
	const start = Date.now();
	const orders = getLiveOrders();
	res.status(200).json(orders);

});

app.get("/liveKOT", (req, res) => {
	const liveKOTs = getLiveKOT();
	res.status(200).json(liveKOTs);
});

app.put("/liveKot", (req, res) => {
	const { order_id, order_type } = req.body
	updateKOT( req.body);
	res.sendStatus(200);
	const liveKOTs = getLiveKOT();
	io.emit("KOTs", liveKOTs);

	if (order_id !== null && order_type !== "dine_in") {

		const data = { orderStatus: "accepted", orderId: order_id, orderType: order_type };

		updateLiveOrders(data);
		const orders = getLiveOrders();
		io.emit("orders", orders);
	}
});

app.post("/order", (req, res, next) => {
	// middleware

	//  for order type Dine In only check if same table number exist and is not setteled, if axist add items to that order only no need to create new KOT
	const orderId = checkAndUpdateOrder(req.body);

	if (orderId !== "") {
		// for isUpdate = true emmit live order, terminate request as order is updated
		const order = getOrder(orderId);

		res.status(200).json({ isOldKOTsExist: false, order, isOldOrderExist: true });
		const orders = getLiveOrders();
		io.emit("orders", orders);
	} else {
		// for isUpdate = false move on to create new order kot
		next();
	}
});

app.post("/order", (req, res, next) => {
	if (req.body.orderType === "dine_in") {
		const isOldKOTsExist = checkOldKOTs(req.body.tableNumber);
		if (isOldKOTsExist) {
			res.status(200).json({ isOldKOTsExist, order: {}, isOldOrderExist: false });
		} else {
			next();
		}
	} else {
		next();
	}
});

app.post("/order", (req, res) => {

	const { userId, orderId, orderNo } = createOrder(req.body);

	const kotTokenNo = createKot(req.body, userId, orderId);

	const order = getOrder(orderId);

	res.status(200).json({ isOldKOTsExist: false, orderNo, kotTokenNo, order, isOldOrderExist: false });
	const orders = getLiveOrders();
	io.emit("orders", orders);
	const liveKOTs = getLiveKOT();
	io.emit("KOTs", liveKOTs);
});

app.post("/KOT", (req, res, next) => {
	const isOrderExist = checkExistingOrder(req.body);
	if (!isOrderExist) {
		next();
	} else {
		res.status(200).json({ orderExist: true });
	}
});

app.post("/KOT", (req, res) => {
	//  create KOT
	const kotTokenNo = createKot(req.body);
	res.status(200).json({ orderExist: false, kotTokenNo });
	// emmit KOT
	const liveKOTs = getLiveKOT();
	io.emit("KOTs", liveKOTs);
});

app.put("/liveOrders", (req, res) => {

	// update live order status
	updateLiveOrders(req.body);
	res.status(200).json("updated");

	// emmit live orders after entry in table
	const orders = getLiveOrders();
	io.emit("orders", orders);

	// only update and emmit KOT for pick up or delivery and status is "accpted"/ click on "food is redy"
	if (req.body.orderType !== "dine_in" && req.body.orderStatus === "accepted") {
		const liveKOTs = getLiveKOT();
		io.emit("KOTs", liveKOTs);
	}
});

app.get("/users", async (req, res) => {

	const userSuggest = getUserSuggest(req.query);
	res.status(200).json(userSuggest);
});

app.post("/holdOrder", async (req, res) => {
	createHoldOrder(req.body);
	res.sendStatus(200);
	const holdOrders =  getHoldOrders();
	io.emit("holdOrders", holdOrders);
});

app.get("/holdOrder", async (req, res) => {
	const holdOrders = getHoldOrders();
	res.status(200).json(holdOrders);
});

app.delete("/holdOrder", async (req, res) => {
	
    deletHoldOrder(req.query.id);
	res.sendStatus(200);
	const holdOrders =  getHoldOrders();
	io.emit("holdOrders", holdOrders);
});

app.get("/getPrinters", (req, res) => {
	const printers = getPrinters();
	res.status(200).json(printers);
});

app.put("/updatePrinter", (req, res) => {
	updatePrinter(req.body);
	res.sendStatus(200);
});

app.put("/assignPrinterToBill", (req, res) => {
	assignPrinterToBill(req.body);
	res.sendStatus(200);
});

app.post("/updateOrderAndCreateKOT", (req, res) => {
	// const db = openDb();
	const orderId = checkAndUpdateOrder(req.body);
	let userId;
	const kotTokenNo = createKot(req.body, userId, orderId);
	res.status(200).json(kotTokenNo);
	const orders = getLiveOrders();
	io.emit("orders", orders);
	const liveKOTs = getLiveKOT();
	io.emit("KOTs", liveKOTs);
});

app.post("/includeKOTsAndCreateOrder", (req, res) => {
	const oldKOTs = getOldKOTs(req.body.tableNumber);
	// console.log(oldKOTs)
	const kotTokenNo = createKot(req.body);
	let newFinalOrder = mergeKOTandOrder(req.body, oldKOTs);
	const { userId, orderId, orderNo } = createOrder(newFinalOrder);
	addOrderIdToOldKots(orderId, req.body.tableNumber);

	const order = getOrder(orderId);

	res.status(200).json({ newFinalOrder, kotTokenNo, orderNo, order });

	updateKOTUserId(orderId, userId, req.body.tableNumber);

	const orders = getLiveOrders();
	io.emit("orders", orders);
	const liveKOTs = getLiveKOT();
	io.emit("KOTs", liveKOTs);
});

app.post("/updateDatabase", (req, res) => {
	const { token } = req.body;
	setMenuData(token);
	res.sendStatus(200);
});

app.get("/defaultScreenData", (req, res) => {
	const options = getDefaultScreenData();
	res.status(200).json(options);
});

app.patch("/defaultScreenData", (req, res) => {
	updateDefaultScreenData(req, res);
});

httpServer.listen(3001, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("server started");
	}
});

process.on('message', (message) => {
    if (message.command === 'shutdown') {
		console.log("shutting down")
        process.exit(0);
    }
});
