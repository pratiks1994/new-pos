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
const Database = require("better-sqlite3");
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



app.get("/categories", async (req, res) => {
      console.log("rq recieved");
      const db = openDb();
      let categories = await getCategories(db);
      res.status(200).json(categories);
});

// app.get("/categories/:id", async (req, res) => {
//    let id = req.params.id;
//    let items = await getData(id);

//    res.status(200).json(items);
// });

app.get("/ping", async (req, res) => {
      res.sendStatus(200);
});

app.get("/liveOrders", (req, res) => {
      const start = Date.now();
      const db = openDb();
      const orders = getLiveOrders(db);
      res.status(200).json(orders);
      console.log(`get live ${Date.now() - start}`);
});

app.get("/liveKOT", (req, res) => {

      // const db = openDb();
      const liveKOTs = getLiveKOT();
      res.status(200).json(liveKOTs);
});

app.put("/liveKot", (req, res) => {
      // const db = openDb();
      const start = Date.now();
      updateKOT(db2,req.body);
      res.sendStatus(200);
      console.log(`update KOT 1 ${Date.now() - start}`);
      const liveKOTs = getLiveKOT();
      io.emit("KOTs", liveKOTs);
      console.log(`update  KOT 2 ${Date.now() - start}`);


});

app.post("/order", async (req, res, next) => {
      const db = openDb();

      const isUpdated = checkAndUpdateOrder(req.body, db);
      if (isUpdated) {
            res.sendStatus(200);
            const orders = getLiveOrders(db);
            io.emit("orders", orders);
      } else {
            next();
      }
});

app.post("/order", (req, res) => {
      const db = openDb();
      const start = Date.now();
      const userId = createOrder(req.body, db);
      res.sendStatus(200);
      createKot(req.body, db, userId);

      if (userId !== "any") {
            const orders = getLiveOrders(db);
            io.emit("orders", orders);
            const liveKOTs = getLiveKOT();
            io.emit("KOTs", liveKOTs);
            console.log(`time ${Date.now() - start}`);
      }
});

app.post("/KOT", (req, res) => {
      const db = openDb();
      const userId = 0;
      createKot(req.body, db, userId);
      res.sendStatus(200);
      const liveKOTs = getLiveKOT();
      io.emit("KOTs", liveKOTs);
});

app.put("/liveOrders", (req, res) => {
      const db = openDb();
      updateLiveOrders(db, req.body);
      res.status(200).json("updated");
      const orders = getLiveOrders(db);
      io.emit("orders", orders);
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

httpServer.listen(3001, (err) => {
      if (err) {
            console.log(err);
      } else {
            console.log("server started");
      }
});
