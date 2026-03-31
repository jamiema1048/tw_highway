// src/app/highways/HighwayContentServer.tsx
export const dynamic = "force-dynamic";
import mongoose, { Schema, model, models } from "mongoose";
import { connectToDatabase } from "@/app/_lib/mongodb";
import HighwayModel from "@/models/Highway";
import HighwayContentClient from "@/app/(client)/highways/HighwayContentClient";
import { Metadata } from "next";
import { Highway } from "@/types/highway";
import { HighwaySchema } from "@/models/Highway";

type PageParams = Promise<{ highwayId: string }>;

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  try {
    const { highwayId } = await params;

    // 1. 執行連線（確保連線已建立，不需要承接回傳值也可以）
    await connectToDatabase();

    // 2. 直接從 mongoose.models 或是 mongoose.model 取得
    // 因為是單一連線模式，Model 會被註冊在全域的 mongoose 實例中
    const HighwayModel =
      mongoose.models.Highway || mongoose.model("Highway", HighwaySchema);

    // 1. 抓取公路資料
    const highwayData = await HighwayModel.findOne({ id: highwayId }).lean();
    if (!highwayData) return { title: "找不到公路資料" };

    // 2. 處理陣列與顯示文字
    const otherNames =
      highwayData.otherName?.length > 0
        ? `（${highwayData.otherName.join("、")}）`
        : "";

    // 3. 動態建構標題 (Title)
    // 格式：台1線：台北－楓港 | 公路沿革與里程資訊
    // 如果有最高點資訊，標題會更吸引路迷點擊
    const highestInfo = highwayData.highestPlace
      ? ` | 最高點：${highwayData.highestPlace}`
      : "";
    const title = `${highwayData.name}${otherNames}：${highwayData.routeName}${highestInfo} | 公路資料庫`;

    // 4. 動態建構描述 (Description)
    // 描述中加入里程、起訖點，這對搜尋「台X線 長度」的人非常有幫助
    const description =
      `${highwayData.name}${highwayData.routeName}完整紀錄。` +
      `起點：${highwayData.currentStart || highwayData.start}，` +
      `終點：${highwayData.currentEnd || highwayData.end}。` +
      `全長約 ${highwayData.currentLength || highwayData.length} 公里。` +
      `收錄公路沿革、${highwayData.highestPlace ? "最高點位置及" : ""}實地探查紀錄照片。`;

    // 5. 動態建構關鍵字 (Keywords)
    const keywords = [
      highwayData.name,
      highwayData.routeName,
      "公路沿革",
      "公路紀錄",
      "里程資訊",
      "台灣公路",
      ...(highwayData.otherName || []),
      highwayData.highestPlace,
    ].filter(Boolean);
    console.log(title, description, keywords);

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: "article",
        // 抓取第一張公路風景圖作為分享圖
        images: highwayData.images?.[0]?.url
          ? [{ url: highwayData.images[0].url }]
          : [],
      },
    };
  } catch (error) {
    console.error("Highway Metadata error:", error);
    return { title: "公路資料載入錯誤" };
  }
}

export default async function HighwayContentServer({
  params,
}: {
  params: PageParams;
}) {
  try {
    const resolvedParams = await params;
    const highwayId = resolvedParams.highwayId;

    // 1. 連線資料庫
    await connectToDatabase();

    // 2. 精準查詢：只抓取這一個 ID 的資料
    // .lean() 會回傳純 JS 物件，效能更好
    const highwayData = await HighwayModel.findOne({
      id: Number(highwayId),
    }).lean();

    if (!highwayData) {
      return (
        <div className="p-10 text-center">找不到公路編號：{highwayId}</div>
      );
    }
    // 3. 序列化處理 (Serialization)
    // Next.js 不允許直接傳遞 MongoDB 的 ObjectId 或 Date 物件給 Client Component
    const serializedHighway = {
      ...highwayData,
      _id: highwayData._id.toString(),
      images: highwayData.images.map((img: any) => ({
        ...img,
        _id: img._id?.toString(),
        capturedAt: img.capturedAt
          ? new Date(img.capturedAt).toISOString()
          : null,
      })),
    };

    // 4. 將單一公路資料傳給 Client 渲染
    return <HighwayContentClient highway={serializedHighway} />;
  } catch (err) {
    console.error("載入公路頁面失敗:", err);
    return (
      <div className="text-red-500 p-10">
        無法載入公路資料，請檢查資料庫連線。
      </div>
    );
  }
}
