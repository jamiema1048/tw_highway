"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

// 定義 Context 的型別
interface TitleContextType {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

// 提供預設值，TS 需要初始型別對應
export const TitleContext = createContext<TitleContextType>({
  title: "首頁",
  setTitle: () => {},
});

// 定義 props 型別
interface TitleProviderProps {
  children: ReactNode;
}

export const TitleProvider: React.FC<TitleProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const [title, setTitle] = useState<string>(() => {
    switch (pathname) {
      case "/highways":
        return "公路列表";
      case "/themost":
        return "公路之最";
      case "/reference":
        return "參考資料";
      default:
        return "首頁";
    }
  });

  useEffect(() => {
    let newTitle = "首頁";
    switch (pathname) {
      case "/highways":
        newTitle = "公路列表";
        break;
      case "/themost":
        newTitle = "公路之最";
        break;
      case "/reference":
        newTitle = "參考資料";
        break;
    }
    setTitle(newTitle);
    document.title = newTitle;
  }, [pathname]);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
