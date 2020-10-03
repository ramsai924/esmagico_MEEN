const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path= require('path')
const compression = require('compression');
const db = require("./config/db")
const folder = require("./routes/folder")
const file = require("./routes/file")
const app = express();

app.set("view engine","ejs");
app.use(compression()); 
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

//routes
app.use("/" , folder)
app.use("/folder",file)
const port = 3000 || process.env.PORT;
app.listen(port,() => {
    console.log(`connected to port : ${port}`)
})