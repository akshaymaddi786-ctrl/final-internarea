const mongoose=require("mongoose")
require('dotenv').config()
const database = process.env.DATABASE_URL || process.env.MONGO_URI;
const url = database || "mongodb://127.0.0.1:27017/internarea";
module.exports.connect = () => {
  if (mongoose.connection.readyState >= 1) return;
  
  mongoose.connect(url)
    .then(() => console.log("Database is connected"))
    .catch((error) => {
      console.error("Database connection failed:", error.message);
    });
};