"use client";

import { useState, useRef, MouseEvent, TouchEvent } from "react";
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

  // Touch 手勢觸發 hover
  const handleTouchStart = () => {
    if (touchTimeout) clearTimeout(touchTimeout);
    const timeout = setTimeout(() => {
      setHoveredHighway(highway);
    }, 500);
    setTouchTimeout(timeout);
  };

  const handleTouchEnd = () => {
    if (touchTimeout) clearTimeout(touchTimeout);
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
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHoveredHighway(highway);
    }, 300);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    timeoutRef.current = setTimeout(() => {
      const relatedTarget = event.relatedTarget as HTMLElement | null;
      if (
        relatedTarget &&
        (relatedTarget.closest("a") || relatedTarget.closest(".highway-card"))
      )
        return;
      setHoveredHighway(null);
    }, 300);
  };

  const handleCardMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
          className="absolute bottom-full left-36 transform -translate-x-1/2 mb-4 w-80 p-4 bg-white border border-gray-300 shadow-lg rounded-lg z-50 highway-card"
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
