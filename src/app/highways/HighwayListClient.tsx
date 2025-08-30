"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { TitleContext } from "../context/TitleContext";
import Province from "./Province";
import County from "./County";
import Footer from "../footer/footer";
import Loading from "./loading";
import { Highway } from "types/highway";

interface Props {
  highways: Highway[];
  hoveredHighway: Highway | null;
  setHoveredHighway: (hwy: Highway | null) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
}

export default function HighwayListClient({ highways }: Props) {
  const [loading, setLoading] = useState(false);
  const [hoveredHighway, setHoveredHighway] = useState<Highway | null>(null);
  const { title } = useContext(TitleContext);

  // 點擊其他地方時關閉字卡
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".highway-card") &&
        !target.closest(".highway-link")
      ) {
        setHoveredHighway(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1
        role="heading"
        className="text-4xl font-bold text-white text-center my-8"
      >
        公路列表
      </h1>
      <div className="pl-1 md:pl-3 lg:pl-5">
        <Province
          hoveredHighway={hoveredHighway}
          setHoveredHighway={setHoveredHighway}
          highways={highways}
          loading={loading}
          setLoading={setLoading}
        />
        <County
          hoveredHighway={hoveredHighway}
          setHoveredHighway={setHoveredHighway}
          highways={highways}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
      <Footer />
    </div>
  );
}
