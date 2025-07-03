const mongoose = require("mongoose");

const connectDb = async () => {
  console.log(" Trying to connect to MongoDB...");
  console.log("CONNECTION_STRING =", process.env.CONNECTION_STRING);

  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(" MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

module.exports = connectDb;
