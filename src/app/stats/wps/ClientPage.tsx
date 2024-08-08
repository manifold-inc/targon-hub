"use client";

import { useState } from "react";
import { LineChart } from "@tremor/react";
import moment from "moment";
import { type RowList } from "postgres";

const ClientPage = ({ data }: { data: RowList<Record<string, unknown>[]> }) => {
  const cardStyles =
    "flex flex-col flex-grow bg-gray-500/5 p-8 shadow-md rounded-2xl hover:shadow-lg transition-all dark:hover:bg-gray-800";
  const [visibleCategories, setVisibleCategories] = useState<string[]>([
    "Peak_WPS",
    "Competitive_Min_WPS",
    "Percent_Change_Percentile_20_WPS",
  ]);

  const handleCategoryClick = (category: string) => () => {
    setVisibleCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category],
    );
  };

  const categoryColorMap: Record<string, string> = {
    Peak_WPS: "blue",
    Competitive_Min_WPS: "pink",
    Percent_Change_Percentile_20_WPS: "orange",
  };

  const textColor = (category: string, color: string) => {
    return visibleCategories.includes(category)
      ? color
      : "text-gray-400 dark:text-gray-600";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                Targon Validator Status
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Your hub for validator stats!
              </p>
            </div>
            <dl className="mt-12 flex flex-col space-y-4 text-center sm:flex-row sm:justify-between sm:gap-4 sm:space-y-0">
              <button
                onClick={handleCategoryClick("Competitive_Min_WPS")}
                className={cardStyles}
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                  Competitive Min WPS
                </dt>
                <dd
                  className={`order-first text-3xl font-semibold tracking-tight ${textColor(
                    "Competitive_Min_WPS",
                    "text-pink-500",
                  )}`}
                >
                  {data && data.length > 0
                    ? Number(data[data.length - 1]!.percentile_80_wps).toFixed(
                        2,
                      )
                    : "Loading..."}
                </dd>
              </button>

              <button
                onClick={handleCategoryClick("Peak_WPS")}
                className={cardStyles}
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                  Peak WPS
                </dt>
                <dd
                  className={`order-first text-3xl font-semibold tracking-tight ${textColor(
                    "Peak_WPS",
                    "text-blue-500",
                  )}`}
                >
                  {data && data.length > 0
                    ? Number(data[data.length - 1]!.max_wps).toFixed(2)
                    : "Loading..."}
                </dd>
              </button>

              <button
                onClick={handleCategoryClick(
                  "Percent_Change_Percentile_20_WPS",
                )}
                className={cardStyles}
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                  AVG WPS Growth %
                </dt>
                <dd
                  className={`order-first text-3xl font-semibold tracking-tight ${textColor(
                    "Percent_Change_Percentile_20_WPS",
                    "text-orange-500",
                  )}`}
                >
                  {data && data.length > 0
                    ? (
                        data.reduce(
                          (sum, item) =>
                            sum + Number(item.percent_change_percentile_80_wps),
                          0,
                        ) / data.length
                      ).toFixed(2) + "%"
                    : "Loading..."}
                </dd>
              </button>
            </dl>
          </div>
          <div className="pt-8">
            <div className="flex w-full flex-1 flex-col rounded-2xl bg-gray-500/5 p-8 shadow-md">
              <h3 className="pb-4 text-center text-2xl font-semibold text-gray-800 dark:text-gray-50">
                Stats for Targon V2
              </h3>
              <LineChart
                data={(data ?? []).map((s) => ({
                  day: moment(s.day as string).format("MMMM Do YYYY"),
                  Peak_WPS: Number(s.max_wps).toFixed(2),
                  Competitive_Min_WPS: Number(s.percentile_80_wps).toFixed(2),
                  Percent_Change_Percentile_20_WPS: Number(
                    s.percent_change_percentile_80_wps,
                  ).toFixed(2),
                }))}
                index="day"
                noDataText="Loading..."
                xAxisLabel="Day"
                categories={visibleCategories}
                colors={
                  visibleCategories.map(
                    (category) => categoryColorMap[category],
                  ) as string[]
                }
                yAxisWidth={40}
                showLegend={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
