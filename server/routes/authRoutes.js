const express = require("express");
const { register, login, logout, sendVerifyOtp, verifyEmail } = require("../controllers/authControllers");
const router = express.Router();

router.route("/api/auth/register").post(register);
router.route("/api/auth/login").post(login);
router.route("/api/auth/logout").post(logout);
router.route("/api/auth/send-verify-otp").post(sendVerifyOtp);
router.route("/api/auth/verify-email").post(verifyEmail);

module.exports = router;
