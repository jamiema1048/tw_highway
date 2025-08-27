// src/app/highways/page.tsx
import fs from "fs/promises";
import path from "path";
import HighwayListClient from "./HighwayListClient";

export default async function HighwayListServer() {
  try {
    // 讀取本地 JSON
    const imagesPath = path.join(process.cwd(), "public", "db_image.json");
    const descPath = path.join(process.cwd(), "public", "db_description.json");

    const [imagesData, descriptionsData] = await Promise.all([
      fs.readFile(imagesPath, "utf-8"),
      fs.readFile(descPath, "utf-8"),
    ]);

    const images: Record<string, string[]> = JSON.parse(imagesData);
    const descriptions: Record<string, string> = JSON.parse(descriptionsData);

    // fetch 公路基本資料
    const res = await fetch("http://localhost:8000/highways");
    if (!res.ok) throw new Error("Failed to fetch highways data");
    const highways = await res.json();

    // 合併資料
    const detailedHighways = highways.map((hwy: any) => ({
      ...hwy,
      images: images[hwy.id] || [],
      description: descriptions[hwy.id] || "",
      currentImageIndex: 0,
    }));

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
