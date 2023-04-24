const { getData, getCategories } = require("./getData");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const {createOrder} = require("./createOrder")
// const {getLiveOrders} = require("./getLiveOrders")

const app = express();
app.use(cors("*"))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/categories", async (req, res) => {
   let categories = await getCategories();

   res.status(200).json(categories);
});

app.get("/categories/:id", async (req, res) => {
   let id = req.params.id;
   let items = await getData(id);

   res.status(200).json(items);
});

app.get("/ping", async (req, res) => {
   res.sendStatus(200)
});

// app.get("/liveOrders",async(req,res)=>{
//    const liveOrders = await getLiveOrders()
//    res.status(200).json(liveOrders)
// })

app.post("/order",(req,res)=>{
   createOrder(req.body)
   res.sendStatus(200)
})

app.listen(3001,(err)=>{
   if(err){console.log(err)}
   else{console.log("server started")}
});
