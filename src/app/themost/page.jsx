"use client";
import Link from "next/link";
import Head from "next/head";
import { TitleContext } from "../context/TitleContext";
import Loading from "./loading";
import { use, useState, useEffect, useContext } from "react";
import Footer from "../footer/footer";
const theMost = () => {
  const [highways, setHighways] = useState([]);
  const { title, setTitle } = useContext(TitleContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const handleToListClick = () => {
    window.location.href = "/highways";
  };
  const handleToHomeClick = () => {
    window.location.href = "/";
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
          公路之最
        </h1>
        <div className="container mx-auto mt-4 flex flex-row place-content-center">
          <button
            onClick={handleToHomeClick}
            className="text-lg m-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:text-yellow-300 flex flex-row"
          >
            <span>首頁</span>
          </button>
          <button
            onClick={handleToListClick}
            className="text-lg m-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:text-yellow-300 flex flex-row"
          >
            <span>公路列表</span>
          </button>
        </div>

        <div className="pl-5">
          <section className="route-info bg-black-100 p-6 rounded-lg mt-8">
            <h2 className="text-3xl font-semibold mb-4">公路之最</h2>
            <h3 className="text-xl mb-4">
              <strong>最北藍盾省道:</strong>{" "}
              <Link
                href={"highways/40200"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                台2線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最南藍盾省道:</strong>{" "}
              <Link
                href={"highways/42600"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                台26線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最東藍盾省道:</strong>{" "}
              <Link
                href={"highways/40200"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                台2線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最西藍盾省道:</strong>{" "}
              <Link
                href={"highways/41700"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                台17線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最北紅盾省道:</strong>{" "}
              <Link
                href={"highways/46100"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                台61線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最南紅盾省道:</strong>{" "}
              <Link
                href={"highways/48800"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                台88線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最東紅盾省道:</strong>{" "}
              <Link
                href={"highways/46200"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                台62線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最西紅盾省道:</strong>{" "}
              <Link
                href={"highways/46100"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                台61線
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最長藍盾省道主線:</strong>{" "}
              <Link
                href={"highways/40100"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台1線 (長度 : 461.081km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最長紅盾省道主線:</strong>{" "}
              <Link
                href={"highways/46100"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台61線 (長度 : 301.834km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最短藍盾省道主線:</strong>{" "}
              <Link
                href={"highways/43700"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台37線 (長度 : 14.417km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最短紅盾省道主線:</strong>{" "}
              <Link
                href={"highways/46500"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台65線 (長度 : 12.260km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最長藍盾省道支線:</strong>{" "}
              <Link
                href={"highways/41901"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台19甲線 (長度 : 78.693km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最長紅盾省道支線:</strong>{" "}
              <Link
                href={"highways/47401"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台74甲線 (長度 : 10.53km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最短藍盾省道支線:</strong>{" "}
              <Link
                href={"highways/41501"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台15甲線 (長度 : 1.656km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最短紅盾省道支線:</strong>{" "}
              <Link
                href={"highways/46801"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台68甲線 (長度 : 1.260km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最高省道:</strong>{" "}
              <Link
                href={"highways/41401"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台14甲線 (海拔高度 : 3275m)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>第二高省道:</strong>{" "}
              <Link
                href={"highways/42000"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台20線 (海拔高度 : 2722m)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>第三高省道:</strong>{" "}
              <Link
                href={"highways/41800"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台18線 (海拔高度 : 2610m)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>第三高省道:</strong>{" "}
              <Link
                href={"highways/42100"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台21線 (海拔高度 : 2610m)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>第五高省道:</strong>{" "}
              <Link
                href={"highways/40800"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"台8線 (海拔高度 : 2565m)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最北縣市道:</strong>{" "}
              <Link
                href={"highways/10100"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                市道101
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最南縣市道:</strong>{" "}
              <Link
                href={"highways/20001"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                縣道200甲
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最東縣市道:</strong>{" "}
              <Link
                href={"highways/10200"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                市道102
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最西縣市道:</strong>{" "}
              <Link
                href={"highways/20300"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                縣道203
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>本島最西縣市道:</strong>{" "}
              <Link
                href={"highways/17301"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                市道173甲
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最長縣市道主線:</strong>{" "}
              <Link
                href={"highways/19300"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"縣道193 (長度 : 110.920km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最短縣市道主線:</strong>{" "}
              <Link
                href={"highways/10900"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"市道109 (長度 : 2.707km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最長縣市道支線:</strong>{" "}
              <Link
                href={"highways/14901"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"縣道149甲 (長度 : 53.786km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最短縣市道支線:</strong>{" "}
              <Link
                href={"highways/15101"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                {"縣道151甲 (長度 : 0.883km)"}
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>最高縣市道:</strong>{" "}
              <Link
                href={"highways/41401"}
                className="font-bold text-white-600 hover:text-yellow-400"
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
export default theMost;
