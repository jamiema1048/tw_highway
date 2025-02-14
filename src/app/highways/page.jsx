"use client";

import Link from "next/link";
import Head from "next/head";
import { TitleContext } from "@/app/context/TitleContext";
import { use, useState, useEffect, useContext } from "react";

const HighwayList = () => {
  const [highways, setHighways] = useState([]);
  const { title, setTitle } = useContext(TitleContext);

  useEffect(() => {
    const fetchHighways = async () => {
      const response = await fetch("http://localhost:8000/highways"); // 替换为你的 API 地址
      const data = await response.json();
      setHighways(data);
    };

    fetchHighways();
  }, []);

  // 分區資料
  const section1 = highways.filter(
    (highway) => highway.id / 10000 >= 1 && highway.id / 10000 < 3
  );
  const section2 = highways.filter(
    (highway) => highway.id / 10000 >= 4 && highway.id / 10000 < 5
  );

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="text-lg text-blue-500 hover:underline">
          Home
        </Link>
        <h1 className="text-4xl font-bold text-white-800 text-center my-8">
          Highway List
        </h1>

        {/* 第二區域: 省道 */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white-700 mb-4">省道</h2>
          {section2.length > 0 ? (
            <div className="space-y-4">
              {section2.map((highway) => (
                <h3 key={highway.id} className="text-xl">
                  <Link
                    href={`highways/${highway.id}`}
                    className="text-white-600 hover:text-yellow-400"
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
          ) : (
            <p className="text-gray-500">No highways found in this range.</p>
          )}
        </div>

        {/* 第一區域: 縣市道 */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white-700 mb-4">縣市道</h2>
          {section1.length > 0 ? (
            <div className="space-y-4">
              {section1.map((highway) => (
                <h3 key={highway.id} className="text-xl">
                  <Link
                    href={`highways/${highway.id}`}
                    className="text-white-600 hover:text-yellow-400"
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
          ) : (
            <p className="text-gray-500">No highways found in this range.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default HighwayList;
