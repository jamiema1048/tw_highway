"use client"; // 確保這個組件在客戶端運行

import { useState, useEffect } from "react";
import Head from "next/head";

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
      // 第一步：獲取所有 highways 的資料
      const fetchAllHighways = async () => {
        try {
          const response = await fetch("http://localhost:8000/highways"); // 從 /highways 獲取所有資料
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const allHighways = await response.json();

          // 第二步：根據 highwayId 查找對應的 highway 資料
          const highway = allHighways.find(
            (hwy) => hwy.id === Number(highwayId)
          );

          if (highway) {
            setData(highway); // 如果找到對應的資料，設置 state
            setTitle(`Highway ${highway.name}`);
          } else {
            setData(null);
            setError(`Highway with ID ${highwayId} does not exist`);
            return;
          }
        } catch (error) {
          setError(error.message); // 設置錯誤訊息
        }
      };

      fetchAllHighways(); // 呼叫獲取資料的函數
    }
  }, [highwayId]); // 當 highwayId 改變時觸發

  if (error) {
    return <h1>Error: {error}</h1>; // 顯示錯誤訊息
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {data ? (
        <div>
          <h1>{data.name}</h1>
          <p>起點: {data.start}</p>
          {data.currentStart && <p>通車起點: {data.currentStart}</p>}
          <p>終點: {data.end}</p>
          {data.currentEnd && <p>通車終點: {data.currentEnd}</p>}
          <p>長度: {data.length} km</p>
          {data.currentLength && <p>通車長度: {data.currentLength} km</p>}
          {data.highest && <p>最高海拔: {data.highest} m</p>}
          {data.highestPlace && <p>最高點: {data.highestPlace}</p>}
          {data.otherName && <p>別稱: {data.otherName}</p>}
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </>
  );
};

export default HighwayContent;
