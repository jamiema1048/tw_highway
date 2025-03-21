"use client";
import HighwayCard from "./HighwayCard";
import { use, useState, useEffect, useContext, useRef } from "react";
const County = () => {
  const [highways, setHighways] = useState([]);
  const timeoutRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCountyShow, setIsCountyShow] = useState(false);
  const [hoveredHighway, setHoveredHighway] = useState(null);
  const [groupedHighways, setGroupedHighways] = useState({});
  const [isCountyShowCXX, setIsCountyShowCXX] = useState(false); //101~120
  const [isCountyShowCXL, setIsCountyShowCXL] = useState(false); //121~140
  const [isCountyShowCLX, setIsCountyShowCLX] = useState(false); //141~160
  const [isCountyShowCLXXX, setIsCountyShowCLXXX] = useState(false); //161~180
  const [isCountyShowCC, setIsCountyShowCC] = useState(false); //181~200
  const [isCountyShowCCXX, setIsCountyShowCCXX] = useState(false); //201~220
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

  // 新分區資料
  const section120 = highways.filter(
    (highway) => highway.id / 100 >= 100 && highway.id / 100 < 121
  );
  const section140 = highways.filter(
    (highway) => highway.id / 100 >= 121 && highway.id / 100 < 141
  );
  const section160 = highways.filter(
    (highway) => highway.id / 100 >= 141 && highway.id / 100 < 161
  );
  const section180 = highways.filter(
    (highway) => highway.id / 100 >= 161 && highway.id / 100 < 181
  );
  const section200 = highways.filter(
    (highway) => highway.id / 100 >= 181 && highway.id / 100 < 201
  );
  const section220 = highways.filter(
    (highway) => highway.id / 100 >= 201 && highway.id / 100 < 220
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
          />
        ))}
      </div>
    ));
  };
  return (
    <>
      {/* 第一區域: 縣市道 */}
      <div className="ml-3 md:ml-6 lg:ml-9 mt-4 h-md:mt-6 h-lg:mt-8">
        <h2
          className={`text-4xl font-semibold text-white-700 text-white-600 ${
            isCountyShow ? "text-yellow-400" : "text-white-600"
          } active:text-yellow-600 cursor-pointer max-w-fit mb-2 h-md:mb-3 h-lg:mb-4 lg:pr-3`}
          onClick={() => setIsCountyShow((prev) => !prev)}
        >
          縣市道 {isCountyShow ? "▲" : "▼"}
        </h2>

        {isCountyShow ? (
          <>
            <div className="space-y-4 ml-4">
              <h3
                className={`text-2xl ${
                  isCountyShowCXX ? "text-yellow-400" : "text-white-600"
                } active:text-yellow-600 cursor-pointer font-semibold`}
                onClick={() => setIsCountyShowCXX((prev) => !prev)}
              >
                101~120 {isCountyShowCXX ? "▲" : "▼"}
              </h3>
              {isCountyShowCXX ? (
                <>
                  {section120.length > 0 ? (
                    <div className="space-y-4 ml-4">
                      {renderGroupedHighways(groupByPrefix(section120))}
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
                  isCountyShowCXL ? "text-yellow-400" : "text-white-600"
                } active:text-yellow-600 cursor-pointer font-semibold`}
                onClick={() => setIsCountyShowCXL((prev) => !prev)}
              >
                121~140 {isCountyShowCXL ? "▲" : "▼"}
              </h3>
              {isCountyShowCXL ? (
                section140.length > 0 ? (
                  <div className="space-y-4 ml-4">
                    {renderGroupedHighways(groupByPrefix(section140))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No highways found in this range.
                  </p>
                )
              ) : null}
            </div>
            <div className="space-y-4 ml-4">
              <h3
                className={`text-2xl ${
                  isCountyShowCLX ? "text-yellow-400" : "text-white-600"
                } active:text-yellow-600 cursor-pointer font-semibold`}
                onClick={() => setIsCountyShowCLX((prev) => !prev)}
              >
                141~160 {isCountyShowCLX ? "▲" : "▼"}
              </h3>
              {isCountyShowCLX ? (
                section160.length > 0 ? (
                  <div className="space-y-4 ml-4">
                    {renderGroupedHighways(groupByPrefix(section160))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No highways found in this range.
                  </p>
                )
              ) : null}
            </div>
            <div className="space-y-4 ml-4">
              <h3
                className={`text-2xl ${
                  isCountyShowCLXXX ? "text-yellow-400" : "text-white-600"
                } active:text-yellow-600 cursor-pointer font-semibold`}
                onClick={() => setIsCountyShowCLXXX((prev) => !prev)}
              >
                161~180 {isCountyShowCLXXX ? "▲" : "▼"}
              </h3>
              {isCountyShowCLXXX ? (
                section180.length > 0 ? (
                  <div className="space-y-4 ml-4">
                    {renderGroupedHighways(groupByPrefix(section180))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No highways found in this range.
                  </p>
                )
              ) : null}
            </div>
            <div className="space-y-4 ml-4">
              <h3
                className={`text-2xl ${
                  isCountyShowCC ? "text-yellow-400" : "text-white-600"
                } active:text-yellow-600 cursor-pointer font-semibold`}
                onClick={() => setIsCountyShowCC((prev) => !prev)}
              >
                181~200 {isCountyShowCC ? "▲" : "▼"}
              </h3>
              {isCountyShowCC ? (
                section200.length > 0 ? (
                  <div className="space-y-4 ml-4">
                    {renderGroupedHighways(groupByPrefix(section200))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No highways found in this range.
                  </p>
                )
              ) : null}
            </div>
            <div className="space-y-4 ml-4">
              <h3
                className={`text-2xl ${
                  isCountyShowCCXX ? "text-yellow-400" : "text-white-600"
                } active:text-yellow-600 cursor-pointer font-semibold`}
                onClick={() => setIsCountyShowCCXX((prev) => !prev)}
              >
                201~ {isCountyShowCCXX ? "▲" : "▼"}
              </h3>
              {isCountyShowCCXX ? (
                section220.length > 0 ? (
                  <div className="space-y-4 ml-4">
                    {renderGroupedHighways(groupByPrefix(section220))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No highways found in this range.
                  </p>
                )
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};
export default County;
