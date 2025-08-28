"use client";

import { useState, useRef, MouseEvent, TouchEvent, useEffect } from "react";
import Link from "next/link";
import { Highway } from "types/highway";

interface Props {
  highway: Highway;
  hoveredHighway: Highway | null;
  setHoveredHighway: (hwy: Highway | null) => void;
}

export default function HighwayCard({
  highway,
  hoveredHighway,
  setHoveredHighway,
}: Props) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [touchTimeout, setTouchTimeout] = useState<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<"top" | "bottom">("top"); // 👈 新增 state
  const [visible, setVisible] = useState(false);
  const positionSetRef = useRef(false);

  // 當 hover 變化時，決定字卡位置並控制顯示
  useEffect(() => {
    if (hoveredHighway?.id === highway.id && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      console.log(rect.top);

      // 左右超界處理
      if (rect.right > window.innerWidth) {
        cardRef.current.style.left = "auto";
        cardRef.current.style.right = "0";
        cardRef.current.style.transform = "none";
      }
      if (rect.left < 0) {
        cardRef.current.style.left = "0";
        cardRef.current.style.transform = "none";
      }

      // 上下超界處理
      // ✅ 只在 position 尚未設定時決定
      if (!positionSetRef.current) {
        if (rect.top < 0) {
          setPosition("bottom");
        } else if (rect.bottom > window.innerHeight) {
          setPosition("top");
        } else {
          setPosition("top");
        }
        positionSetRef.current = true; // 標記已經決定過
      }

      // 下一幀才顯示 → 避免先出現錯位
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      positionSetRef.current = false; // hover 結束時重置
    }
  }, [hoveredHighway]);

  // Touch 手勢觸發 hover
  const handleTouchStart = () => {
    if (touchTimeout) clearTimeout(touchTimeout);
    const timeout = setTimeout(() => {
      setHoveredHighway(highway);
    }, 500);
    setTouchTimeout(timeout);
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredHighway((prev) => (prev?.id === highway.id ? null : prev)); // ✅ 防止 A 關掉 B
  };

  // 切換圖片
  const handleNextImage = () => {
    if (
      hoveredHighway?.images &&
      hoveredHighway.currentImageIndex! < hoveredHighway.images.length - 1
    ) {
      setHoveredHighway({
        ...hoveredHighway,
        currentImageIndex: (hoveredHighway.currentImageIndex || 0) + 1,
      });
    }
  };

  const handlePrevImage = () => {
    if (hoveredHighway && (hoveredHighway.currentImageIndex || 0) > 0) {
      setHoveredHighway({
        ...hoveredHighway,
        currentImageIndex: (hoveredHighway.currentImageIndex || 0) - 1,
      });
    }
  };

  // Mouse hover
  // 顯示 tooltip
  const showCard = (hwy: Highway) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // ✅ 取消舊的 hide
    setHoveredHighway(hwy);
  };

  // 延遲隱藏 tooltip
  const hideCard = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // ✅ 確保不疊加
    console.log(highway.id);
    timeoutRef.current = setTimeout(() => {
      setHoveredHighway((prev) => (prev?.id === highway.id ? null : prev)); // ✅ 防止 A 關掉 B
    }, 300);
  };

  // 連結 hover
  const handleMouseEnter = () => showCard(highway);
  const handleMouseLeave = () => hideCard();

  // tooltip hover
  const handleCardMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
  const handleCardMouseLeave = () => hideCard();

  return (
    <h3 className="relative text-xl">
      <Link
        href={`highways/${highway.id}`}
        className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 highway-link"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {highway.remark?.includes("解編")
          ? `${highway.name} (已解編)`
          : highway.remark?.includes("未納編")
          ? `${highway.name} (未納編)`
          : highway.name}
      </Link>

      {hoveredHighway?.id === highway.id && (
        <div
          ref={cardRef}
          className={`absolute transition-opacity duration-150 ${
            visible ? "opacity-100" : "opacity-0"
          } ${
            position === "top" ? "bottom-full mb-4" : "top-full mt-4"
          } w-80 p-4 bg-white border border-gray-300 shadow-lg rounded-lg z-50 highway-card`}
          style={{
            left: "50%",
            transform: "translateX(-50%)",
          }}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        >
          {/* 圖片展示 */}
          {hoveredHighway.images?.length ? (
            <div className="relative">
              <img
                src={
                  hoveredHighway.images[hoveredHighway.currentImageIndex || 0]
                }
                alt={hoveredHighway.name}
                className="w-full h-48 object-cover rounded-md"
              />

              {hoveredHighway.images.length > 1 && (
                <>
                  <button
                    className={`absolute top-1/2 left-0 transform ${
                      hoveredHighway.currentImageIndex > 0 ? "block" : "hidden"
                    } -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10`}
                    onClick={handlePrevImage}
                    disabled={(hoveredHighway.currentImageIndex || 0) <= 0}
                  >
                    ◀
                  </button>

                  <button
                    className={`absolute top-1/2 right-0 transform ${
                      hoveredHighway.currentImageIndex <
                      hoveredHighway.images.length - 1
                        ? "block"
                        : "hidden"
                    } -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10`}
                    onClick={handleNextImage}
                    disabled={
                      (hoveredHighway.currentImageIndex || 0) >=
                      hoveredHighway.images.length - 1
                    }
                  >
                    ▶
                  </button>
                </>
              )}

              <p className="text-sm text-black font-semibold mt-2">
                {(hoveredHighway.currentImageIndex || 0) + 1}/
                {hoveredHighway.images.length}
              </p>
            </div>
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-md">
              <span className="text-gray-500">No image to show</span>
            </div>
          )}

          <p className="text-sm text-black font-semibold mt-2">
            {highway.name}
          </p>
          {highway.routeName && (
            <p className="text-sm text-black font-semibold mt-1">
              {highway.routeName}
            </p>
          )}
        </div>
      )}
    </h3>
  );
}
