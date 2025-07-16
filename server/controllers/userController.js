const userModel = require("../models/userModel");

exports.getUserData = async function (req, res) {
  console.log("Entered into getUser data");
  const { userId } = req;

  if (!userId) {
    return res.status(400).json({
      success: true,
      message: "UserID not found",
    });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: true,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.error(`GetUser Err: ${error}`);

    return res.status(500).json({
      success: false,
      message: `GetUser Err: ${error}`,
    });
  }
};
