"use client";
import HighwayCard from "./HighwayCard";
import { use, useState, useEffect, useContext, useRef } from "react";
import React from "react";

const Province = ({
  highways,
  setHighways,
  hoveredHighway,
  setHoveredHighway,
  loading,
  setLoading,
  error,
  setError,
}) => {
  const timeoutRef = useRef(null);
  const [isProvinceShow, setIsProvinceShow] = useState(false);
  const [groupedHighways, setGroupedHighways] = useState({});
  const [isProvinceShowXX, setIsProvinceShowXX] = useState(false); //1~20
  const [isProvinceShowC, setIsProvinceShowC] = useState(false); //21~
  useEffect(() => {
    const fetchHighways = async () => {
      setLoading(true); // 確保進入 loading 狀態
      await new Promise((r) => setTimeout(r, 3000)); // 模擬網路延遲
      try {
        // Fetch highways data
        const response = await fetch("http://localhost:8000/highways"); // 替换为你的 API 地址
        if (!response.ok) throw new Error("Failed to fetch highways data");
        const data = await response.json();

        // Fetch images & descriptions
        const [imagesRes, descRes] = await Promise.all([
          fetch("/db_image.json"),
          fetch("/db_description.json"),
        ]);

        if (!imagesRes.ok || !descRes.ok)
          throw new Error("Failed to fetch additional data");

        const [imagesData, descriptionsData] = await Promise.all([
          imagesRes.json(),
          descRes.json(),
        ]);

        // 依序獲取每條公路的詳細資料
        const detailedHighways = await Promise.all(
          data.map(async (highway) => {
            try {
              const highwayId = highway.id;

              // 合併圖片和描述資料
              highway.images = imagesData[highwayId] || []; // 取得圖片
              highway.description = descriptionsData[highwayId] || ""; // 取得描述
              highway.currentImageIndex = 0; // 初始顯示的圖片索引

              return highway; // 返回合併後的資料
            } catch (error) {
              return { ...highway, image: [], description: "" }; // 若請求失敗，避免崩潰
            }
          })
        );

        // 按照 prefix 分組
        const grouped = detailedHighways.reduce((acc, highway) => {
          const prefix = highway.prefix || "其他";
          acc[prefix] = acc[prefix] || [];
          acc[prefix].push(highway);
          return acc;
        }, {});

        setHighways(detailedHighways);
        setGroupedHighways(grouped);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchHighways();
  }, []);

  // 點擊其他地方時關閉字卡
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".highway-card") &&
        !event.target.closest(".highway-link")
      ) {
        setHoveredHighway(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const section420 = highways.filter(
    (highway) => highway.id / 100 >= 400 && highway.id / 100 < 421
  );
  const section440 = highways.filter(
    (highway) => highway.id / 100 >= 421 && highway.id / 100 < 500
  );
  // 分組相同前三碼的 ID
  const groupByPrefix = (section) => {
    const grouped = {};
    section.forEach((highway) => {
      const prefix = Math.floor(highway.id / 100);
      if (!grouped[prefix]) {
        grouped[prefix] = [];
      }
      grouped[prefix].push(highway);
    });
    return grouped;
  };

  const renderGroupedHighways = (groupedHighways) => {
    return Object.entries(groupedHighways).map(([prefix, highways]) => (
      <div key={prefix} className="flex flex-wrap gap-4">
        {highways.map((highway) => (
          <HighwayCard
            key={highway.id}
            highway={highway}
            hoveredHighway={hoveredHighway}
            setHoveredHighway={setHoveredHighway}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
        ))}
      </div>
    ));
  };
  return (
    <>
      {/* 第二區域: 省道 */}
      <div className=" ml-3 md:ml-6 lg:ml-9 mt-4 h-md:mt-6 h-lg:mt-8">
        <h2
          className={`text-4xl font-semibold text-white-700 text-white-600 ${
            isProvinceShow ? "text-yellow-400" : "text-white-600"
          } active:text-yellow-600 cursor-pointer max-w-fit mb-2 h-md:mb-3 h-lg:mb-4 lg:pr-3`}
          onClick={() => setIsProvinceShow((prev) => !prev)}
        >
          省道 {isProvinceShow ? "▲" : "▼"}
        </h2>
        {isProvinceShow ? (
          <>
            <div className="space-y-4 ml-4">
              <h3
                className={`text-2xl ${
                  isProvinceShowXX ? "text-yellow-400" : "text-white-600"
                } active:text-yellow-600 cursor-pointer font-semibold`}
                onClick={() => setIsProvinceShowXX((prev) => !prev)}
              >
                1~20 {isProvinceShowXX ? "▲" : "▼"}
              </h3>
              {isProvinceShowXX ? (
                <>
                  {section420.length > 0 ? (
                    <div className="space-y-4 ml-4">
                      {renderGroupedHighways(groupByPrefix(section420))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No highways found in this range.
                    </p>
                  )}
                </>
              ) : null}
            </div>
            <div className="space-y-4 ml-4">
              <h3
                className={`text-2xl ${
                  isProvinceShowC ? "text-yellow-400" : "text-white-600"
                } active:text-yellow-600 cursor-pointer font-semibold`}
                onClick={() => setIsProvinceShowC((prev) => !prev)}
              >
                21~ {isProvinceShowC ? "▲" : "▼"}
              </h3>
              {isProvinceShowC ? (
                <>
                  {section440.length > 0 ? (
                    <div className="space-y-4 ml-4">
                      {renderGroupedHighways(groupByPrefix(section440))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No highways found in this range.
                    </p>
                  )}
                </>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Province;
