"use client";
import Link from "next/link";
import Head from "next/head";
import { TitleContext } from "./../context/TitleContext";
import Loading from "./loading";
import { use, useState, useEffect, useContext, useRef } from "react";
import Province from "./Province";
import County from "./County";
import Footer from "../footer/footer";

const HighwayList = () => {
  const [highways, setHighways] = useState([]);
  const { title, setTitle } = useContext(TitleContext);
  const timeoutRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredHighway, setHoveredHighway] = useState(null);
  const [groupedHighways, setGroupedHighways] = useState({});
  const [touchTimeout, setTouchTimeout] = useState(null);
  const [isCardVisible, setIsCardVisible] = useState(false); // 用來控制顯示字卡的狀態

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

  const handleToHomeClick = () => {
    window.location.href = "/";
  };
  const handleToTheMostClick = () => {
    window.location.href = "/themost";
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
          <Province />
          <County />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HighwayList;
