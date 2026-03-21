// src/app/highways/HighwayContentServer.tsx
import { connectToDatabase } from "@/app/_lib/mongodb";
import HighwayModel from "@/models/Highway";
import HighwayContentClient from "@/app/(client)/highways/HighwayContentClient";
import { Highway } from "types/highway";

interface Props {
  params: { highwayId: string };
}

export default async function HighwayContentServer({ params }: Props) {
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
