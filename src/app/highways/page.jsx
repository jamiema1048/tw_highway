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

  return (
    <>
      <Link href="/">Home</Link>
      <h1>Highway List</h1>
      {highways.length > 0 ? (
        highways.map((highway) => (
          <h2 key={highway.id}>
            <Link href={`highways/${highway.id}`}>{highway.name}</Link>
          </h2>
        ))
      ) : (
        <p>Loading highways...</p>
      )}
    </>
  );
};

export default HighwayList;
