import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  if (mongoose.connections?.[0].readyState) {
    return;
  }

  try {
    const connection = await mongoose.connect(
      process.env.NEXT_PUBLIC_MONGODB_URI!
    );
    if (connection) {
      console.log("Successfully connected to database");
    }
  } catch (error) {
    console.log(error);
  }
};
connectToDB();
