const mongoose = require("mongoose");

const connectDB = async function () {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Success: Database Connected`);
  } catch (error) {
    console.log(`Fail: Database Error; `);
  }
};

module.exports = connectDB;
