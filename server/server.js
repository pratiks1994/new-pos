const { getCategories } = require("./menuData/getData");
const { createServer } = require("http");
const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createOrder } = require("./orders/createOrder");
const sqlite = require("sqlite3").verbose();
const path = require("path");
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
const Database = require("better-sqlite3");
const { updatePrinter } = require("./printers/updatePrinter");
const { getOldKOTs } = require("./KOT/getOldKOTs");
const { getMenuData } = require("./menuData/getMenuData");
const { setMenuData } = require("./menuData/setMenuData");
// const { Socket } = require("socket.io-client");
const db2 = new Database("restaurant.sqlite", {});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
      cors: {
            origin: "*",
      },
});
app.use(cors("*"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const openDb = () => {
      // for build path.join("resources", "restaurant.sqlite")
      const db = new sqlite.Database(path.join("restaurant.sqlite"), (err) => {
            if (err) {
                  console.log(err);
            }
      });
      return db;
};

// io.on("getIntitalKOTs", (socket) => {
//       const liveKOTs = getLiveKOT();
//       socket.emit("KOTs", liveKOTs);
// });

app.get("/categories", async (req, res) => {
      console.log("rq recieved");
      const db = openDb();
      let categories = await getCategories(db);
      res.status(200).json(categories);
});

app.get("/menuData", (req, res) => {
      const menuData = getMenuData();
      res.status(200).json(menuData);
});

// app.get("/categories/:id", async (req, res) => {
//    let id = req.params.id;
//    let items = await getData(id);

//    res.status(200).json(items);
// });

app.get("/ping", async (req, res) => {
      res.status(200).json({ status: "success" });
});

app.get("/liveOrders", (req, res) => {
      const start = Date.now();
      const db = openDb();
      const orders = getLiveOrders();
      res.status(200).json(orders);
      // console.log(`get live ${Date.now() - start}`);
});

app.get("/liveKOT", (req, res) => {
      // const db = openDb();
      const liveKOTs = getLiveKOT();
      res.status(200).json(liveKOTs);
});

app.put("/liveKot", (req, res) => {
      const { order_id, order_type } = req.body;
      updateKOT(db2, req.body);
      res.sendStatus(200);
      const liveKOTs = getLiveKOT();
      io.emit("KOTs", liveKOTs);

      if (order_id !== null && order_type !== "dine_in") {
            const data = { orderStatus: "accepted", orderId: order_id, orderType: order_type };
            updateLiveOrders(db2, data);
            const orders = getLiveOrders();
            io.emit("orders", orders);
      }
});

app.post("/order", (req, res, next) => {
      // middleware
      const db = openDb();

      //  for order type Dine In only check if same table number exist and is not setteled, if axist add items to that order only no need to create new KOT
      const orderId = checkAndUpdateOrder(req.body, db);
      if (orderId !== "") {
            // for isUpdate = true emmit live order, terminate request as order is updated
            res.sendStatus(200);
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
                  res.status(200).json({ isOldKOTsExist });
            } else {
                  next();
            }
      } else {
            next();
      }
});

app.post("/order", (req, res) => {
      // const db = openDb();

      // create new order
      const { userId, orderId } = createOrder(req.body);
      res.status(200).json({ isOldKOTsExist: false });
      // create new KOT
      createKot(req.body, userId, orderId);

      // after entry in table emmit both order and KOTs
      const orders = getLiveOrders();
      io.emit("orders", orders);
      const liveKOTs = getLiveKOT();
      io.emit("KOTs", liveKOTs);
});

app.post("/KOT", (req, res, next) => {
      const isOrdeExist = checkExistingOrder(req.body);
      if (!isOrdeExist) {
            next();
      } else {
            res.status(200).json({ orderExist: true });
      }
});

app.post("/KOT", (req, res) => {
      // const db = openDb();
      //  create KOT
      createKot(req.body);
      res.status(200).json({ orderExist: false });
      // emmit KOT
      const liveKOTs = getLiveKOT();
      io.emit("KOTs", liveKOTs);
});

app.put("/liveOrders", (req, res) => {
      const db = openDb();

      // update live order status
      updateLiveOrders(db, req.body);
      res.status(200).json("updated");

      // emmit live orders after entry in table
      const orders = getLiveOrders(db);
      io.emit("orders", orders);

      // only update and emmit KOT for pick up or delivery and status is "accpted"/ click on "food is redy"
      if (req.body.orderType !== "dine_in" && req.body.orderStatus === "accepted") {
            const liveKOTs = getLiveKOT();
            io.emit("KOTs", liveKOTs);
      }
});

app.get("/users", async (req, res) => {
      const db = openDb();
      const userSuggest = await getUserSuggest(db, req.query);
      res.status(200).json(userSuggest);
});

app.post("/holdOrder", async (req, res) => {
      const db = openDb();
      createHoldOrder(req.body, db);
      res.sendStatus(200);
      const holdOrders = await getHoldOrders(db);
      io.emit("holdOrders", holdOrders);
});

app.get("/holdOrder", async (req, res) => {
      const db = openDb();
      const holdOrders = await getHoldOrders(db);
      res.status(200).json(holdOrders);
});

app.delete("/holdOrder", async (req, res) => {
      const db = openDb();
      await deletHoldOrder(db, req.query.id);
      res.sendStatus(200);
      const holdOrders = await getHoldOrders(db);
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

app.post("/updateOrderAndCreateKOT", (req, res) => {
      // const db = openDb();
      const orderId = checkAndUpdateOrder(req.body);
      res.sendStatus(200);
      let userId;
      createKot(req.body, userId, orderId);
      const orders = getLiveOrders();
      io.emit("orders", orders);
      const liveKOTs = getLiveKOT();
      io.emit("KOTs", liveKOTs);
});

app.post("/includeKOTsAndCreateOrder", (req, res) => {
      const oldKOTs = getOldKOTs(req.body.tableNumber);
      res.sendStatus(200);
      createKot(req.body);
      let newFinalOrder = mergeKOTandOrder(req.body, oldKOTs);
      // console.log(newFinalOrder)
      const { userId, orderId } = createOrder(newFinalOrder);
      updateKOTUserId(orderId, userId, req.body.tableNumber);
      const orders = getLiveOrders();
      io.emit("orders", orders);
      const liveKOTs = getLiveKOT();
      io.emit("KOTs", liveKOTs);
});

app.post("/updateDatabase", (req, res) => {
      console.log("update");
      setMenuData();
      res.sendStatus(200);
});

httpServer.listen(3001, (err) => {
      if (err) {
            console.log(err);
      } else {
            console.log("server started");
      }
});
