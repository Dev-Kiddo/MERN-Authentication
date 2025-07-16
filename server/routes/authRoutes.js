const express = require("express");
const { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, verifyResetOtp, sendResetOtp } = require("../controllers/authControllers");
const { userAuth } = require("../middlewares/userAuth");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/send-verify-otp").post(userAuth, sendVerifyOtp);
router.route("/verify-email").post(userAuth, verifyEmail);
router.route("/is-auth").post(userAuth, isAuthenticated);
router.route("/send-reset-otp").post(sendResetOtp);
router.route("/reset-password").post(verifyResetOtp);

module.exports = router;
