import mongoose, { Schema, model, models } from "mongoose";

export const HighwaySchema = new Schema(
  {
    id: { type: Number, required: true, unique: true }, // 台1線的編號 40100
    name: String, // 台1線
    routeName: String, // 台北－楓港
    length: Number, // 數字型別
    currentLength: Number,
    start: String,
    currentStart: String,
    end: String,
    currentEnd: String,
    otherName: [String], // 我們把原本逗號隔開的字串變成「陣列」
    highest: Number,
    highestPlace: String,
    remark: String,
    images: [
      {
        url: { type: String, required: true }, // 圖片位址 (例如 /images/t1_01.jpg)
        description: { type: String }, // 圖片描述 (例如 "台1線起點行政院前")
        capturedAt: { type: Date, default: Date.now }, // 選填：拍攝日期
      },
    ],
  },
  { timestamps: true },
);

// 如果 model 已經存在就直接用，不存在就建立一個新的
const Highway = models.Highway || model("Highway", HighwaySchema);
export default Highway;
