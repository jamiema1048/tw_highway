// src/app/highways/HighwayContentServer.tsx
import path from "path";
import fs from "fs/promises";
import HighwayContentClient from "./HighwayContentClient";
import { Highway } from "types/highway";

interface Props {
  params: { highwayId: string };
}

export default async function HighwayContentServer({ params }: Props) {
  try {
    const highwayId = params.highwayId;

    // 取得所有 highways
    const res = await fetch("http://localhost:8000/highways");
    if (!res.ok) throw new Error("Failed to fetch highways data");
    const allHighways: Highway[] = await res.json();

    const highway = allHighways.find((h) => Number(h.id) === Number(highwayId));

    if (!highway) return <div>Highway not found</div>;

    // 讀取本地 JSON（fs）
    const imagesPath = path.join(process.cwd(), "public/db_image.json");
    const descPath = path.join(process.cwd(), "public/db_description.json");

    const [imagesData, descriptionsData] = await Promise.all([
      fs.readFile(imagesPath, "utf-8"),
      fs.readFile(descPath, "utf-8"),
    ]);

    const imagesJson: Record<string, string[]> = JSON.parse(imagesData);
    const descJson: Record<string, string[]> = JSON.parse(descriptionsData);

    highway.images = imagesJson[highwayId] || [];
    highway.descriptions = descJson[highwayId] || [];

    return <HighwayContentClient highway={highway} />;
  } catch (err) {
    console.error(err);
    return <div className="text-red-500">無法載入資料</div>;
  }
}
