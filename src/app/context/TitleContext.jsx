"use client";
import { createContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState("首頁");
  const pathname = usePathname(); // 取得當前路徑

  useEffect(() => {
    if (pathname === "/") {
      setTitle("首頁"); // 根目錄時顯示固定標題
    } else if (pathname === "/highways") {
      setTitle("公路列表"); // 根目錄時顯示固定標題
    }
  }, [pathname]);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
