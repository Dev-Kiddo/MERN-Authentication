const express = require("express");
const { register, login, logout } = require("../controllers/authControllers");
const router = express.Router();

router.route("/api/auth/register").post(register);
router.route("/api/auth/login").post(login);
router.route("/api/auth/logout").post(logout);

module.exports = router;
