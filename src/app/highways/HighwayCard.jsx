import { useState, useRef } from "react";
import Link from "next/link";

const HighwayCard = ({
  highway,
  hoveredHighway,
  setHoveredHighway,
  loading,
  setLoading,
  error,
  setError,
}) => {
  const timeoutRef = useRef(null);
  let mutex = Promise.resolve();

  // 處理手機長按
  const handleTouchStart = (highway) => {
    if (touchTimeout) clearTimeout(touchTimeout);
    const timeout = setTimeout(() => {
      setHoveredHighway(highway);
    }, 500); // 0.5秒後才觸發，避免短按立即觸發
    setTouchTimeout(timeout);
  };

  // 取消長按事件（短按無效）
  const handleTouchEnd = () => {
    if (touchTimeout) clearTimeout(touchTimeout);
  };

  // 這部分可以忽略，專注於字卡和圖片切換邏輯
  const handleNextImage = () => {
    if (
      hoveredHighway &&
      hoveredHighway.images &&
      hoveredHighway.currentImageIndex < hoveredHighway.images.length - 1
    ) {
      setHoveredHighway((prev) => ({
        ...prev,
        currentImageIndex: prev.currentImageIndex + 1,
      }));
    }
  };

  const handlePrevImage = () => {
    if (hoveredHighway && hoveredHighway.currentImageIndex > 0) {
      setHoveredHighway((prev) => ({
        ...prev,
        currentImageIndex: prev.currentImageIndex - 1,
      }));
    }
  };
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // async function writeCard() {
    //   // 只有當 hoveredHighway 不同時才更新狀態，避免不必要的重渲染
    //   if (!hoveredHighway || hoveredHighway.id !== highway.id) {
    //     await Promise.all([setHoveredHighway(highway)]);
    //   }
    // }
    // writeCard();
    timeoutRef.current = setTimeout(() => {
      // 只有當 hoveredHighway 不同時才更新狀態，避免不必要的重渲染
      if (!hoveredHighway || hoveredHighway.id !== highway.id) {
        setHoveredHighway(highway);
      }
    }, 300);
  };

  const handleMouseLeave = (event) => {
    timeoutRef.current = setTimeout(() => {
      // 如果滑鼠進入其他 Link，則不關閉字卡
      const relatedTarget = event.relatedTarget;
      if (
        relatedTarget &&
        (relatedTarget.closest("a") || relatedTarget.closest(".highway-card"))
      ) {
        return;
      }

      async function clearCard() {
        await Promise.all([setHoveredHighway(null)]);
      }
      clearCard();
    }, 300);
  };

  const handleCardMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleCardMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredHighway(null);
    }, 300);
  };

  return (
    <h3 className="relative text-xl">
      <Link
        href={`highways/${highway.id}`}
        className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {highway.remark && highway.remark.includes("解編")
          ? `${highway.name}  (已解編)`
          : highway.remark && highway.remark.includes("未納編")
          ? `${highway.name}  (未納編)`
          : highway.name}
      </Link>

      {hoveredHighway?.id === highway.id && (
        <div
          className="absolute bottom-full left-36 transform -translate-x-1/2 mb-4 w-80 p-4 bg-white border border-gray-300 shadow-lg rounded-lg z-50 highway-card"
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        >
          {/* 如果有多張圖片 */}
          {hoveredHighway.images && hoveredHighway.images.length > 1 ? (
            <div className="relative">
              {/* 顯示圖片 */}
              <img
                src={hoveredHighway.images[hoveredHighway.currentImageIndex]}
                alt={hoveredHighway.name}
                className="w-full h-48 object-cover rounded-md"
                style={{ objectPosition: "center" }} // 設置圖片顯示中間部分
              />

              {/* 只有當圖片索引大於0時，顯示上一張按鈕 */}
              <button
                className={`absolute top-1/2 left-0 transform ${
                  hoveredHighway.currentImageIndex > 0 ? "block" : "hidden"
                } -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10`}
                onClick={handlePrevImage}
                disabled={hoveredHighway.currentImageIndex <= 0}
              >
                ◀
              </button>

              {/* 只有當圖片索引小於圖片數量減一時，顯示下一張按鈕 */}
              <button
                className={`absolute top-1/2 right-0 transform ${
                  hoveredHighway.currentImageIndex <
                  hoveredHighway.images.length - 1
                    ? "block"
                    : "hidden"
                } -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10`}
                onClick={handleNextImage}
                disabled={
                  hoveredHighway.currentImageIndex >=
                  hoveredHighway.images.length - 1
                }
              >
                ▶
              </button>
            </div>
          ) : hoveredHighway.images && hoveredHighway.images.length === 1 ? (
            // 單張圖片顯示
            <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-md">
              <img
                src={hoveredHighway.images[0]}
                alt={hoveredHighway.name}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          ) : (
            // 無圖片顯示
            <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-md">
              <span className="text-gray-500">No image to show</span>
            </div>
          )}
          {hoveredHighway.images && hoveredHighway.images.length > 0 ? (
            <p className="text-sm text-black font-semibold mt-2">
              {hoveredHighway.currentImageIndex + 1}/
              {hoveredHighway.images.length}
            </p>
          ) : (
            <></>
          )}
          <p className="text-sm text-black font-semibold mt-2">
            {highway.name}
          </p>
          <p className="text-sm text-black font-semibold mt-1">
            {highway.routeName}
          </p>
        </div>
      )}
    </h3>
  );
};

export default HighwayCard;
