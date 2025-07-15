const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateOtp = function () {
  return Math.floor(10000 + Math.random).toString();
};

exports.register = async function (req, res) {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All the fields required",
    });
  }

  try {
    const existingUser = await userModel.findOne(email);

    if (existingUser) {
      return res.status(500).json({
        success: false,
        message: `Register User Err: User already exits with this mail`,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: `User Registred successful`,
    });
  } catch (error) {
    console.error(`Register User Err: ${error}`);

    return res.status(500).json({
      success: false,
      message: `Register User Err: ${error}`,
    });
  }
};
