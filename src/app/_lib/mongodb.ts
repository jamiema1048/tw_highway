import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("請在 .env.local 中定義 MONGODB_URI");
}
console.log("目前的 URI 是:", process.env.MONGODB_URI);
export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI);
};
