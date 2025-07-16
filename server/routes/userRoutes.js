const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const { getUserData } = require("../controllers/userController");

const userRouter = express.Router();

userRouter.route("/data").get(userAuth, getUserData);

module.exports = userRouter;
