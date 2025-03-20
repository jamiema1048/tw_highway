"use client";
import Link from "next/link";
import Head from "next/head";
import { TitleContext } from "./../context/TitleContext";
import Loading from "./loading";
import { use, useState, useEffect, useContext, useRef } from "react";
import Footer from "../footer/footer";

const HighwayList = () => {
  const [highways, setHighways] = useState([]);
  const { title, setTitle } = useContext(TitleContext);
  const timeoutRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProvinceShow, setIsProvinceShow] = useState(false);
  const [isCountyShow, setIsCountyShow] = useState(false);
  const [hoveredHighway, setHoveredHighway] = useState(null);
  const [groupedHighways, setGroupedHighways] = useState({});
  const [touchTimeout, setTouchTimeout] = useState(null);
  const [isCardVisible, setIsCardVisible] = useState(false); // 用來控制顯示字卡的狀態
  const [isCountyShowCXX, setIsCountyShowCXX] = useState(false); //101~120
  const [isCountyShowCXL, setIsCountyShowCXL] = useState(false); //121~140
  const [isCountyShowCLX, setIsCountyShowCLX] = useState(false); //141~160
  const [isCountyShowCLXXX, setIsCountyShowCLXXX] = useState(false); //161~180
  const [isCountyShowCC, setIsCountyShowCC] = useState(false); //181~200
  const [isCountyShowCCXX, setIsCountyShowCCXX] = useState(false); //201~220
  const [isProvinceShowXX, setIsProvinceShowXX] = useState(false); //1~20
  const [isProvinceShowC, setIsProvinceShowC] = useState(false); //21~
  // useEffect(() => {
  //   if (loading == true) {
  //     setTitle("載入中請稍後");
  //     document.title = "載入中請稍後";
  //   }
  // }, []);

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

  // 當游標進入 link 時顯示字卡
  const handleMouseEnter = (highway) => {
    // 清除任何即將執行的隱藏計時器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredHighway(highway);
    setIsCardVisible(true);
  };

  const handleMouseLeave = () => {
    // 設置 300ms 延遲，確保如果滑鼠沒有進入字卡，就隱藏
    timeoutRef.current = setTimeout(() => {
      setIsCardVisible(false);
      setHoveredHighway(null);
    }, 300);
  };

  // 當游標進入字卡時，防止觸發隱藏
  const handleCardMouseEnter = () => {
    // 清除計時器，避免字卡被意外隱藏
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsCardVisible(true);
  };

  const handleCardMouseLeave = () => {
    // 當滑鼠離開字卡時，確保隱藏
    timeoutRef.current = setTimeout(() => {
      setIsCardVisible(false);
      setHoveredHighway(null);
    }, 300);
  };

  const handleToHomeClick = () => {
    window.location.href = "/";
  };
  const handleToTheMostClick = () => {
    window.location.href = "/themost";
  };

  // // 舊分區資料
  // const section1 = highways.filter(
  //   (highway) => highway.id / 10000 >= 1 && highway.id / 10000 < 3
  // );
  const section2 = highways.filter(
    (highway) => highway.id / 10000 >= 4 && highway.id / 10000 < 5
  );
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
          <h3 key={highway.id} className="relative text-xl">
            <Link
              href={`highways/${highway.id}`}
              className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600"
              onMouseEnter={() => {
                console.log("Hover on:", highway.name);
                handleMouseEnter(highway);
              }}
              onMouseLeave={() => {
                handleMouseLeave();
                console.log("Left Hover on:", highway.name);
              }}
              onTouchStart={() => handleTouchStart(highway)}
              onTouchEnd={handleTouchEnd}
            >
              {highway.remark && highway.remark.includes("解編")
                ? `${highway.name}  (已解編)`
                : highway.remark && highway.remark.includes("未納編")
                ? `${highway.name}  (未納編)`
                : highway.name}
            </Link>
            {/* 浮動字卡 */}
            {hoveredHighway?.id === highway.id && isCardVisible ? (
              <div
                className="absolute bottom-full left-36 transform -translate-x-1/2 mb-4 w-80 p-4 bg-white border border-gray-300 shadow-lg rounded-lg z-50 highway-card"
                onMouseEnter={handleCardMouseEnter} // 當游標進入字卡時，不觸發隱藏
                onMouseLeave={handleCardMouseLeave} // 當游標離開字卡時觸發隱藏
              >
                {/* 如果有多張圖片 */}
                {hoveredHighway.images && hoveredHighway.images.length > 1 ? (
                  <div className="relative">
                    {/* 顯示圖片 */}
                    <img
                      src={
                        hoveredHighway.images[hoveredHighway.currentImageIndex]
                      }
                      alt={hoveredHighway.name}
                      className="w-full h-48 object-cover rounded-md"
                      style={{ objectPosition: "center" }} // 設置圖片顯示中間部分
                    />

                    {/* 只有當圖片索引大於0時，顯示上一張按鈕 */}
                    <button
                      className={`absolute top-1/2 left-0 transform ${
                        hoveredHighway.currentImageIndex > 0
                          ? "block"
                          : "hidden"
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
                ) : hoveredHighway.images &&
                  hoveredHighway.images.length === 1 ? (
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
                  {hoveredHighway.name}
                </p>
                <p className="text-sm text-black font-semibold mt-1">
                  {hoveredHighway.routeName}
                </p>
              </div>
            ) : (
              <></>
            )}
          </h3>
        ))}
      </div>
    ));
  };

  return loading ? (
    <>
      <Loading />
      <Footer />
    </>
  ) : (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold text-white-800 text-center my-8">
          公路列表
        </h1>
        <div className="container mx-auto mt-4 flex flex-row place-content-center">
          <button
            onClick={handleToHomeClick}
            className="text-lg m-4 bg-green-500 text-white hover:text-yellow-300 active:text-yellow-600 p-4 rounded hover:bg-green-600 active:bg-green-800 active:shadow-green-400 active:shadow-md flex flex-row"
          >
            <span>首頁</span>
          </button>
          <button
            onClick={handleToTheMostClick}
            className="text-lg m-4 bg-green-500 text-white hover:text-yellow-300 active:text-yellow-600 p-4 rounded hover:bg-green-600 active:bg-green-800 active:shadow-green-400 active:shadow-md flex flex-row"
          >
            <span>公路之最</span>
          </button>
        </div>

        <div className=" pl-1 md:pl-3 lg:pl-5">
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
                      {section2.length > 0 ? (
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
                      {section2.length > 0 ? (
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
                <div>
                  {/* {section1.length > 0 ? (
                    <div className="space-y-4 ml-4">
                      {renderGroupedHighways(groupByPrefix(section1))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No highways found in this range.
                    </p>
                  )} */}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HighwayList;
