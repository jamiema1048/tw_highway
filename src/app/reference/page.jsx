"use client";
import Link from "next/link";
import Head from "next/head";
import { TitleContext } from "../context/TitleContext";
//import Loading from "./loading";
import { use, useState, useEffect, useContext } from "react";
import Footer from "../footer/footer";
const dataReference = () => {
  const { title, setTitle } = useContext(TitleContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleToListClick = () => {
    window.location.href = "/highways";
  };
  const handleToHomeClick = () => {
    window.location.href = "/";
  };
  return (
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
            <h2 className="text-3xl font-semibold mb-4">資料來源</h2>
            <h3 className="text-xl mb-4">
              <strong>1. </strong>{" "}
              <Link
                href={"https://twroad.org/"}
                className="font-bold text-white-600 hover:text-yellow-400"
              >
                公路邦
              </Link>
            </h3>
            <h3 className="text-xl mb-4">
              <strong>2. </strong> 維基百科
            </h3>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default dataReference;
