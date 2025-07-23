"use client";

import { useContext, useState, useEffect } from "react";
import { TitleContext } from "../../context/TitleContext";
import Head from "next/head";
import Image from "next/image";
import NotFound from "./not-found";
import Loading from "./loading";
import Footer from "../../footer/footer";

interface HighwayParams {
  highwayId: string;
}

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

interface HighwayContentProps {
  params: Promise<HighwayParams> | HighwayParams;
}

const HighwayContent = ({ params }: HighwayContentProps): JSX.Element => {
  const [highwayId, setHighwayId] = useState<string | null>(null);
  const { title, setTitle } = useContext(TitleContext);
  const [data, setData] = useState<HighwayData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFoundPage, setNotFoundPage] = useState<boolean>(false);

  useEffect(() => {
    setTitle("載入中請稍後");
    document.title = "載入中請稍後";

    const unwrapParams = async () => {
      try {
        const unwrappedParams = await params;
        if (!unwrappedParams?.highwayId) {
          setNotFoundPage(true);
          setTitle("無法顯示");
          document.title = "無法顯示";
          return;
        }
        setHighwayId(unwrappedParams.highwayId);
      } catch (err) {
        setError("Failed to load route parameters.");
      }
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!highwayId) return;

    const fetchHighwayData = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const response = await fetch("http://localhost:8000/highways");
        if (!response.ok) throw new Error("Failed to fetch highways data");

        const allHighways: HighwayData[] = await response.json();
        const highway = allHighways.find(
          (hwy) => Number(hwy.id) === Number(highwayId)
        );
        setLoading(false);

        if (!highway) {
          setNotFoundPage(true);
          setTitle("無法顯示");
          document.title = "無法顯示";
          return;
        }

        const [imagesRes, descRes] = await Promise.all([
          fetch("/db_image.json"),
          fetch("/db_description.json"),
        ]);

        if (!imagesRes.ok || !descRes.ok)
          throw new Error("Failed to fetch additional data");

        const [imagesData, descriptionsData] = await Promise.all([
          imagesRes.json(),
          descRes.json(),
        ]);

        highway.images = imagesData[highwayId] || [];
        highway.descriptions = descriptionsData[highwayId] || [];

        setData(highway);
        setTitle(`Highway ${highway.name}`);
        document.title = `${highway.name}`;
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchHighwayData();
  }, [highwayId]);

  if (error) return <h1>Error: {error}</h1>;
  if (notFoundPage) return <NotFound />;

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
      {data ? (
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-5xl font-semibold text-white-800 text-center">
            {data.name}
          </h1>

          <section className="route-info bg-black-100 p-6 rounded-lg mt-8">
            <h2 className="text-3xl font-semibold mb-4">路線資料</h2>
            {data.routeName && (
              <h3 className="text-xl mb-4">
                <strong>路線名稱:</strong> {data.routeName}
              </h3>
            )}
            <h3 className="text-xl mb-4">
              <strong>起點:</strong> {data.start}
            </h3>
            {data.currentStart && (
              <h3 className="text-xl mb-4">
                <strong>通車起點:</strong> {data.currentStart}
              </h3>
            )}
            <h3 className="text-xl mb-4">
              <strong>終點:</strong> {data.end}
            </h3>
            {data.currentEnd && (
              <h3 className="text-xl mb-4">
                <strong>通車終點:</strong> {data.currentEnd}
              </h3>
            )}
            <h3 className="text-xl mb-4">
              <strong>長度:</strong> {data.length} km
            </h3>
            {data.currentLength && (
              <h3 className="text-xl mb-4">
                <strong>通車長度:</strong> {data.currentLength} km
              </h3>
            )}
            {data.highest && (
              <h3 className="text-xl mb-4">
                <strong>最高海拔:</strong> {data.highest} m
              </h3>
            )}
            {data.highestPlace && (
              <h3 className="text-xl mb-4">
                <strong>最高點:</strong> {data.highestPlace}
              </h3>
            )}
            {data.otherName && (
              <h3 className="text-xl mb-4">
                <strong>別稱:</strong> {data.otherName}
              </h3>
            )}
            {data.remark && (
              <h3 className="text-xl mb-4">
                <strong>備註:</strong> {data.remark}
              </h3>
            )}
          </section>

          <section className="media-gallery mt-12">
            <h2 className="text-2xl font-semibold mb-4 auto-rows-auto">
              Images and Descriptions
            </h2>
            {data.images && data.descriptions && (
              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 m-2">
                {data.images.map((image, index) => (
                  <div key={index} className="media-item inline-block p-4">
                    <div className="image-container overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={`Highway ${data.name} - ${index}`}
                        width={800}
                        height={600}
                        layout="intrinsic"
                        className="w-full object-cover rounded-lg"
                      />
                    </div>
                    {data.descriptions[index] && (
                      <p className="mt-2 text-sm sm:text-lg">
                        {data.descriptions[index]}
                      </p>
                    )}
                  </div>
                ))}

                {data.descriptions.length > data.images.length &&
                  data.descriptions
                    .slice(data.images.length)
                    .map((desc, index) => (
                      <p
                        key={`desc-${index}`}
                        className="mt-2 sm:mt-4 text-sm sm:text-lg"
                      >
                        {desc}
                      </p>
                    ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="loading-container flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-gray-800"></div>
          <span className="ml-2 text-xl">Loading data...</span>
        </div>
      )}
      <Footer />
    </>
  );
};

export default HighwayContent;
