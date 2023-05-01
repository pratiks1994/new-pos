const { getCategories } = require("./getData");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createOrder } = require("./createOrder");
const sqlite = require("sqlite3").verbose();
const path = require("path");

// const {getLiveOrders} = require("./getLiveOrders")

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

// app.get("/liveOrders",async(req,res)=>{
//    const liveOrders = await getLiveOrders()
//    res.status(200).json(liveOrders)
// })

app.post("/order", (req, res) => {
     const db = openDb();
     createOrder(req.body, db);
     res.sendStatus(200);
});

app.listen(3001, (err) => {
     if (err) {
          console.log(err);
     } else {
          console.log("server started");
     }
});
