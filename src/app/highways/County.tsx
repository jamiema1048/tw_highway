"use client";
import { useState, useEffect, useRef } from "react";
import HighwayCard from "./HighwayCard";
import { Highway } from "types/highway";

interface Props {
  highways: Highway[];
  hoveredHighway: Highway | null;
  setHoveredHighway: (hwy: Highway | null) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
}

export default function County({
  highways,
  hoveredHighway,
  setHoveredHighway,
  loading,
  setLoading,
}: Props) {
  const [isCountyShow, setIsCountyShow] = useState(false);
  const [isCountyShowCXX, setIsCountyShowCXX] = useState(false);
  const [isCountyShowCXL, setIsCountyShowCXL] = useState(false);
  const [isCountyShowCLX, setIsCountyShowCLX] = useState(false);
  const [isCountyShowCLXXX, setIsCountyShowCLXXX] = useState(false);
  const [isCountyShowCC, setIsCountyShowCC] = useState(false);
  const [isCountyShowCCXX, setIsCountyShowCCXX] = useState(false);

  // 過濾不同段的 highways
  const section120 = highways.filter(
    (hwy) => hwy.id / 100 >= 100 && hwy.id / 100 < 121
  );
  const section140 = highways.filter(
    (hwy) => hwy.id / 100 >= 121 && hwy.id / 100 < 141
  );
  const section160 = highways.filter(
    (hwy) => hwy.id / 100 >= 141 && hwy.id / 100 < 161
  );
  const section180 = highways.filter(
    (hwy) => hwy.id / 100 >= 161 && hwy.id / 100 < 181
  );
  const section200 = highways.filter(
    (hwy) => hwy.id / 100 >= 181 && hwy.id / 100 < 201
  );
  const section220 = highways.filter(
    (hwy) => hwy.id / 100 >= 201 && hwy.id / 100 < 221
  );

  const groupByPrefix = (section: Highway[]) => {
    const grouped: Record<number, Highway[]> = {};
    section.forEach((h) => {
      const prefix = Math.floor(h.id / 100);
      if (!grouped[prefix]) grouped[prefix] = [];
      grouped[prefix].push(h);
    });
    return grouped;
  };

  const renderGroupedHighways = (section: Highway[]) =>
    Object.entries(groupByPrefix(section)).map(([prefix, highways]) => (
      <div key={prefix} className="flex flex-wrap gap-4">
        {highways.map((hwy) => (
          <HighwayCard
            key={hwy.id}
            highway={hwy}
            hoveredHighway={hoveredHighway}
            setHoveredHighway={setHoveredHighway}
            loading={loading}
            setLoading={setLoading}
          />
        ))}
      </div>
    ));

  return (
    <div
      className="ml-3 md:ml-6 lg:ml-9 mt-4 h-md:mt-6 h-lg:mt-8"
      id="county"
      data-testid="county"
    >
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
          <div className="space-y-4 ml-4">
            <h3
              className={`text-2xl ${
                isCountyShowCXX ? "text-yellow-400" : "text-white-600"
              } cursor-pointer font-semibold`}
              onClick={() => setIsCountyShowCXX((prev) => !prev)}
            >
              101~120 {isCountyShowCXX ? "▲" : "▼"}
            </h3>
            {isCountyShowCXX && (
              <div className="space-y-4 ml-4">
                {section120.length > 0
                  ? renderGroupedHighways(section120)
                  : "No highways found"}
              </div>
            )}
          </div>

          <div className="space-y-4 ml-4">
            <h3
              className={`text-2xl ${
                isCountyShowCXL ? "text-yellow-400" : "text-white-600"
              } cursor-pointer font-semibold`}
              onClick={() => setIsCountyShowCXL((prev) => !prev)}
            >
              121~140 {isCountyShowCXL ? "▲" : "▼"}
            </h3>
            {isCountyShowCXL && (
              <div className="space-y-4 ml-4">
                {section140.length > 0
                  ? renderGroupedHighways(section140)
                  : "No highways found"}
              </div>
            )}
          </div>
          <div className="space-y-4 ml-4">
            <h3
              className={`text-2xl ${
                isCountyShowCLX ? "text-yellow-400" : "text-white-600"
              } cursor-pointer font-semibold`}
              onClick={() => setIsCountyShowCLX((prev) => !prev)}
            >
              141~160 {isCountyShowCLX ? "▲" : "▼"}
            </h3>
            {isCountyShowCLX && (
              <div className="space-y-4 ml-4">
                {section160.length > 0
                  ? renderGroupedHighways(section160)
                  : "No highways found"}
              </div>
            )}
          </div>
          <div className="space-y-4 ml-4">
            <h3
              className={`text-2xl ${
                isCountyShowCLXXX ? "text-yellow-400" : "text-white-600"
              } cursor-pointer font-semibold`}
              onClick={() => setIsCountyShowCLXXX((prev) => !prev)}
            >
              161~180 {isCountyShowCLXXX ? "▲" : "▼"}
            </h3>
            {isCountyShowCLXXX && (
              <div className="space-y-4 ml-4">
                {section180.length > 0
                  ? renderGroupedHighways(section180)
                  : "No highways found"}
              </div>
            )}
          </div>
          <div className="space-y-4 ml-4">
            <h3
              className={`text-2xl ${
                isCountyShowCC ? "text-yellow-400" : "text-white-600"
              } cursor-pointer font-semibold`}
              onClick={() => setIsCountyShowCC((prev) => !prev)}
            >
              181~200 {isCountyShowCC ? "▲" : "▼"}
            </h3>
            {isCountyShowCC && (
              <div className="space-y-4 ml-4">
                {section200.length > 0
                  ? renderGroupedHighways(section200)
                  : "No highways found"}
              </div>
            )}
          </div>
          <div className="space-y-4 ml-4">
            <h3
              className={`text-2xl ${
                isCountyShowCCXX ? "text-yellow-400" : "text-white-600"
              } cursor-pointer font-semibold`}
              onClick={() => setIsCountyShowCCXX((prev) => !prev)}
            >
              201~ {isCountyShowCCXX ? "▲" : "▼"}
            </h3>
            {isCountyShowCCXX && (
              <div className="space-y-4 ml-4">
                {section220.length > 0
                  ? renderGroupedHighways(section220)
                  : "No highways found"}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
