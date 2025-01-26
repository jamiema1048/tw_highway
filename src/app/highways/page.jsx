"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const HighwayList = () => {
  const [highways, setHighways] = useState([]);

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
      <Link href="/">Home</Link>
      <h1>Highway List</h1>

      {/* 第二區域 */}
      <div>
        <h2>省道</h2>
        {section2.length > 0 ? (
          section2.map((highway) => (
            <h3 key={highway.id}>
              <Link href={`highways/${highway.id}`}>{highway.name}</Link>
            </h3>
          ))
        ) : (
          <p>No highways found in this range.</p>
        )}
      </div>

      {/* 第一區域 */}
      <div>
        <h2>縣市道</h2>
        {section1.length > 0 ? (
          section1.map((highway) => (
            <h3 key={highway.id}>
              <Link href={`highways/${highway.id}`}>{highway.name}</Link>
            </h3>
          ))
        ) : (
          <p>No highways found in this range.</p>
        )}
      </div>
    </>
  );
};

export default HighwayList;
