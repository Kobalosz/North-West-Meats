import mongoose, { mongo } from "mongoose";

export const connectDB = async (params) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `The Database is up running and Connected! ${conn.connection.host}`
    );
  } catch (error) {
    console.error(`${error.message}`);
    process.exit(1);
  }
};
