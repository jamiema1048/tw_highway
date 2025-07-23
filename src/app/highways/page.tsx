"use client";
import Link from "next/link";
import Head from "next/head";
import { TitleContext } from "../context/TitleContext";
import Loading from "./loading";
import {
  use,
  useState,
  useEffect,
  useContext,
  useRef,
  MouseEvent,
} from "react";
import Province from "./Province";
import County from "./County";
import Footer from "../footer/footer";

type Highway = {
  id: string;
  name: string;
  prefix?: string;
  images?: string[];
  description?: string;
  currentImageIndex?: number;
  [key: string]: any; // 允許其他屬性存在
};

type GroupedHighways = {
  [prefix: string]: Highway[];
};

const HighwayList = () => {
  const [highways, setHighways] = useState<Highway[]>([]);
  const { title, setTitle } = useContext(TitleContext);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredHighway, setHoveredHighway] = useState<Highway | null>(null);
  const [groupedHighways, setGroupedHighways] = useState<GroupedHighways>({});
  const [touchTimeout, setTouchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchHighways = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const response = await fetch("http://localhost:8000/highways");
        if (!response.ok) throw new Error("Failed to fetch highways data");
        const data: Highway[] = await response.json();

        const [imagesRes, descRes] = await Promise.all([
          fetch("/db_image.json"),
          fetch("/db_description.json"),
        ]);

        if (!imagesRes.ok || !descRes.ok)
          throw new Error("Failed to fetch additional data");

        const imagesData: { [key: string]: string[] } = await imagesRes.json();
        const descriptionsData: { [key: string]: string } =
          await descRes.json();

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

        const grouped = detailedHighways.reduce(
          (acc: GroupedHighways, highway) => {
            const prefix = highway.prefix || "其他";
            acc[prefix] = acc[prefix] || [];
            acc[prefix].push(highway);
            return acc;
          },
          {}
        );

        setHighways(detailedHighways);
        setGroupedHighways(grouped);
        setLoading(false);
      } catch (error: any) {
        setError(error.message || "發生錯誤");
        setLoading(false);
      }
    };

    fetchHighways();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
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
          公路列表
        </h1>

        <div className="pl-1 md:pl-3 lg:pl-5">
          <Province
            hoveredHighway={hoveredHighway}
            setHoveredHighway={setHoveredHighway}
            highways={highways}
            setHighways={setHighways}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
          <County
            hoveredHighway={hoveredHighway}
            setHoveredHighway={setHoveredHighway}
            highways={highways}
            setHighways={setHighways}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HighwayList;
