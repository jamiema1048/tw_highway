"use client";
import Link from "next/link";
import Head from "next/head";
import { TitleContext } from "./../context/TitleContext";
import Loading from "./loading";
import { use, useState, useEffect, useContext } from "react";
import Footer from "../footer/footer";

const HighwayList = () => {
  const [highways, setHighways] = useState([]);
  const { title, setTitle } = useContext(TitleContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
        const response = await fetch("http://localhost:8000/highways"); // 替换为你的 API 地址
        if (!response.ok) throw new Error("Failed to fetch highways data");
        const data = await response.json();
        setHighways(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchHighways();
  }, []);

  const handleToHomeClick = () => {
    window.location.href = "/";
  };
  const handleToTheMostClick = () => {
    window.location.href = "/themost";
  };

  // 分區資料
  const section1 = highways.filter(
    (highway) => highway.id / 10000 >= 1 && highway.id / 10000 < 3
  );
  const section2 = highways.filter(
    (highway) => highway.id / 10000 >= 4 && highway.id / 10000 < 5
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
          <h3 key={highway.id} className="text-xl">
            <Link
              href={`highways/${highway.id}`}
              className="font-bold text-white-600 hover:text-yellow-400"
            >
              {highway.remark && highway.remark.includes("解編")
                ? `${highway.name}  (已解編)`
                : highway.remark && highway.remark.includes("未納編")
                ? `${highway.name}  (未納編)`
                : highway.name}
            </Link>
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
            className="text-lg m-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:text-yellow-300 flex flex-row"
          >
            <span>首頁</span>
          </button>
          <button
            onClick={handleToTheMostClick}
            className="text-lg m-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:text-yellow-300 flex flex-row"
          >
            <span>公路之最</span>
          </button>
        </div>

        <div className="pl-5">
          {/* 第二區域: 省道 */}
          <div className="ml-9 mt-8">
            <h2 className="text-2xl font-semibold text-white-700 mb-4">省道</h2>
            {section2.length > 0 ? (
              <div className="space-y-4 ml-4">
                {renderGroupedHighways(groupByPrefix(section2))}
              </div>
            ) : (
              <p className="text-gray-500">No highways found in this range.</p>
            )}
          </div>

          {/* 第一區域: 縣市道 */}
          <div className="ml-9 mt-8">
            <h2 className="text-2xl font-semibold text-white-700 mb-4">
              縣市道
            </h2>
            {section1.length > 0 ? (
              <div className="space-y-4 ml-4">
                {renderGroupedHighways(groupByPrefix(section1))}
              </div>
            ) : (
              <p className="text-gray-500">No highways found in this range.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HighwayList;
