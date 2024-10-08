"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import {
  type NameType,
  type ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { reactClient } from "@/trpc/react";
import { generateFakeStats } from "@/utils/utils";

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active ?? payload) {
    const total = payload!.reduce((sum, entry) => sum + entry.value, 0);

    return (
      <div className="rounded-lg bg-black p-4 text-white shadow-lg">
        <p className="mb-2 font-bold">{label}</p>
        {payload!.map((entry, index) => (
          <div key={index} className="mb-1 flex items-center justify-between">
            <span className="flex items-center">
              <span
                className="mr-2 h-3 w-3"
                style={{ backgroundColor: entry.color }}
              ></span>
              {entry.name}
            </span>
            <span className="ml-4 font-bold">{entry.value.toFixed(2)}B</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-gray-600 pt-2">
          <span>Total</span>
          <span className="font-bold">{total.toFixed(2)}B</span>
        </div>
      </div>
    );
  }

  return null;
};

const formatAxisLabel = (value: number) => {
  if (value >= 1000000000000) {
    return `${(value / 1000000000000).toFixed(1)}T`;
  } else if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else {
    return value.toString();
  }
};

const formatXAxisDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "MMM d");
};

// Add this function to control which ticks are shown
const customTickFormatter = (value: string, index: number) => {
  if (index % 4 === 0) {
    return formatXAxisDate(value);
  }
  return "";
};

export default function Page() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly" | "trending"
  >("daily");

  const {
    data: models,
    isLoading,
    error,
  } = reactClient.model.getModels.useQuery();

  const categories = models
    ? Array.from(new Set(models.flatMap((model) => model.category)))
    : [];

  const stats = useMemo(
    () => (models ? generateFakeStats(models) : []),
    [models],
  );

  const filteredStats = useMemo(() => {
    if (!stats || !models) return [];
    return stats.filter(
      (stat) =>
        selectedCategory === "All Categories" ||
        models.find((m) => m.name === stat.modelName)?.category ===
          selectedCategory,
    );
  }, [stats, models, selectedCategory]);

  const dailyStats = useMemo(() => {
    if (filteredStats.length > 0) {
      const groupedByDate = filteredStats.reduce<
        Record<string, Record<string, number>>
      >((acc, stat) => {
        if (
          !stat.date ||
          !stat.modelName ||
          typeof stat.dailyTokens !== "number"
        ) {
          console.warn("Invalid stat entry:", stat);
          return acc;
        }

        const parsedDate = new Date(stat.date);
        if (isNaN(parsedDate.getTime())) {
          console.warn("Invalid date format:", stat.date);
          return acc;
        }

        const date = parsedDate.toISOString().split("T")[0];

        if (date) {
          if (!acc[date]) {
            acc[date] = {};
          }
          acc[date][stat.modelName] =
            (acc[date][stat.modelName] || 0) + stat.dailyTokens;
        }
        return acc;
      }, {});

      return Object.entries(groupedByDate)
        .map(([date, dayStats]) => {
          // Get top 5 models for this specific day
          const top5Models = Object.entries(dayStats)
            .filter(([key]) => key !== "date")
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([model]) => model);

          const processedStats: Record<string, number | string> = { date };
          let otherTotal = 0;

          Object.entries(dayStats).forEach(([model, usage]) => {
            if (model !== "date") {
              if (top5Models.includes(model)) {
                processedStats[model] = usage;
              } else {
                otherTotal += usage;
              }
            }
          });

          processedStats.Other = otherTotal;
          return processedStats;
        })
        .sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateA - dateB;
        });
    }
    return [];
  }, [filteredStats]);

  const modelNames = useMemo(() => {
    if (dailyStats.length > 0) {
      const allNames = new Set<string>();
      dailyStats.forEach((day) => {
        Object.keys(day).forEach((key) => {
          if (key !== "date") allNames.add(key);
        });
      });
      return Array.from(allNames);
    }
    return [];
  }, [dailyStats]);

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ];

  const topModels = useMemo(() => {
    if (!filteredStats || filteredStats.length === 0) return [];

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    const modelTotals = filteredStats.reduce(
      (acc, stat) => {
        const statDate = new Date(stat.date);
        const timeDiff = now.getTime() - statDate.getTime();

        if (selectedPeriod === "trending") {
          // For trending, we'll compare this week to last week
          if (timeDiff <= oneWeek) {
            if (!acc[stat.modelName]) {
              acc[stat.modelName] = { thisWeek: 0, lastWeek: 0 };
            }
            acc[stat.modelName]!.thisWeek += stat.dailyTokens;
          } else if (timeDiff <= 2 * oneWeek) {
            if (!acc[stat.modelName]) {
              acc[stat.modelName] = { thisWeek: 0, lastWeek: 0 };
            }
            acc[stat.modelName]!.lastWeek += stat.dailyTokens;
          }
        } else {
          // Existing logic for other periods
          if (
            (selectedPeriod === "daily" && timeDiff <= oneDay) ||
            (selectedPeriod === "weekly" && timeDiff <= oneWeek) ||
            (selectedPeriod === "monthly" && timeDiff <= 30 * oneDay)
          ) {
            if (!acc[stat.modelName]) {
              acc[stat.modelName] = { thisWeek: 0, lastWeek: 0 };
            }
            acc[stat.modelName]!.thisWeek += stat.dailyTokens;
          }
        }
        return acc;
      },
      {} as Record<string, { thisWeek: number; lastWeek: number }>,
    );

    if (selectedPeriod === "trending") {
      return Object.entries(modelTotals)
        .map(([modelName, { thisWeek, lastWeek }]) => ({
          modelName,
          growthRate: lastWeek > 0 ? (thisWeek - lastWeek) / lastWeek : 0,
          totalTokens: thisWeek,
        }))
        .sort((a, b) => b.growthRate - a.growthRate)
        .slice(0, 20)
        .map((model, index) => ({ ...model, rank: index + 1 }));
    } else {
      return Object.entries(modelTotals)
        .sort(([, a], [, b]) => b.thisWeek - a.thisWeek)
        .slice(0, 20)
        .map(([modelName, totalTokens], index) => ({
          modelName,
          totalTokens,
          rank: index + 1,
        }));
    }
  }, [filteredStats, selectedPeriod]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative isolate lg:pt-8">
        <div className="mx-auto max-w-2xl py-8 ">
          <div className="text-center">
            <h1 className="flex items-center justify-center text-2xl font-bold tracking-tight text-manifold-green dark:text-gray-50">
              LLM Rankings
            </h1>
            <p className="mt-4 flex items-center justify-center gap-2 text-lg leading-8 text-gray-400 dark:text-gray-300">
              Compare models for{" "}
              <span className="font-bold">{selectedCategory}</span>
              {selectedCategory == "All Categories" ? "" : "Category"}
              <span
                className="relative ml-2"
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
              >
                <Info
                  className={`h-5 w-5 cursor-help ${isTooltipVisible ? "text-manifold-green" : "text-manifold-pink"}`}
                />
                {isTooltipVisible && (
                  <div className="absolute -left-28 z-10 mt-4 w-64 rounded-lg bg-white p-4 text-left text-sm text-manifold-green shadow-md dark:bg-gray-800 dark:text-manifold-pink">
                    <p>
                      Shown are the sum of prompt and completion tokens per
                      model, normalized using the GPT-4 tokenizer. Stats are
                      updated every 10 minutes.{" "}
                    </p>
                    <p>
                      When a category is specified, it applies to prompts only,
                      and token counts are approximate (5% of prompts are
                      classified).{" "}
                    </p>
                  </div>
                )}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className=" flex flex-wrap justify-center gap-2">
        <button
          className={`rounded-full px-4 py-2 ${
            selectedCategory === "All Categories"
              ? "bg-manifold-green text-gray-800 text-white dark:bg-manifold-pink/70"
              : "bg-gray-200 text-manifold-green hover:bg-gray-300 dark:bg-gray-800 dark:text-manifold-pink hover:dark:bg-gray-700"
          }`}
          onClick={() => setSelectedCategory("All Categories")}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`rounded-full px-4 py-2 ${
              selectedCategory === category
                ? "bg-manifold-green text-gray-800 text-white dark:bg-manifold-pink/70"
                : "bg-gray-200 text-manifold-green hover:bg-gray-300 dark:bg-gray-800 dark:text-manifold-pink hover:dark:bg-gray-700"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex w-full items-center justify-center pt-8">
        <div className="w-1/2">
          <h2 className="mb-4 flex items-center justify-center text-2xl font-bold tracking-tight text-manifold-green dark:text-gray-50">
            Daily Token Usage (Top 5 Models) - {selectedCategory}
          </h2>
          {dailyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={dailyStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="date"
                  tickFormatter={customTickFormatter}
                  interval={0}
                />
                <YAxis
                  orientation="left"
                  tickFormatter={formatAxisLabel}
                  domain={[0, "dataMax"]}
                />
                <Tooltip content={<CustomTooltip />} />
                {modelNames.map((model, index) => (
                  <Bar
                    key={model}
                    dataKey={model}
                    stackId="a"
                    fill={
                      model === "Other"
                        ? "#999999"
                        : colors[index % colors.length]
                    }
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">
              No data available for the selected category.
            </p>
          )}
        </div>
      </div>

      <div className="w-1/2 border-t border-gray-200 dark:border-white/10" />
      <div className="w-full max-w-md rounded-lg bg-manifold-grey2 p-2 dark:bg-manifold-grey1-800">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod("daily")}
            className={`flex-1 rounded-lg py-4 text-manifold-green transition-colors duration-200 ${
              selectedPeriod === "daily"
                ? "bg-manifold-green text-gray-800 text-white dark:bg-manifold-pink/70"
                : "bg-gray-200 text-manifold-green hover:bg-gray-300 dark:bg-gray-800 dark:text-manifold-pink hover:dark:bg-gray-700"
            }`}
          >
            Top Today
          </button>
          <button
            onClick={() => setSelectedPeriod("weekly")}
            className={`flex-1 rounded-lg py-4 text-manifold-green transition-colors duration-200 ${
              selectedPeriod === "weekly"
                ? "bg-manifold-green text-gray-800 text-white dark:bg-manifold-pink/70"
                : "bg-gray-200 text-manifold-green hover:bg-gray-300 dark:bg-gray-800 dark:text-manifold-pink hover:dark:bg-gray-700"
            }`}
          >
            Top This Week
          </button>
          <button
            onClick={() => setSelectedPeriod("monthly")}
            className={`flex-1 rounded-lg py-4 text-manifold-green transition-colors duration-200 ${
              selectedPeriod === "monthly"
                ? "bg-manifold-green text-gray-800 text-white dark:bg-manifold-pink/70"
                : "bg-gray-200 text-manifold-green hover:bg-gray-300 dark:bg-gray-800 dark:text-manifold-pink hover:dark:bg-gray-700"
            }`}
          >
            Top This Month
          </button>
          <button
            onClick={() => setSelectedPeriod("trending")}
            className={`flex-1 rounded-lg py-4 text-manifold-green transition-colors duration-200 ${
              selectedPeriod === "trending"
                ? "bg-manifold-green text-gray-800 text-white dark:bg-manifold-pink/70"
                : "bg-gray-200 text-manifold-green hover:bg-gray-300 dark:bg-gray-800 dark:text-manifold-pink hover:dark:bg-gray-700"
            }`}
          >
            Trending
          </button>
        </div>
      </div>

      {/* New section for top 20 models list */}
      <div className="mt-8 w-full max-w-2xl">
        <h3 className="mb-4 text-center text-xl font-bold text-manifold-green dark:text-gray-50">
          Top 20 Models by{" "}
          {selectedPeriod === "trending" ? "Growth Rate" : "Token Usage"} -{" "}
          {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
        </h3>
        <ul className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          {topModels.map((model) => (
            <li
              key={model.modelName}
              className="flex items-center justify-between border-b border-gray-200 px-6 py-4 last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                <span className="mr-4 w-8 text-right text-sm text-gray-500 dark:text-gray-400">
                  {model.rank}.
                </span>
                <Link
                  href={`/models/${model.modelName}/`}
                  className="font-medium text-gray-900 dark:text-white"
                >
                  {model.modelName}
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {selectedPeriod === "trending" && (
                  <div className="flex items-center">
                    {"growthRate" in model ? (
                      model.growthRate > 0 ? (
                        <ChevronUp className="mr-1 h-5 w-5 text-green-500" />
                      ) : model.growthRate < 0 ? (
                        <ChevronDown className="mr-1 h-5 w-5 text-red-500" />
                      ) : null
                    ) : null}
                    <span
                      className={`text-sm ${
                        "growthRate" in model && model.growthRate > 0
                          ? "text-green-500"
                          : "growthRate" in model && model.growthRate < 0
                            ? "text-red-500"
                            : "text-gray-500"
                      }`}
                    >
                      {"growthRate" in model
                        ? (model.growthRate * 100).toFixed(2) + "%"
                        : "N/A"}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {typeof model.totalTokens === "object"
                    ? model.totalTokens.thisWeek
                    : model.totalTokens}{" "}
                  tokens
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
