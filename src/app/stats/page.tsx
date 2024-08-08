"use client";

import { useState } from "react";
import { Field, Label, Switch } from "@headlessui/react";
import { LineChart } from "@tremor/react";
import moment from "moment";

import { reactClient } from "@/trpc/react";

export const dynamic = "force-dynamic";

const Page = () => {
  const cardStyles =
    "flex flex-col flex-grow bg-gray-500/5 p-8 shadow-md rounded-2xl hover:shadow-lg transition-all dark:hover:bg-gray-800";
  const [verified, setVerified] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState<string[]>([
    "avg_jaro",
    "avg_wps",
    "avg_total_time",
    "avg_time_to_first_token",
  ]);

  const { data } = reactClient.miner.globalAvgStats.useQuery(
    { verified },
    { keepPreviousData: false },
  );
  const handleCategoryClick = (category: string) => () => {
    setVisibleCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category],
    );
  };

  const categoryColorMap: Record<string, string> = {
    avg_jaro: "blue",
    avg_wps: "red",
    avg_total_time: "green",
    avg_time_to_first_token: "purple",
  };
  const textColor = (category: string, color: string) => {
    return visibleCategories.includes(category)
      ? color
      : "text-gray-400 dark:text-gray-600";
  };
  return (
    <div className="mx-auto max-w-7xl px-12 pb-12">
      <div className="py-24 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                Targon Validator Status
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Your hub for validator stats!
              </p>
            </div>
            <dl className="mt-16 flex justify-between gap-4 text-center">
              <button
                onClick={handleCategoryClick("avg_wps")}
                className={cardStyles}
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                  Peak Words Per Second
                </dt>
                <dd
                  className={`order-first text-3xl font-semibold tracking-tight ${textColor(
                    "avg_wps",
                    "text-red-500",
                  )}`}
                >
                  {data
                    ? Math.max(...data.map((d) => d.avg_wps)).toFixed(0)
                    : "_"}
                </dd>
              </button>

              <button
                onClick={handleCategoryClick("avg_jaro")}
                className={cardStyles}
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                  Average Jaro
                </dt>
                <dd
                  className={`order-first text-3xl font-semibold tracking-tight ${textColor(
                    "avg_jaro",
                    "text-blue-500",
                  )}`}
                >
                  {data
                    ? (
                        data.reduce((s, d) => s + d.avg_jaro, 0) / data.length
                      ).toFixed(2)
                    : "_"}
                </dd>
              </button>

              <button
                onClick={handleCategoryClick("avg_total_time")}
                className={cardStyles}
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                  Min Total Time
                </dt>
                <dd
                  className={`order-first text-3xl font-semibold tracking-tight ${textColor(
                    "avg_total_time",
                    "text-green-500",
                  )}`}
                >
                  {data
                    ? Math.min(...data.map((d) => d.avg_total_time)).toFixed(
                        2,
                      ) + "s"
                    : "_"}
                </dd>
              </button>

              <button
                onClick={handleCategoryClick("avg_time_to_first_token")}
                className={cardStyles}
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                  Avg Time to First Token
                </dt>
                <dd
                  className={`order-first text-3xl font-semibold tracking-tight ${textColor(
                    "avg_time_to_first_token",
                    "text-purple-500",
                  )}`}
                >
                  {data
                    ? Math.min(
                        ...data.map((d) => d.avg_time_to_first_token),
                      ).toFixed(2) + "s"
                    : "_"}
                </dd>
              </button>
            </dl>
          </div>
          <div className="pt-8">
            <div
              className={`flex w-full flex-1 flex-col rounded-2xl bg-gray-500/5 p-8 shadow-md sm:w-full`}
            >
              <h3 className="pb-4 text-center text-2xl font-semibold text-gray-800 dark:text-gray-50">
                Avg stats last 2 hours
              </h3>
              <LineChart
                data={(data ?? []).map((s) => ({
                  ...s,
                  minute: moment(s.minute).format("LT"),
                }))}
                index="minute"
                noDataText="Loading..."
                xAxisLabel="Time"
                categories={visibleCategories}
                colors={visibleCategories.map(
                  (category) => categoryColorMap[category]!,
                )}
                yAxisWidth={40}
                showLegend={false}
              />
              <div className="flex flex-wrap items-center justify-end gap-3 pb-2 pt-4">
                <Field className="flex items-center py-2">
                  <Switch
                    checked={verified}
                    onChange={setVerified}
                    className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 data-[checked]:bg-blue-600"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                    />
                  </Switch>
                  <Label as="span" className="ml-3 text-sm">
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                      Verified Only
                    </span>
                  </Label>
                </Field>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
