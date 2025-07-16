const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../config/nodeMailer");

const generateOtp = function () {
  return Math.floor(100000 + Math.random() * 90000).toString();
};

//* To register a user
exports.register = async function (req, res) {
  // Extracting name, email, and password from request body
  const { name, email, password } = req.body;

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
      //   secure: process.env.NODE_ENV === "production" ? false : true,
      secure: false,
      //   sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      sameSite: "Lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    await sendMail(user.email, "Greetings from Pikaabee", `Your account has been created with ${user.email}`);

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
      //   secure: process.env.NODE_ENV === "production" ? false : true,
      secure: false,
      //   sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      sameSite: "Lax",
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

// Send Verificvation OTP to the user's Email
exports.sendVerifyOtp = async function (req, res) {
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const otp = generateOtp();

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    sendMail(user.email, "Account Verification OTP", `Your OTP is ${otp}, Verify you account using this OTP.`);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Verification OTP sent email successfully",
    });
  } catch (error) {
    console.error(`SendVerifyOtp Err: ${error}`);

    return res.status(500).json({
      success: false,
      message: `SendVerifyOtp Err: ${error}`,
    });
  }
};

exports.verifyEmail = async function (req, res) {
  const { email, otp } = req.body;

  if ((!email, !otp)) {
    return res.status(400).json({
      success: true,
      message: "All the fields required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: true,
        message: "User notfound",
      });
    }

    if (user.verifyOtp !== otp || user.verifyOtp === "") {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP, Please check",
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error(`VerifyEmail Err: ${error}`);

    return res.status(500).json({
      success: false,
      message: `VerifyEmail Err: ${error}`,
    });
  }
};
