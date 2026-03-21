import { connectToDatabase } from "@/app/_lib/mongodb";
import Highway from "@/models/Highway";
import HighwayListClient from "@/app/(client)/highways/HighwayListClient";

export default async function HighwayListServer() {
  try {
    // 1. 連線到 MongoDB
    await connectToDatabase();

    // 2. 直接從資料庫抓取所有公路資料
    // .lean() 可以讓回傳的資料變成純 JS 物件，效能更好且方便傳給 Client Component
    const highwaysData = await Highway.find({}).sort({ id: 1 }).lean();

    // 3. 格式化資料（處理 MongoDB 的 _id 與 Date 物件轉為純字串/數字）
    const detailedHighways = highwaysData.map((hwy: any) => ({
      ...hwy,
      _id: hwy._id.toString(), // 把 ObjectId 轉成字串
      // 確保 images 裡的日期也能被 Client Component 讀取
      images: hwy.images.map((img: any) => ({
        ...img,
        _id: img._id?.toString(),
        capturedAt: img.capturedAt
          ? new Date(img.capturedAt).toISOString()
          : null,
      })),
      currentImageIndex: 0, // 為了你的 Client 端切換功能保留
    }));
    console.log(highwaysData);

    // 4. 直接把完整的資料丟給 Client Component
    return <HighwayListClient highways={detailedHighways} />;
  } catch (err) {
    console.error(err);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-4">🚧 發生錯誤</h1>
        <p className="text-lg mb-6">
          無法載入公路資料，可能是伺服器或網路有問題。
        </p>
      </div>
    );
  }
}
