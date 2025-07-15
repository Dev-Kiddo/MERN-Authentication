const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateOtp = function () {
  return Math.floor(10000 + Math.random).toString();
};

//* To register a user
exports.register = async function (req, res) {
  // Extracting name, email, and password from request body
  const { name, email, password } = req.body;
  console.log(name, email, password);

  //  If any of the required fields is missing, return an error
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All the fields required",
    });
  }

  try {
    // Check if a user already exists with the given email
    const existingUser = await userModel.findOne({ email });

    // If yes, respond Err - User already exists with this mail
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `Register User Err: User already exits with this mail`,
      });
    }

    // If email is unique, hash the password using bcryptjs
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user document (Mongoose instance)
    const user = new userModel({
      name,
      email,
      password: hashPassword, // store hashed password, not plain text
    });

    // Save user document to the MongoDB database
    await user.save();

    // Generate a JWT token using user._id as payload
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Send JWT token as a cookie to the client
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? false : true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: `Registred successful`,
    });
  } catch (error) {
    // Catch any unexpected error and respond
    console.error(`Register User Err: ${error}`);

    return res.status(500).json({
      success: false,
      message: `Register User Err: ${error}`,
    });
  }
};

exports.login = async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All the fields required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Entered email is not valid",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Entered password is not valid",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? false : true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successfull",
    });
  } catch (error) {
    console.error(`Login User Err: ${error}`);

    return res.status(500).json({
      success: false,
      message: `Login User Err: ${error}`,
    });
  }
};

exports.logout = async function (req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? false : true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logout successfull",
    });
  } catch (error) {
    console.error(`Logout User Err: ${error}`);

    return res.status(500).json({
      success: false,
      message: `Logout User Err: ${error}`,
    });
  }
};
