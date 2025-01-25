"use client"; // 確保這個組件在客戶端運行

import { useState, useEffect } from "react";
import Head from "next/head";

const HighwayContent = ({ params }) => {
  const [highwayId, setHighwayId] = useState(null);
  const [title, setTitle] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params && params.highwayId) {
      setHighwayId(params.highwayId); // 從路由參數獲取 highwayId
    }
  }, [params]); // 依賴 params，每次 highwayId 改變時觸發

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
            (hwy) => hwy.id === parseInt(highwayId)
          );

          if (highway) {
            setData(highway); // 如果找到對應的資料，設置 state
            setTitle(`Highway ${highway.name}`);
          } else {
            throw new Error("Highway not found");
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
          <p>長度: {data.length}</p>
          {data.currentLength && <p>通車長度: {data.currentLength}</p>}
          <p>別稱: {data.otherName}</p>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </>
  );
};

export default HighwayContent;
