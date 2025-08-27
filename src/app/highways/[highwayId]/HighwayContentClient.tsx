"use client";

import { useContext, useEffect } from "react";
import { TitleContext } from "../../context/TitleContext";
import Image from "next/image";
import Footer from "../../footer/footer";

interface HighwayData {
  id: number;
  name: string;
  routeName?: string;
  start: string;
  currentStart?: string;
  end: string;
  currentEnd?: string;
  length: number;
  currentLength?: number;
  highest?: number;
  highestPlace?: string;
  otherName?: string;
  remark?: string;
  images?: string[];
  descriptions?: string[];
}

interface Props {
  highway: HighwayData;
}

export default function HighwayContentClient({ highway }: Props) {
  const { title, setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle(highway.name);
    document.title = highway.name;
  }, [highway.name, setTitle]);

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-5xl font-semibold text-white-800 text-center">
          {highway.name}
        </h1>

        <section className="route-info bg-black-100 p-6 rounded-lg mt-8">
          <h2 className="text-3xl font-semibold mb-4">路線資料</h2>
          {highway.routeName && (
            <h3 className="text-xl mb-4">
              <strong>路線名稱:</strong> {highway.routeName}
            </h3>
          )}
          <h3 className="text-xl mb-4">
            <strong>起點:</strong> {highway.start}
          </h3>
          {highway.currentStart && (
            <h3 className="text-xl mb-4">
              <strong>通車起點:</strong> {highway.currentStart}
            </h3>
          )}
          <h3 className="text-xl mb-4">
            <strong>終點:</strong> {highway.end}
          </h3>
          {highway.currentEnd && (
            <h3 className="text-xl mb-4">
              <strong>通車終點:</strong> {highway.currentEnd}
            </h3>
          )}
          <h3 className="text-xl mb-4">
            <strong>長度:</strong> {highway.length} km
          </h3>
          {highway.currentLength && (
            <h3 className="text-xl mb-4">
              <strong>通車長度:</strong> {highway.currentLength} km
            </h3>
          )}
          {highway.highest && (
            <h3 className="text-xl mb-4">
              <strong>最高海拔:</strong> {highway.highest} m
            </h3>
          )}
          {highway.highestPlace && (
            <h3 className="text-xl mb-4">
              <strong>最高點:</strong> {highway.highestPlace}
            </h3>
          )}
          {highway.otherName && (
            <h3 className="text-xl mb-4">
              <strong>別稱:</strong> {highway.otherName}
            </h3>
          )}
          {highway.remark && (
            <h3 className="text-xl mb-4">
              <strong>備註:</strong> {highway.remark}
            </h3>
          )}
        </section>

        <section className="media-gallery mt-12">
          <h2 className="text-2xl font-semibold mb-4">
            Images and Descriptions
          </h2>
          {highway.images && highway.descriptions && (
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 m-2">
              {highway.images.map((img, idx) => (
                <div key={idx} className="media-item inline-block p-4">
                  <div className="image-container overflow-hidden rounded-lg">
                    <Image
                      src={img}
                      alt={`${highway.name} - ${idx}`}
                      width={800}
                      height={600}
                      layout="intrinsic"
                      className="w-full object-cover rounded-lg"
                    />
                  </div>
                  {highway.descriptions[idx] && (
                    <p className="mt-2 text-sm sm:text-lg">
                      {highway.descriptions[idx]}
                    </p>
                  )}
                </div>
              ))}

              {highway.descriptions.length > highway.images.length &&
                highway.descriptions
                  .slice(highway.images.length)
                  .map((desc, idx) => (
                    <p
                      key={`desc-${idx}`}
                      className="mt-2 sm:mt-4 text-sm sm:text-lg"
                    >
                      {desc}
                    </p>
                  ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
}
