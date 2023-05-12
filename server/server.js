const { getCategories } = require("./menuData/getData");
const express = require("express");
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
const {getHoldOrders} = require("./holdOrder/getHoldOrders")
const {deletHoldOrder} = require("./holdOrder/deletHoldOrder")

const app = express();
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
      db.close();
});

// app.get("/categories/:id", async (req, res) => {
//    let id = req.params.id;
//    let items = await getData(id);

//    res.status(200).json(items);
// });

app.get("/ping", async (req, res) => {
      res.sendStatus(200);
});

app.get("/liveKOT", async (req, res) => {
      const db = openDb();
      const liveKOTs = await getLiveKOT(db);
      res.status(200).json(liveKOTs);
});

app.put("/liveKot", async (req, res) => {
      const db = openDb();
      updateKOT(db, req.body);
      res.sendStatus(200);
});

app.post("/order", async (req, res) => {
      const db = openDb();
      const userId = await createOrder(req.body, db);
      createKot(req.body, db, userId);
      res.sendStatus(200);
});

app.get("/liveOrders", async (req, res) => {
      const db = openDb();
      const orders = await getLiveOrders(db);
      res.status(200).json(orders);
});

app.put("/liveOrders", async (req, res) => {
      const db = openDb();
      const orders = await updateLiveOrders(db, req.body);
      res.status(200).json("updated");
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
});

app.get("/holdOrder", async (req, res) => {
      const db = openDb();
      const holdOrders = await getHoldOrders(db);
      res.status(200).json(holdOrders)
});

app.delete("/holdOrder",async (req,res)=> {
      const db = openDb();
       deletHoldOrder(db,req.query.id)
       res.sendStatus(200)
})

app.listen(3001, (err) => {
      if (err) {
            console.log(err);
      } else {
            console.log("server started");
      }
});
