"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import HighwayCard from "./HighwayCard";
import { Highway } from "types/highway";

interface ProvinceProps {
  highways: Highway[];
  setHighways: React.Dispatch<React.SetStateAction<Highway[]>>;
  hoveredHighway: Highway | null;
  setHoveredHighway: React.Dispatch<React.SetStateAction<Highway | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const Province: React.FC<ProvinceProps> = ({
  highways,
  setHighways,
  hoveredHighway,
  setHoveredHighway,
  loading,
  setLoading,
  error,
  setError,
}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isProvinceShow, setIsProvinceShow] = useState(false);
  const [groupedHighways, setGroupedHighways] = useState<
    Record<string, Highway[]>
  >({});
  const [isProvinceShowXX, setIsProvinceShowXX] = useState(false); // 1~20
  const [isProvinceShowC, setIsProvinceShowC] = useState(false); // 21~

  useEffect(() => {
    const fetchHighways = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 3000)); // 模擬網路延遲
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

        const [imagesData, descriptionsData]: [
          Record<number, string[]>,
          Record<number, string>
        ] = await Promise.all([imagesRes.json(), descRes.json()]);

        const detailedHighways: Highway[] = await Promise.all(
          data.map(async (highway) => {
            const highwayId = highway.id;
            highway.images = imagesData[highwayId] || [];
            highway.description = descriptionsData[highwayId] || "";
            highway.currentImageIndex = 0;
            return highway;
          })
        );

        const grouped = detailedHighways.reduce(
          (acc: Record<string, Highway[]>, highway) => {
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
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchHighways();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".highway-card") &&
        !target.closest(".highway-link")
      ) {
        setHoveredHighway(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const section420 = highways.filter(
    (highway) => highway.id / 100 >= 400 && highway.id / 100 < 421
  );

  const section440 = highways.filter(
    (highway) => highway.id / 100 >= 421 && highway.id / 100 < 500
  );

  const groupByPrefix = (section: Highway[]): Record<string, Highway[]> => {
    const grouped: Record<string, Highway[]> = {};
    section.forEach((highway) => {
      const prefix = Math.floor(highway.id / 100).toString();
      if (!grouped[prefix]) {
        grouped[prefix] = [];
      }
      grouped[prefix].push(highway);
    });
    return grouped;
  };

  const renderGroupedHighways = (
    groupedHighways: Record<string, Highway[]>
  ) => {
    return Object.entries(groupedHighways).map(([prefix, highways]) => (
      <div key={prefix} className="flex flex-wrap gap-4">
        {highways.map((highway) => (
          <HighwayCard
            key={highway.id}
            highway={highway}
            hoveredHighway={hoveredHighway}
            setHoveredHighway={setHoveredHighway}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="ml-3 md:ml-6 lg:ml-9 mt-4 h-md:mt-6 h-lg:mt-8">
      <h2
        className={`text-4xl font-semibold ${
          isProvinceShow ? "text-yellow-400" : "text-white-600"
        } active:text-yellow-600 cursor-pointer max-w-fit mb-2 h-md:mb-3 h-lg:mb-4 lg:pr-3`}
        onClick={() => setIsProvinceShow((prev) => !prev)}
      >
        省道 {isProvinceShow ? "▲" : "▼"}
      </h2>

      {isProvinceShow && (
        <>
          <div className="space-y-4 ml-4">
            <h3
              className={`text-2xl ${
                isProvinceShowXX ? "text-yellow-400" : "text-white-600"
              } active:text-yellow-600 cursor-pointer font-semibold`}
              onClick={() => setIsProvinceShowXX((prev) => !prev)}
            >
              1~20 {isProvinceShowXX ? "▲" : "▼"}
            </h3>
            {isProvinceShowXX && (
              <>
                {section420.length > 0 ? (
                  <div className="space-y-4 ml-4">
                    {renderGroupedHighways(groupByPrefix(section420))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No highways found in this range.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="space-y-4 ml-4">
            <h3
              className={`text-2xl ${
                isProvinceShowC ? "text-yellow-400" : "text-white-600"
              } active:text-yellow-600 cursor-pointer font-semibold`}
              onClick={() => setIsProvinceShowC((prev) => !prev)}
            >
              21~ {isProvinceShowC ? "▲" : "▼"}
            </h3>
            {isProvinceShowC && (
              <>
                {section440.length > 0 ? (
                  <div className="space-y-4 ml-4">
                    {renderGroupedHighways(groupByPrefix(section440))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No highways found in this range.
                  </p>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Province;
