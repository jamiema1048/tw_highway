"use client";

import React, { useContext } from "react";
import Image from "next/image";
import Head from "next/head";
import { TitleContext } from "./context/TitleContext";
import Footer from "./footer/footer";

export default function Home(): JSX.Element {
  const { title } = useContext(TitleContext);

  const handleToListClick = (): void => {
    window.location.href = "/highways";
  };

  const handleToReferenceClick = (): void => {
    window.location.href = "/reference";
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Head>
        <title>{title}</title>
      </Head>

      <h1 className="text-5xl font-semibold text-white-800 text-center">
        歡迎來到小雨的公路資料網站
      </h1>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <div className="container mx-auto mt-4 flex flex-row place-content-center">
            <button
              onClick={handleToListClick}
              className="text-lg m-4 bg-green-500 text-white hover:text-yellow-300 active:text-yellow-600 p-4 rounded hover:bg-green-600 active:bg-green-800 active:shadow-green-400 active:shadow-md flex flex-row"
            >
              <span>公路列表</span>
            </button>

            <button
              onClick={handleToReferenceClick}
              className="text-lg m-4 bg-green-500 text-white hover:text-yellow-300 active:text-yellow-600 p-4 rounded hover:bg-green-600 active:bg-green-800 active:shadow-green-400 active:shadow-md flex flex-row"
            >
              <span>參考資料</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
