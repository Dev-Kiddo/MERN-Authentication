const express = require("express");
const { register } = require("../controllers/authControllers");
const router = express.Router();

router.route("/api/auth/register").post(register);

module.exports = router;
