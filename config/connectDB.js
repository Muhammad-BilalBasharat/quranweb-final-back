import mongoose from "mongoose";
import { MONGODB_URI } from "./envConfig.js";

const Database = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export default Database;