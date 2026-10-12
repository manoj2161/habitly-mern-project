import mongoose from "mongoose";
import "dotenv/config";
export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "habitly",
    });
    console.log("habitly database connected successfully");
  } catch (error) {
    console.error("database connection error ", error.message);
  }
};
