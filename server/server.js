const { getData, getCategories } = require("./getData");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')

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

app.listen(3001,(err)=>{
   if(err){console.log(err)}
   else{console.log("server started")}
});
