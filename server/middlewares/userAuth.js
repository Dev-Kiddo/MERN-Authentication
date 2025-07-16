const jwt = require("jsonwebtoken");

exports.userAuth = async function (req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).josn({
      success: false,
      message: "Not authorized, Login again",
    });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("tokenDecode:", tokenDecode);

    if (tokenDecode.userId) {
      req.userId = tokenDecode.userId;
      next();
    } else {
      return res.status(400).json({
        success: false,
        message: "UserAuth Err: Not authorized, Login again",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `UserAuth Err: ${error}`,
    });
  }
};
