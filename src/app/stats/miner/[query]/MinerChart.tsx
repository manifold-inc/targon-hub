"use client";

import { useState } from "react";
import { LineChart } from "@tremor/react";

import { reactClient } from "@/trpc/react";
import KeysTable from "./KeysTable";
import ResponseComparison from "./ResponseComparison";

interface MinerChartProps {
  query: string;
  block: number;
}

export interface Keys {
  hotkey: string;
  coldkey: string;
}

const MinerChart: React.FC<MinerChartProps> = ({ query, block }) => {
  const cardStyles =
    "flex flex-col flex-grow bg-white dark:bg-neutral-800 p-8 shadow-md rounded-2xl hover:shadow-lg transition-all dark:hover:bg-gray-800 text-center items-center";
  const [visibleCategories, setVisibleCategories] = useState<string[]>([
    "jaro_score",
    "total_time",
    "words_per_second",
    "time_for_all_tokens",
    "time_to_first_token",
  ]);

  const minerStats = reactClient.miner.stats.useQuery(
    { query, block },
    { enabled: !!query.length },
  );

  if (minerStats.isLoading) {
    return <p>Loading Data...</p>;
  }

  const handleCategoryClick = (category: string) => () => {
    setVisibleCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category],
    );
  };

  const categoryColorMap: Record<string, string> = {
    jaro_score: "blue",
    total_time: "red",
    words_per_second: "green",
    time_for_all_tokens: "purple",
    time_to_first_token: "orange",
  };
  const textColor = (category: string, color: string) => {
    return visibleCategories.includes(category)
      ? color
      : "text-gray-400 dark:text-gray-600";
  };

  const miners = new Map<number, Keys>();
  minerStats.data?.forEach((m) => {
    miners.set(m.uid, { hotkey: m.hotkey, coldkey: m.coldkey });
  });

  return (
    <>
      {!!minerStats.data?.length && (
        <>
          <dl className=" flex justify-between gap-4 text-center">
            <button
              onClick={handleCategoryClick("jaro_score")}
              className={cardStyles}
            >
              <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                Average Jaro Score
              </dt>
              <dd
                className={`order-first text-3xl font-semibold tracking-tight ${textColor(
                  "jaro_score",
                  "text-blue-500",
                )}`}
              >
                {minerStats
                  ? (
                      minerStats.data.reduce((s, d) => s + d.jaro_score, 0) /
                      minerStats.data.length
                    ).toFixed(2)
                  : "_"}
              </dd>
            </button>

            <button
              onClick={handleCategoryClick("total_time")}
              className={cardStyles}
            >
              <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                Average Total Time
              </dt>
              <dd
                className={`order-first flex text-3xl font-semibold tracking-tight ${textColor(
                  "total_time",
                  "text-red-500",
                )}`}
              >
                {minerStats
                  ? (
                      minerStats.data.reduce((s, d) => s + d.total_time, 0) /
                      minerStats.data.length
                    ).toFixed(2)
                  : "_"}
              </dd>
            </button>

            <button
              onClick={handleCategoryClick("words_per_second")}
              className={cardStyles}
            >
              <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                Average Words Per Second
              </dt>
              <dd
                className={`order-first text-3xl font-semibold tracking-tight ${textColor(
                  "words_per_second",
                  "text-green-500",
                )}`}
              >
                {minerStats
                  ? (
                      minerStats.data.reduce(
                        (s, d) => s + d.words_per_second,
                        0,
                      ) / minerStats.data.length
                    ).toFixed(2)
                  : "_"}
              </dd>
            </button>

            <button
              onClick={handleCategoryClick("time_for_all_tokens")}
              className={cardStyles}
            >
              <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                Average Time For All tokens
              </dt>
              <dd
                className={`order-first text-3xl font-semibold tracking-tight ${textColor(
                  "time_for_all_tokens",
                  "text-purple-500",
                )}`}
              >
                {minerStats
                  ? (
                      minerStats.data.reduce(
                        (s, d) => s + d.time_for_all_tokens,
                        0,
                      ) / minerStats.data.length
                    ).toFixed(2)
                  : "_"}
              </dd>
            </button>

            <button
              onClick={handleCategoryClick("time_to_first_token")}
              className={cardStyles}
            >
              <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                Average Time To First Token
              </dt>
              <dd
                className={`order-first text-3xl font-semibold tracking-tight ${textColor(
                  "time_to_first_token",
                  "text-orange-500",
                )}`}
              >
                {minerStats
                  ? (
                      minerStats.data.reduce(
                        (s, d) => s + d.time_to_first_token,
                        0,
                      ) / minerStats.data.length
                    ).toFixed(2)
                  : "_"}
              </dd>
            </button>
          </dl>

          <div className="pt-8">
            <div className="flex w-full flex-grow flex-col items-center rounded-2xl bg-white p-8 text-center shadow-md transition-all hover:shadow-lg dark:bg-neutral-800">
              <h3 className="pb-4 text-center text-2xl font-semibold text-gray-800 dark:text-gray-50">
                Viewing Stats For: {query}
              </h3>
              <LineChart
                data={minerStats.data}
                index="block"
                xAxisLabel="Time"
                categories={visibleCategories}
                colors={visibleCategories.map(
                  (category) => categoryColorMap[category]!,
                )}
                yAxisWidth={40}
                className="mt-4"
                showLegend={false}
              />
            </div>
          </div>
        </>
      )}
      <div className="flex flex-col gap-4 pt-8">
        <div className="flex-1">
          <KeysTable miners={miners} />
        </div>
        <div className="flex-1 pt-8">
          <ResponseComparison query={query} />
        </div>
      </div>
    </>
  );
};

export default MinerChart;
