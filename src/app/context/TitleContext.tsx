"use client";
import { createContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const pathname = usePathname(); // 取得當前路徑
  const [title, setTitle] = useState(() => {
    if (pathname == "/") {
      return "首頁";
    } else if (pathname == "/highways") {
      return "公路列表";
    } else if (pathname == "/themost") {
      return "公路之最";
    } else if (pathname == "/reference") {
      return "參考資料";
    }
  });

  useEffect(() => {
    console.log("Current Path:", pathname); // 確保 pathname 正常更新
    let newTitle = "首頁";
    if (pathname === "/highways") {
      newTitle = "公路列表";
    } else if (pathname === "/themost") {
      newTitle = "公路之最";
    } else if (pathname === "/reference") {
      newTitle = "參考資料";
    }
    setTitle(newTitle);
    document.title = newTitle; // 立即更新標題
  }, [pathname]);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
