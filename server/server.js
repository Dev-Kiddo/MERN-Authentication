const express = require("express");
const connectDB = require("./config/dbConfig");
const router = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Server started at the port: ${process.env.PORT}`);
  connectDB();
});
