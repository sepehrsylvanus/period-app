import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }
  if (mongoose.connections.length > 0) {
    const connectionState = mongoose.connections[0].readyState;
    if (connectionState === 1) {
      console.log("MongoDB already connected");
      isConnected = true;
      return;
    }
    await mongoose.disconnect();
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    if (connection) {
      console.log("Successfully connected to database");
    }
  } catch (error) {
    console.log(error);
  }
};
