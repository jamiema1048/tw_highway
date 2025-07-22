"use client";
import { useEffect } from "react";
import Head from "next/head";
const NotFound = () => {
  const handleToListClick = () => {
    window.location.href = "/highways";
  };
  const handleToHomeClick = () => {
    window.location.href = "/";
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/highways";
    }, 5000); // 5 秒後自動導向 /highways
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Head>
        <title>無法顯示</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen bg-black text-center">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="text-xl text-white mt-4">
          哇哩嘞!!!!!你找的公路資料不存在，5秒內導回公路列表
        </p>
        <div className="container mx-auto mt-4 flex flex-row place-content-center">
          <button
            onClick={handleToListClick}
            className="text-lg m-4 bg-green-500 text-white p-4 rounded hover:bg-green-600 flex flex-row"
          >
            <span>公路列表</span>
          </button>
          <button
            onClick={handleToHomeClick}
            className="text-lg m-4 bg-green-500 text-white p-4 rounded hover:bg-green-600 flex flex-row"
          >
            <span>首頁</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
