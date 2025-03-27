import { useState } from "react";
import { motion } from "framer-motion";

import { CREDIT_PER_DOLLAR } from "@/constants";
import { reactClient } from "@/trpc/react";
import { formatModelName, getColorTheme } from "./ModelPerformanceOverview";

const formatTokenCount = (tokens: number) => {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(2)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}k`;
  }
  return tokens.toString();
};

type HoverData = {
  value: number;
  tps: number | null;
  day: string;
  index: number;
} | null;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

export const ModelPerformanceDetail = ({
  modelName,
  colorIndex,
}: {
  modelName: string;
  colorIndex: number;
}) => {
  const [hoverData, setHoverData] = useState<HoverData>(null);
  const { data: modelStats } =
    reactClient.model.getModelDailyStats.useQuery(modelName);

  // return null if no data or while loading. Looks better than a loading spinner.
  if (!modelStats) return null;

  // Sort by date to ensure correct order
  const sortedStats = [...modelStats].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const totalTokens = sortedStats.reduce(
    (sum, stat) => sum + stat.totalTokens,
    0,
  );
  const avgTPS =
    sortedStats.reduce((sum, stat) => sum + (stat.avgTPS || 0), 0) /
    sortedStats.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      {/* Model Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {formatModelName(modelName)}
          </h3>
          <p className="text-sm text-gray-500">by {modelName.split("/")[0]}</p>
        </div>
      </div>

      {/* Model Stats Grid */}
      <div className="grid grid-cols-3 gap-1.5 pt-2 sm:gap-3">
        <div
          className={`rounded-lg bg-gradient-to-br ${getColorTheme(colorIndex).stats} p-2 sm:p-3`}
        >
          <div className={`text-xs ${getColorTheme(colorIndex).text}`}>
            Total Tokens in Last 7 Days
          </div>
          <div className="pt-0.5 text-sm font-semibold text-gray-900 sm:pt-1 sm:text-base">
            {formatTokenCount(totalTokens)} tokens
          </div>
        </div>
        <div
          className={`rounded-lg bg-gradient-to-br ${getColorTheme(colorIndex).stats} p-2 sm:p-3`}
        >
          <div className={`text-xs ${getColorTheme(colorIndex).text}`}>
            Average TPS (7 days)
          </div>
          <div className="pt-0.5 text-sm font-semibold text-gray-900 sm:pt-1 sm:text-base">
            {avgTPS === 0 ? "N/A" : `${avgTPS.toFixed(1)} TPS`}
          </div>
        </div>
        <div
          className={`rounded-lg bg-gradient-to-br ${getColorTheme(colorIndex).stats} p-2 sm:p-3`}
        >
          <div className={`text-xs ${getColorTheme(colorIndex).text}`}>
            Cost
          </div>
          <div className="pt-0.5 text-sm font-semibold text-gray-900 sm:pt-1 sm:text-base">
            {modelStats[0]?.cpt
              ? `$${((modelStats[0].cpt * 1_000_000) / CREDIT_PER_DOLLAR).toFixed(2)} / M Tokens`
              : "Free"}
          </div>
        </div>
      </div>

      {/* Daily Performance Chart */}
      <div className="flex-1 pt-2">
        <div className="py-2 text-xs font-medium text-gray-600">
          Usage Over Last 7 Days
        </div>
        <div className="grid grid-cols-7 gap-0">
          {sortedStats.map((stat, i) => (
            <div key={i} className="relative">
              <div className="h-28">
                <div
                  className="relative h-full w-full"
                  onMouseEnter={() => {
                    setHoverData({
                      value: stat.totalTokens,
                      tps: stat.avgTPS,
                      day: formatDate(stat.createdAt.toISOString()),
                      index: i,
                    });
                  }}
                  onMouseLeave={() => setHoverData(null)}
                >
                  <motion.div
                    className={`absolute bottom-0 left-1/2 w-[80%] -translate-x-1/2 rounded-sm ${
                      getColorTheme(colorIndex).bar
                    } transition-opacity ${
                      hoverData?.index === i ? "opacity-100" : "opacity-80"
                    }`}
                    initial={{ height: 0 }}
                    animate={{
                      height: `${
                        (stat.totalTokens /
                          Math.max(...sortedStats.map((s) => s.totalTokens))) *
                        100
                      }%`,
                    }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                  {hoverData?.index === i && (
                    <div className="absolute bottom-20 w-full">
                      <div className="relative left-1/2 flex -translate-x-1/2 items-center justify-center">
                        <div
                          className={`relative flex flex-col gap-1 whitespace-nowrap rounded-md bg-mf-milk-500 px-2.5 py-1.5 text-xs font-medium shadow-lg ring-1 ring-gray-100`}
                        >
                          <span className={getColorTheme(colorIndex).text}>
                            {formatTokenCount(hoverData.value)} tokens
                          </span>
                          <span className={getColorTheme(colorIndex).text}>
                            {hoverData.tps === null
                              ? "No TPS data"
                              : `${hoverData.tps.toFixed(1)} TPS`}
                          </span>
                          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[1px] border-[5px] border-transparent border-t-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-2 text-center text-xs text-gray-500">
                {formatDate(stat.createdAt.toISOString())}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
