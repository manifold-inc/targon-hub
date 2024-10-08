"use client";

import { useState, useMemo } from "react";
import { reactClient } from "@/trpc/react";
import {
  generateFakeStats,
  getStatsForTimeframe,
  getTrendingModels,
} from "@/utils/utils";
import { Info } from "lucide-react";

export default function Page() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const {
    data: models,
    isLoading,
    error,
  } = reactClient.model.getModels.useQuery();

  const categories = useMemo(() => {
    if (!models) return [];
    const categorySet = new Set(models.flatMap(model => model.category));
    return Array.from(categorySet);
  }, [models]);

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
      <div className="relative isolate pt-6 lg:pt-8">
        <div className="mx-auto max-w-2xl pb-8 pt-16 sm:pt-24 lg:pt-28">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-manifold-green dark:text-gray-50 flex items-center justify-center">
              LLM Rankings
            </h1>
            <p className="flex items-center justify-center gap-2 mt-4 text-lg leading-8 text-gray-400 dark:text-gray-300">
              Compare models for{" "}
              <span className="font-bold">{selectedCategory}</span>
              {selectedCategory == "All Categories" ? "" : "Category"}
              <span
                className="relative ml-2"
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
              >
                <Info 
                  className={`h-5 w-5 text-gray-400 cursor-help ${isTooltipVisible ? 'text-manifold-green' : 'text-manifold-pink'}`} 
                />
                {isTooltipVisible && (
                  <div className="absolute z-10 w-64 p-4 mt-4 text-sm text-manifold-green bg-white text-left rounded-lg shadow-md dark:bg-gray-800 dark:text-manifold-pink -left-28">
                    <p>Shown are the sum of prompt and completion tokens per model, normalized using the GPT-4 tokenizer. Stats are updated every 10 minutes. </p>
                    <p>When a category is specified, it applies to prompts only, and token counts are approximate (5% of prompts are classified). </p>
                  </div>
                )}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mt-8">
        <button
          className={`px-4 py-2 rounded-full ${
            selectedCategory === "All Categories"
              ? "bg-manifold-green text-white dark:bg-manifold-pink/70 text-gray-800"
              : "bg-gray-200 text-manifold-green dark:bg-gray-800 dark:text-manifold-pink hover:bg-gray-300 hover:dark:bg-gray-700"
          }`}
          onClick={() => setSelectedCategory("All Categories")} >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category
                ? "bg-manifold-green text-white dark:bg-manifold-pink/70 text-gray-800"
                : "bg-gray-200 text-manifold-green dark:bg-gray-800 dark:text-manifold-pink hover:bg-gray-300 hover:dark:bg-gray-700"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}