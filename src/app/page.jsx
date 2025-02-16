"use client";
import React from "react";
import Image from "next/image";
import { useContext } from "react";
import { TitleContext } from "./context/TitleContext";
import Head from "next/head";

export default function Home() {
  const { title } = useContext(TitleContext);
  const handleToListClick = () => {
    window.location.href = "/highways";
  };
  const handleToTheMostClick = () => {
    window.location.href = "/themost";
  };
  const handleToReferenceClick = () => {
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
              src/app/page.js
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <div className="container mx-auto mt-4 flex flex-row place-content-center">
            <button
              onClick={handleToListClick}
              className="text-lg m-4 bg-green-500 text-white hover:text-yellow-300 p-4 rounded hover:bg-green-600 flex flex-row"
            >
              <span>公路列表</span>
            </button>
            <button
              onClick={handleToTheMostClick}
              className="text-lg m-4 bg-green-500 text-white hover:text-yellow-300 p-4 rounded hover:bg-green-600 flex flex-row"
            >
              <span>公路之最</span>
            </button>
            <button
              onClick={handleToReferenceClick}
              className="text-lg m-4 bg-green-500 text-white hover:text-yellow-300 p-4 rounded hover:bg-green-600 flex flex-row"
            >
              <span>參考資料</span>
            </button>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
