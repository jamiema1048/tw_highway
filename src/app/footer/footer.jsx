"use client";
import React from "react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname(); // 取得當前路徑
  const handleToListClick = () => {
    window.location.href = "/highways";
  };
  const handleToTheMostClick = () => {
    window.location.href = "/themost";
  };
  const handleToReferenceClick = () => {
    window.location.href = "/reference";
  };
  const handleToHomeClick = () => {
    window.location.href = "/";
  };
  return (
    <footer className="flex flex-col gap-6 flex-wrap items-center justify-center">
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        {pathname !== "/" && (
          <div className="container mx-auto mt-4 flex flex-row place-content-center">
            <button
              onClick={handleToHomeClick}
              className="text-lg m-4 bg-green-500 text-white hover:text-yellow-300 active:text-yellow-600 p-4 rounded hover:bg-green-600 active:bg-green-800 active:shadow-green-400 active:shadow-md flex flex-row"
            >
              <span>首頁</span>
            </button>
            {pathname !== "/highways" && (
              <button
                onClick={handleToListClick}
                className="text-lg m-4 bg-green-500 text-white hover:text-yellow-300 active:text-yellow-600 p-4 rounded hover:bg-green-600 active:bg-green-800 active:shadow-green-400 active:shadow-md flex flex-row"
              >
                <span>公路列表</span>
              </button>
            )}
            {pathname !== "/themost" && (
              <button
                onClick={handleToTheMostClick}
                className="text-lg m-4 bg-green-500 text-white hover:text-yellow-300 active:text-yellow-600 p-4 rounded hover:bg-green-600 active:bg-green-800 active:shadow-green-400 active:shadow-md flex flex-row"
              >
                <span>公路之最</span>
              </button>
            )}
            {pathname !== "/reference" && (
              <button
                onClick={handleToReferenceClick}
                className="text-lg m-4 bg-green-500 text-white hover:text-yellow-300 active:text-yellow-600 p-4 rounded hover:bg-green-600 active:bg-green-800 active:shadow-green-400 active:shadow-md flex flex-row"
              >
                <span>參考資料</span>
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-white text-center my-8">
          Edit by Vincent Ma
        </h2>
        <h3 className="text-lg font-bold text-white text-center my-8">
          01.22.2025
        </h3>
      </div>
    </footer>
  );
};

export default Footer;
