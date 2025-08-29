"use client";

import {
  useRef,
  useState,
  useLayoutEffect,
  MouseEvent,
  TouchEvent,
} from "react";
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
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // 存 trigger（連結）的 bounding rect（在 mouseenter/touchstart 時抓）
  const triggerRectRef = useRef<DOMRect | null>(null);

  const [visible, setVisible] = useState(false);
  const [positionSet, setPositionSet] = useState(false); // 是否已為本次 hover 決定位置
  const [stylePos, setStylePos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // -------------- helpers --------------
  const clearTimeoutRef = (
    ref: React.MutableRefObject<NodeJS.Timeout | null>
  ) => {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  };

  // 顯示（由 mouseenter 呼叫）
  const showCard = () => {
    clearTimeoutRef(timeoutRef);
    setHoveredHighway(highway);
    setVisible(false); // 先不顯示，等位置計算完再顯示
    setPositionSet(false);
    // triggerRectRef 已由 handleMouseEnter 塞好
  };

  // 延遲隱藏（由 mouseleave 呼叫）
  const hideCard = () => {
    clearTimeoutRef(timeoutRef);
    timeoutRef.current = setTimeout(() => {
      // 防止舊 timeout 關掉別人的卡（functional set + id check）
      setHoveredHighway((prev) => (prev?.id === highway.id ? null : prev));
      setVisible(false);
      triggerRectRef.current = null;
      setPositionSet(false);
      setStylePos(null);
    }, 300);
  };

  // --------------- measure & position ---------------
  // 用 useLayoutEffect 確保在 DOM layout 階段處理，並用 requestAnimationFrame 作保險
  useLayoutEffect(() => {
    if (
      hoveredHighway?.id === highway.id &&
      cardRef.current &&
      triggerRectRef.current
    ) {
      // 計算要放哪裡：以 triggerRect + card 的實際尺寸計算
      requestAnimationFrame(() => {
        if (!cardRef.current || !triggerRectRef.current) return;

        const cardH = cardRef.current.offsetHeight;
        const cardW = cardRef.current.offsetWidth;
        const linkRect = triggerRectRef.current!;
        const margin = 8;

        // 優先把卡放在上方（preference），但若超上緣就放下方
        const topIfAbove = linkRect.top - cardH - margin;
        const topIfBelow = linkRect.bottom + margin;

        const willBeTop = topIfAbove >= 0; // 如果上方足夠空間則上方
        const finalTop = willBeTop ? topIfAbove : topIfBelow;

        // 水平置中，並防止左右溢出
        let left = linkRect.left + linkRect.width / 2 - cardW / 2;
        const minLeft = 8;
        const maxLeft = window.innerWidth - cardW - 8;
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        // 設 style（使用 fixed，以 viewport 為基準）
        setStylePos({ top: Math.round(finalTop), left: Math.round(left) });
        setPositionSet(true);

        // 再下一幀顯示（避免先顯示再 reposition）
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      // hover 結束或資料不齊，隱藏並重置
      setVisible(false);
      setPositionSet(false);
      setStylePos(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredHighway]); // 本 effect 在 hoveredHighway 改變時執行

  // --------------- mouse / touch handlers ---------------
  const handleMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    clearTimeoutRef(timeoutRef);
    // 立刻記錄 trigger 的 rect（基準）
    triggerRectRef.current = (
      e.currentTarget as HTMLElement
    ).getBoundingClientRect();
    showCard();
  };

  const handleMouseLeave = () => {
    hideCard();
  };

  const handleCardMouseEnter = () => {
    // 進入卡片則取消 hide timeout（保持顯示）
    clearTimeoutRef(timeoutRef);
  };
  const handleCardMouseLeave = () => {
    hideCard();
  };

  const handleTouchStart = (e: TouchEvent<HTMLAnchorElement>) => {
    clearTimeoutRef(touchTimeoutRef);
    // touch 也記錄 trigger rect（使用 currentTarget）
    triggerRectRef.current = (
      e.currentTarget as HTMLElement
    ).getBoundingClientRect();
    touchTimeoutRef.current = setTimeout(() => {
      showCard();
    }, 500);
  };
  const handleTouchEnd = () => {
    clearTimeoutRef(touchTimeoutRef);
    // 立即清掉（或你也可以延遲）
    setHoveredHighway((prev) => (prev?.id === highway.id ? null : prev));
    setVisible(false);
    triggerRectRef.current = null;
    setPositionSet(false);
    setStylePos(null);
  };

  // --------------- image nav (unchanged) ---------------
  const handleNextImage = () => {
    if (
      hoveredHighway?.images &&
      (hoveredHighway.currentImageIndex || 0) < hoveredHighway.images.length - 1
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

  // --------------- render ---------------
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
          // 使用 fixed 並用 stylePos 控制位置（確保 position 以 viewport 為基準）
          style={{
            position: "fixed",
            top: stylePos ? `${stylePos.top}px` : "-9999px",
            left: stylePos ? `${stylePos.left}px` : "-9999px",
            width: "20rem",
            zIndex: 9999,
            transition: "opacity 150ms",
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? "auto" : "none",
          }}
          className="p-4 bg-white border border-gray-300 shadow-lg rounded-lg highway-card"
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
                      (hoveredHighway.currentImageIndex || 0) > 0
                        ? "block"
                        : "hidden"
                    } -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10`}
                    onClick={handlePrevImage}
                    disabled={(hoveredHighway.currentImageIndex || 0) <= 0}
                  >
                    ◀
                  </button>

                  <button
                    className={`absolute top-1/2 right-0 transform ${
                      (hoveredHighway.currentImageIndex || 0) <
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
