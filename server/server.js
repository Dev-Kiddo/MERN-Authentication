const express = require("express");
const connectDB = require("./config/dbConfig");
require("dotenv").config();

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server started at the port: ${process.env.PORT}`);
  connectDB();
});
