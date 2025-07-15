const express = require("express");
const connectDB = require("./config/dbConfig");
const router = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Server started at the port: ${process.env.PORT}`);
  connectDB();
});
