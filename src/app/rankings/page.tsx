"use client";

import { useMemo } from "react";

import { useAuth } from "@/app/_components/providers";
import { reactClient } from "@/trpc/react";
import {
  generateFakeStats,
  getStatsForTimeframe,
  getTrendingModels,
} from "@/utils/utils";

export default function Page() {
  const auth = useAuth();

  const {
    data: models,
    isLoading,
    error,
  } = reactClient.model.getModels.useQuery();

  const stats = useMemo(() => {
    if (models) {
      return generateFakeStats(models);
    }
    return [];
  }, [models]);

  const dailyStats = useMemo(
    () => getStatsForTimeframe(stats, "daily"),
    [stats],
  );
  const weeklyStats = useMemo(
    () => getStatsForTimeframe(stats, "weekly"),
    [stats],
  );
  const monthlyStats = useMemo(
    () => getStatsForTimeframe(stats, "monthly"),
    [stats],
  );
  const trendingModels = useMemo(() => getTrendingModels(stats), [stats]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl">
              Welcome {auth.user || ""} to rankings
            </h1>
            <h2>Daily Stats</h2>
            {dailyStats.map((stat) => (
              <div key={`${stat.modelId}-daily`}>
                <h3>{stat.modelName}</h3>
                <p>Daily Tokens: {stat.dailyTokens}</p>
                <p>Trend Score: {stat.trendScore.toFixed(2)}</p>
              </div>
            ))}
            <h2>Weekly Stats</h2>
            {weeklyStats.map((stat) => (
              <div key={`${stat.modelId}-weekly`}>
                <h3>{stat.modelName}</h3>
                <p>Weekly Tokens: {stat.weeklyTokens}</p>
                <p>Trend Score: {stat.trendScore.toFixed(2)}</p>
              </div>
            ))}
            <h2>Monthly Stats</h2>
            {monthlyStats.map((stat) => (
              <div key={`${stat.modelId}-weekly`}>
                <h3>{stat.modelName}</h3>
                <p>Monthly Tokens: {stat.monthlyTokens}</p>
                <p>Trend Score: {stat.trendScore.toFixed(2)}</p>
              </div>
            ))}
            <h2>Trending Models</h2>
            {trendingModels.map((model) => (
              <div key={`${model.modelId}-trending`}>
                <h3>{model.modelName}</h3>
                <p>Trend Score: {model.trendScore.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
