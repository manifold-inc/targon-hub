"use client";

import { useState, useMemo } from "react";
import { reactClient } from "@/trpc/react";
import {
  generateFakeStats,
  getStatsForTimeframe,
  getTrendingModels,
} from "@/utils/utils";
import { Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    
    return (
      <div className="bg-black text-white p-4 rounded-lg shadow-lg">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center mb-1">
            <span className="flex items-center">
              <span className="w-3 h-3 mr-2" style={{ backgroundColor: entry.color }}></span>
              {entry.name}
            </span>
            <span className="ml-4 font-bold">{entry.value.toFixed(2)}B</span>
          </div>
        ))}
        <div className="border-t border-gray-600 mt-2 pt-2 flex justify-between">
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
  } else {
    return value.toString();
  }
};

const formatXAxisDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'MMM d');
};

// Add this function to control which ticks are shown
const customTickFormatter = (value: string, index: number) => {
  if (index % 4 === 0) {
    return formatXAxisDate(value);
  }
  return '';
};

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

  const dailyStats = useMemo(() => {
    if (stats.length > 0) {
      const groupedByDate = stats.reduce<Record<string, { date: string; [key: string]: number }>>((acc, stat) => {
        const date = new Date(stat.date).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date };
        }
        acc[date][stat.modelName] = (acc[date][stat.modelName] || 0) + stat.dailyTokens;
        return acc;
      }, {});

      // Get the top 5 models based on total usage
      const totalUsageByModel = Object.values(groupedByDate).reduce((acc, dayStats) => {
        Object.entries(dayStats).forEach(([model, usage]) => {
          if (model !== 'date') {
            acc[model] = (acc[model] || 0) + (usage as number);
          }
        });
        return acc;
      }, {} as Record<string, number>);

      const top5Models = Object.entries(totalUsageByModel)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([model]) => model);

      // Process the data to include top 5 and "Other"
      return Object.values(groupedByDate).map(dayStats => {
        const processedStats: { [key: string]: number | string } = { date: dayStats.date };
        let otherTotal = 0;

        Object.entries(dayStats).forEach(([model, usage]) => {
          if (model !== 'date') {
            if (top5Models.includes(model)) {
              processedStats[model] = usage as number;
            } else {
              otherTotal += usage as number;
            }
          }
        });

        processedStats['Other'] = otherTotal;
        return processedStats;
      }).sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime());
    }
    return [];
  }, [stats]);

  console.log("Processed Daily Stats:", dailyStats);

  const weeklyStats = useMemo(
    () => getStatsForTimeframe(stats, "weekly"),
    [stats],
  );
  const monthlyStats = useMemo(
    () => getStatsForTimeframe(stats, "monthly"),
    [stats],
  );
  const trendingModels = useMemo(() => getTrendingModels(stats), [stats]);

  const modelNames = useMemo(() => {
    if (dailyStats.length > 0) {
      return Object.keys(dailyStats[0]).filter(key => key !== 'date');
    }
    return [];
  }, [dailyStats]);

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'
  ];

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
      
      <div className="py-8 flex justify-center items-center">
        <div className="w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-4 text-center">Daily Token Usage (Top 5 Models)</h2>
          {dailyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={customTickFormatter}
                  interval={0}
                />
                <YAxis 
                  orientation="left"
                  tickFormatter={formatAxisLabel}
                  domain={[0, 'dataMax']}
                />
                <Tooltip content={<CustomTooltip />} />
                {modelNames.map((model, index) => (
                  <Bar 
                    key={model} 
                    dataKey={model} 
                    stackId="a" 
                    fill={model === 'Other' ? '#999999' : colors[index % colors.length]} 
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">No data available for the chart.</p>
          )}
        </div>
      </div>
    </div>
  );
}
