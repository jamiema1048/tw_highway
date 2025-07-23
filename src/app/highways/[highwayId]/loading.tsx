"use client";
import Head from "next/head";
const Loading = (): JSX.Element => {
  //document.title = "載入中請稍後";
  return (
    <>
      <Head>
        <title>載入中請稍後.....</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen bg-black text-center">
        {/* 旋轉的加載動畫 */}
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-gray-800"></div>

        <p className="text-xl text-white mt-4">Loading data...</p>
      </div>
    </>
  );
};

export default Loading;
