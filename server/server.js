const express = require("express");
const connectDB = require("./config/dbConfig");
const router = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
// Middlewares
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", router);
app.use("/api/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server started at the port: ${process.env.PORT}`);
  connectDB();
});
