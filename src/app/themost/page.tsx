"use client";
import Link from "next/link";
import Head from "next/head";
import { TitleContext } from "../context/TitleContext";
import Loading from "./loading";
import { use, useState, useEffect, useContext, useRef } from "react";
import Footer from "../footer/footer";

// 定義 Highway 資料型別
interface Highway {
  id: number;
  name?: string;
  prefix?: string;
  images?: string[];
  description?: string;
  currentImageIndex?: number;
  title?: string;
}

// 定義分組資料型別
type GroupedHighways = Record<string, Highway[]>;

const TheMost = (): JSX.Element => {
  const [theMostTitles, setTheMostTitles] = useState<Highway[]>([]);
  const [highways, setHighways] = useState<Highway[]>([]);
  const { title, setTitle } = useContext(TitleContext);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredHighway, setHoveredHighway] = useState<Highway | null>(null);
  const [groupedHighways, setGroupedHighways] = useState<GroupedHighways>({});

  useEffect(() => {
    const fetchHighways = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 3000)); // 模擬延遲

      try {
        const response = await fetch("http://localhost:8000/highways");
        if (!response.ok) throw new Error("Failed to fetch highways data");
        const data: Highway[] = await response.json();

        const theMostRes = await fetch(
          "http://localhost:8000/title_of_theMost"
        );
        if (!theMostRes.ok) throw new Error("Failed to fetch theMost data");
        const theMostData: Highway[] = await theMostRes.json();

        const [imagesRes, descRes] = await Promise.all([
          fetch("/db_image.json"),
          fetch("/db_description.json"),
        ]);
        if (!imagesRes.ok || !descRes.ok)
          throw new Error("Failed to fetch additional data");

        const imagesData: Record<number, string[]> = await imagesRes.json();
        const descriptionsData: Record<number, string> = await descRes.json();

        const detailedHighways = await Promise.all(
          data.map(async (highway) => {
            const highwayId = highway.id;
            return {
              ...highway,
              images: imagesData[highwayId] || [],
              description: descriptionsData[highwayId] || "",
              currentImageIndex: 0,
            };
          })
        );

        const detailedTheMost = await Promise.all(
          theMostData.map(async (highway) => {
            const id = highway.id;
            return {
              ...highway,
              title: theMostData.find((h) => h.id === id)?.title || "",
            };
          })
        );

        const grouped: GroupedHighways = detailedTheMost.reduce(
          (acc, highway) => {
            const prefix = highway.prefix || "其他";
            acc[prefix] = acc[prefix] || [];
            acc[prefix].push(highway);
            return acc;
          },
          {} as GroupedHighways
        );

        setTheMostTitles(detailedTheMost);
        setGroupedHighways(grouped);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchHighways();
  }, []);

  const sectionp = theMostTitles.filter((h) => h.id >= 2001 && h.id < 2022);
  const sectionc = theMostTitles.filter((h) => h.id >= 2022 && h.id < 2032);

  const groupByPrefix = (highways: Highway[]): GroupedHighways => {
    return highways.reduce((acc: GroupedHighways, highway) => {
      const prefix = highway.prefix || "其他";
      acc[prefix] = acc[prefix] || [];
      acc[prefix].push(highway);
      return acc;
    }, {});
  };
  const renderGroupedHighways = (highways: Highway[]) => {
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
