"use client"; // 確保這個組件在客戶端運行

import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const HighwayContent = ({ params }) => {
  const [highwayId, setHighwayId] = useState(null);
  const [title, setTitle] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const unwrappedParams = await params; // 解包 params
        if (unwrappedParams && unwrappedParams.highwayId) {
          console.log("Highway ID from params:", unwrappedParams.highwayId); // 打印 highwayId
          setHighwayId(unwrappedParams.highwayId); // 從解包後的路由參數獲取 highwayId
        }
      } catch (err) {
        setError("Failed to load route parameters.");
      }
    };

    unwrapParams(); // 呼叫解包函數
  }, [params]); // 當 params 改變時觸發

  useEffect(() => {
    if (highwayId) {
      const fetchAllHighways = async () => {
        try {
          const response = await fetch("http://localhost:8000/highways"); // 獲取 highways 資料
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const allHighways = await response.json();

          const highway = allHighways.find(
            (hwy) => hwy.id === Number(highwayId)
          );

          if (!highway) {
            setData(null);
            setError(`Highway with ID ${highwayId} does not exist`);
            return;
          }

          // 讀取 db_images.json
          const imagesResponse = await fetch("/db_image.json");
          if (!imagesResponse.ok)
            throw new Error("Failed to fetch images data");

          const imagesData = await imagesResponse.json();
          highway.images = imagesData[highwayId] || []; // 取得對應的圖片陣列
          console.log("Highway data:", highway); // 🔍 檢查 highway 物件
          console.log("Fetched images:", highway.images); // 🔍 檢查 images 陣列

          // 讀取 db_description.json
          const descriptionsResponse = await fetch("/db_description.json");
          if (!descriptionsResponse.ok)
            throw new Error("Failed to fetch descriptions data");

          const descriptionsData = await descriptionsResponse.json();
          highway.descriptions = descriptionsData[highwayId] || []; // 取得對應的內文陣列
          console.log("Highway data:", highway); // 🔍 檢查 highway 物件
          console.log("Fetched descriptions:", highway.descriptions); // 🔍 檢查 descriptions 陣列

          setData(highway); // ✅ 確保 highway 物件有圖片後再更新 state
          setTitle(`Highway ${highway.name}`);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchAllHighways();
    }
  }, [highwayId]);

  if (error) {
    return <h1>Error: {error}</h1>; // 顯示錯誤訊息
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {data ? (
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-semibold text-white-800 text-center">
            {data.name}
          </h1>

          <section className="route-info bg-black-100 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">路線資料</h2>
            <p>
              <strong>路線名稱:</strong> {data.routeName}
            </p>
            <p>
              <strong>起點:</strong> {data.start}
            </p>
            {data.currentStart && (
              <p>
                <strong>通車起點:</strong> {data.currentStart}
              </p>
            )}
            <p>
              <strong>終點:</strong> {data.end}
            </p>
            {data.currentEnd && (
              <p>
                <strong>通車終點:</strong> {data.currentEnd}
              </p>
            )}
            <p>
              <strong>長度:</strong> {data.length} km
            </p>
            {data.currentLength && (
              <p>
                <strong>通車長度:</strong> {data.currentLength} km
              </p>
            )}
            {data.highest && (
              <p>
                <strong>最高海拔:</strong> {data.highest} m
              </p>
            )}
            {data.highestPlace && (
              <p>
                <strong>最高點:</strong> {data.highestPlace}
              </p>
            )}
            {data.otherName && (
              <p>
                <strong>別稱:</strong> {data.otherName}
              </p>
            )}
            {data.remark && (
              <p>
                <strong>備註:</strong> {data.remark}
              </p>
            )}
          </section>

          <section className="media-gallery mt-12">
            <h2 className="text-2xl font-semibold mb-4">
              Images and Descriptions
            </h2>
            {data.images && data.descriptions && (
              <div className="grid md:grid-cols-2 gap-8">
                {data.images.map((image, index) => (
                  <div key={index} className="media-item">
                    <div className="image-container overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={`Highway ${data.name} - ${index}`}
                        width={800}
                        height={600}
                        layout="responsive"
                        className="rounded-lg"
                      />
                    </div>
                    {data.descriptions[index] && (
                      <p className="mt-4 text-lg">{data.descriptions[index]}</p>
                    )}
                  </div>
                ))}

                {/* Display additional descriptions if there are more descriptions than images */}
                {data.descriptions.length > data.images.length &&
                  data.descriptions
                    .slice(data.images.length)
                    .map((desc, index) => (
                      <p key={`desc-${index}`} className="mt-4 text-lg">
                        {desc}
                      </p>
                    ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="loading-container flex items-center justify-center">
          {/* Tailwind spinner */}
          <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-gray-800"></div>
          <span className="ml-2 text-xl">Loading data...</span>
        </div>
      )}
      <Link href="/highways" className="text-lg text-blue-500 hover:underline">
        Highway List
      </Link>
    </>
  );
};

export default HighwayContent;
