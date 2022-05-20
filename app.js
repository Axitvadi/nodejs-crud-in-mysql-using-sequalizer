require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require("./config/db.config");
const routes = require("./routes/index")

app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb',extended:false}))

app.use(routes);

app.listen(port,() => {
console.log(`server successfully started at port ${port} !`);
}) 