import mongoose from "mongoose";

export const ObjectId = mongoose.Types.ObjectId;

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "", {});
    console.log("MongoDB connected");
  } catch (e) {
    console.log("DB connection error:", e);
  }
};

export default connectDB;
