"use client";
import { useState, useEffect, useRef } from "react";
import HighwayCard from "./HighwayCard";
import { Highway } from "types/highway";

interface CountyProps {
  highways: Highway[];
  setHighways: React.Dispatch<React.SetStateAction<Highway[]>>;
  hoveredHighway: Highway | null;
  setHoveredHighway: React.Dispatch<React.SetStateAction<Highway | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const County: React.FC<CountyProps> = ({
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

  const [isCountyShow, setIsCountyShow] = useState(false);
  const [groupedHighways, setGroupedHighways] = useState<
    Record<string, Highway[]>
  >({});
  const [isCountyShowCXX, setIsCountyShowCXX] = useState(false);
  const [isCountyShowCXL, setIsCountyShowCXL] = useState(false);
  const [isCountyShowCLX, setIsCountyShowCLX] = useState(false);
  const [isCountyShowCLXXX, setIsCountyShowCLXXX] = useState(false);
  const [isCountyShowCC, setIsCountyShowCC] = useState(false);
  const [isCountyShowCCXX, setIsCountyShowCCXX] = useState(false);

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

        const [imagesData, descriptionsData]: [
          Record<number, string[]>,
          Record<number, string>
        ] = await Promise.all([imagesRes.json(), descRes.json()]);

        const detailedHighways: Highway[] = await Promise.all(
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
      } catch (error: any) {
        setError(error.message);
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

  const filterHighways = (min: number, max: number) =>
    highways.filter((h) => h.id >= min && h.id < max);

  const groupByPrefix = (section: Highway[]) => {
    const grouped: Record<number, Highway[]> = {};
    section.forEach((h) => {
      const prefix = Math.floor(h.id / 100);
      if (!grouped[prefix]) grouped[prefix] = [];
      grouped[prefix].push(h);
    });
    return grouped;
  };

  const renderGroupedHighways = (grouped: Record<number, Highway[]>) => {
    return Object.entries(grouped).map(([prefix, highways]) => (
      <div key={prefix} className="flex flex-wrap gap-4">
        {highways.map((h) => (
          <HighwayCard
            key={h.id}
            highway={h}
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
          isCountyShow ? "text-yellow-400" : "text-white-600"
        } active:text-yellow-600 cursor-pointer max-w-fit mb-2`}
        onClick={() => setIsCountyShow((prev) => !prev)}
      >
        縣市道 {isCountyShow ? "▲" : "▼"}
      </h2>

      {isCountyShow && (
        <>
          {[
            {
              label: "101~120",
              section: filterHighways(10100, 12100),
              state: isCountyShowCXX,
              setter: setIsCountyShowCXX,
            },
            {
              label: "121~140",
              section: filterHighways(12100, 14100),
              state: isCountyShowCXL,
              setter: setIsCountyShowCXL,
            },
            {
              label: "141~160",
              section: filterHighways(14100, 16100),
              state: isCountyShowCLX,
              setter: setIsCountyShowCLX,
            },
            {
              label: "161~180",
              section: filterHighways(16100, 18100),
              state: isCountyShowCLXXX,
              setter: setIsCountyShowCLXXX,
            },
            {
              label: "181~200",
              section: filterHighways(18100, 20100),
              state: isCountyShowCC,
              setter: setIsCountyShowCC,
            },
            {
              label: "201~",
              section: filterHighways(20100, 22000),
              state: isCountyShowCCXX,
              setter: setIsCountyShowCCXX,
            },
          ].map(({ label, section, state, setter }) => (
            <div key={label} className="space-y-4 ml-4">
              <h3
                className={`text-2xl ${
                  state ? "text-yellow-400" : "text-white-600"
                } active:text-yellow-600 cursor-pointer font-semibold`}
                onClick={() => setter((prev) => !prev)}
              >
                {label} {state ? "▲" : "▼"}
              </h3>
              {state &&
                (section.length > 0 ? (
                  <div className="space-y-4 ml-4">
                    {renderGroupedHighways(groupByPrefix(section))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No highways found in this range.
                  </p>
                ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default County;
