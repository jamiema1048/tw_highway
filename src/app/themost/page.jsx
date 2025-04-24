"use client";
import Link from "next/link";
import Head from "next/head";
import { TitleContext } from "../context/TitleContext";
import Loading from "./loading";
import { use, useState, useEffect, useContext, useRef } from "react";
import Footer from "../footer/footer";
const TheMost = () => {
  const [theMostTitles, setTheMostTitles] = useState([]);
  const [highways, setHighways] = useState([]);
  const { title, setTitle } = useContext(TitleContext);
  const timeoutRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredHighway, setHoveredHighway] = useState(null);
  const [groupedHighways, setGroupedHighways] = useState({});
  useEffect(() => {
    const fetchHighways = async () => {
      setLoading(true); // 確保進入 loading 狀態
      await new Promise((r) => setTimeout(r, 3000)); // 模擬網路延遲
      try {
        // Fetch highways data
        const response = await fetch("http://localhost:8000/highways"); // 替换为你的 API 地址
        if (!response.ok) throw new Error("Failed to fetch highways data");
        const data = await response.json();
        const theMostRes = await fetch(
          "http://localhost:8000/title_of_theMost"
        );
        const theMostData = await theMostRes.json();

        // Fetch images & descriptions
        const [imagesRes, descRes] = await Promise.all([
          fetch("/db_image.json"),
          fetch("/db_description.json"),
        ]);

        if (!imagesRes.ok || !descRes.ok || !theMostRes.ok)
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
        // 依序獲取theMost標題
        const detailedtheMost = await Promise.all(
          theMostData.map(async (highway) => {
            //這裡看一下
            try {
              const theMostTitleId = highway.id;

              // 合併圖片和描述資料
              highway.title = theMostData[theMostTitleId] || []; // 取得標題
              return highway; // 返回合併後的資料
            } catch (error) {
              return { ...highway, title: "" }; // 若請求失敗，避免崩潰
            }
          })
        );

        // 按照 prefix 分組
        const grouped = detailedtheMost.reduce((acc, highway) => {
          const prefix = highway.prefix || "其他";
          acc[prefix] = acc[prefix] || [];
          acc[prefix].push(highway);
          return acc;
        }, {});

        setTheMostTitles(detailedtheMost);
        setGroupedHighways(grouped);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchHighways();
  }, []);
  const sectionp = theMostTitles.filter(
    //省道
    (highway) => highway.id >= 2001 && highway.id < 2022
  );
  const sectionc = theMostTitles.filter(
    //縣市道
    (highway) => highway.id >= 2022 && highway.id < 2032
  );
  console.log(sectionp);
  const groupByPrefix = (highways) => {
    return highways.reduce((acc, highway) => {
      const prefix = highway.prefix || "其他";
      acc[prefix] = acc[prefix] || [];
      acc[prefix].push(highway);
      return acc;
    }, {});
  };
  const renderGroupedHighways = (highways) => {
    const grouped = groupByPrefix(highways);

    return Object.entries(grouped).map(([prefix, groupedList]) => (
      <div key={prefix} className="mb-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">{prefix}</h3>
        <div className="flex flex-wrap gap-4">
          {groupedList.map((highway) => (
            <h3 key={highway.id} className="bg-white rounded p-2 shadow">
              {highway.title}
            </h3>
            // 這裡未來可替換成 <HighwayCard /> 之類的元件
          ))}
        </div>
      </div>
    ));
  };

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
          公路之最
        </h1>
        <div className="pl-5">
          <section className="route-info bg-black-100 p-6 rounded-lg mt-8">
            <h2 className="text-3xl font-semibold mb-4">省道</h2>
            {sectionp.length > 0 ? (
              <div className="space-y-4 ml-4">
                {renderGroupedHighways(sectionp)}
              </div>
            ) : (
              <p className="text-gray-500">No highways found in this range.</p>
            )}
          </section>
        </div>
        <div className="pl-5">
          <section className="route-info bg-black-100 p-6 rounded-lg mt-8">
            <h2 className="text-3xl font-semibold mb-4">縣市道</h2>
            {sectionc.length > 0 ? (
              <div className="space-y-4 ml-4">
                {renderGroupedHighways(sectionc)}
              </div>
            ) : (
              <p className="text-gray-500">No highways found in this range.</p>
            )}
          </section>
        </div>

        <div className="pl-5">
          <section className="route-info bg-black-100 p-6 rounded-lg mt-8">
            <h2 className="text-3xl font-semibold mb-4">公路之最</h2>
            <h3 className="text-xl mb-4">
              <strong>最北藍盾省道:</strong>{" "}
              <Link
                href={"highways/40200"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                台2線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最南藍盾省道:</strong>{" "}
              <Link
                href={"highways/42600"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                台26線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最東藍盾省道:</strong>{" "}
              <Link
                href={"highways/40200"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                台2線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最西藍盾省道:</strong>{" "}
              <Link
                href={"highways/41700"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                台17線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最北紅盾省道:</strong>{" "}
              <Link
                href={"highways/46100"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                台61線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最南紅盾省道:</strong>{" "}
              <Link
                href={"highways/48800"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                台88線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最東紅盾省道:</strong>{" "}
              <Link
                href={"highways/46200"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                台62線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最西紅盾省道:</strong>{" "}
              <Link
                href={"highways/46100"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                台61線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最長藍盾省道主線:</strong>{" "}
              <Link
                href={"highways/40100"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台1線 (長度 : 461.081km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最長紅盾省道主線:</strong>{" "}
              <Link
                href={"highways/46100"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台61線 (長度 : 301.834km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最短藍盾省道主線:</strong>{" "}
              <Link
                href={"highways/43700"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台37線 (長度 : 14.417km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最短紅盾省道主線:</strong>{" "}
              <Link
                href={"highways/46500"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台65線 (長度 : 12.260km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最長藍盾省道支線:</strong>{" "}
              <Link
                href={"highways/41901"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台19甲線 (長度 : 78.693km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最長紅盾省道支線:</strong>{" "}
              <Link
                href={"highways/47401"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台74甲線 (長度 : 10.53km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最短藍盾省道支線:</strong>{" "}
              <Link
                href={"highways/41501"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台15甲線 (長度 : 1.656km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最短紅盾省道支線:</strong>{" "}
              <Link
                href={"highways/46801"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台68甲線 (長度 : 1.260km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最高省道:</strong>{" "}
              <Link
                href={"highways/41401"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台14甲線 (海拔高度 : 3275m)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>第二高省道:</strong>{" "}
              <Link
                href={"highways/42000"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台20線 (海拔高度 : 2722m)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>第三高省道:</strong>{" "}
              <Link
                href={"highways/41800"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台18線 (海拔高度 : 2610m)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>第三高省道:</strong>{" "}
              <Link
                href={"highways/42100"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台21線 (海拔高度 : 2610m)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>第五高省道:</strong>{" "}
              <Link
                href={"highways/40800"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"台8線 (海拔高度 : 2565m)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最北縣市道:</strong>{" "}
              <Link
                href={"highways/10100"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                市道101
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最南縣市道:</strong>{" "}
              <Link
                href={"highways/20001"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                縣道200甲
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最東縣市道:</strong>{" "}
              <Link
                href={"highways/10200"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                市道102
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最西縣市道:</strong>{" "}
              <Link
                href={"highways/20300"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                縣道203
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>本島最西縣市道:</strong>{" "}
              <Link
                href={"highways/17301"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                市道173甲
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最長縣市道主線:</strong>{" "}
              <Link
                href={"highways/19300"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"縣道193 (長度 : 110.920km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最短縣市道主線:</strong>{" "}
              <Link
                href={"highways/10900"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"市道109 (長度 : 2.707km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最長縣市道支線:</strong>{" "}
              <Link
                href={"highways/14901"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"縣道149甲 (長度 : 53.786km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最短縣市道支線:</strong>{" "}
              <Link
                href={"highways/15101"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"縣道151甲 (長度 : 0.883km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最高縣市道:</strong>{" "}
              <Link
                href={"highways/41401"}
                className="font-bold text-white-600 hover:text-yellow-400 active:text-yellow-600 cursor-pointer"
              >
                {"縣道169 (海拔高度 : 1630m)"}
              </Link>
            </h3>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default TheMost;
