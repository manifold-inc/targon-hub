"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tab } from '@headlessui/react';
import { useAuth } from "@/app/_components/providers";
import { reactClient } from "@/trpc/react";
import {
  generateFakeStats,
  getStatsForTimeframe,
  getTrendingModels,
} from "@/utils/utils";

const colors = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"
];

export default function RankingsPage() {
  const auth = useAuth();
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [selectedTab, setSelectedTab] = useState('today');

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
    () => getStatsForTimeframe(stats, "monthly"),
    [stats],
  );

  const formatData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = { date: new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) };
      }
      acc[item.date][item.modelName] = item.dailyTokens * 1000; // Scale up for visibility
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  const getTopModels = (timeframe) => {
    if (!models || !stats) return [];
    const filteredStats = getStatsForTimeframe(stats, timeframe);
    const totalTokens = filteredStats.reduce((sum, stat) => sum + stat.dailyTokens, 0);
    const meanTokens = totalTokens / filteredStats.length;
    const threshold = meanTokens * 0.2;

    console.log('filteredStats', filteredStats);
    const topModels = models
      .map(model => {
        const modelTokens = filteredStats
          .filter(stat => stat.modelName === model.name)
          .reduce((sum, stat) => sum + stat.dailyTokens, 0);
        return { ...model, totalTokens: modelTokens };
      })
      .sort((a, b) => b.totalTokens - a.totalTokens); // Sort from biggest to smallest

    const top10Models = topModels.slice(0, 10);
    const otherModels = topModels.slice(10);
    if (otherModels.length > 0) {
      top10Models.push({
        id: -1,
        name: "Other",
        category: "Other",
        totalTokens: otherModels.reduce((sum, model) => sum + model.totalTokens, 0),
      });
    }

    console.log('top10Models', top10Models);

    return top10Models;
  };

  const topModelsMonth = useMemo(() => getTopModels('monthly'), [models, stats]);

  const formattedData = useMemo(() => {
    const top10ModelNames = topModelsMonth.map(model => model.name);
    return formatData(dailyStats).map(entry => {
      const filteredEntry = { date: entry.date };
      top10ModelNames.forEach(name => {
        if (entry[name] !== undefined) {
          filteredEntry[name] = entry[name];
        }
      });
      // Add "Other" category if it exists
      if (entry["Other"] !== undefined) {
        filteredEntry["Other"] = entry["Other"];
      }
      return filteredEntry;
    });
  }, [dailyStats, topModelsMonth]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const totalTokens = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-white p-4 rounded shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatTokens(entry.value)}
            </p>
          ))}
          <p className="font-bold mt-2">
            Total: {formatTokens(totalTokens)}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatTokens = (tokens) => {
    if (tokens >= 1e9) {
      return (tokens / 1e9).toFixed(2) + 'B';
    } else if (tokens >= 1e6) {
      return (tokens / 1e6).toFixed(2) + 'M';
    } else if (tokens >= 1e3) {
      return (tokens / 1e3).toFixed(2) + 'K';
    } else {
      return tokens.toString();
    }
  };

  const topModelsToday = useMemo(() => getTopModels('daily'), [models, stats]);
  const topModelsWeek = useMemo(() => getTopModels('weekly'), [models, stats]);
  const trendingModels = useMemo(() => getTrendingModels(models, stats), [models, stats]);

  const tabContent = {
    today: topModelsToday,
    week: topModelsWeek,
    month: topModelsMonth,
    trending: trendingModels,
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-6xl py-32">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl mb-12 text-center">
          Welcome {auth.user || ""} to Rankings
        </h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Daily Token Usage</h2>
          <ResponsiveContainer width="100%" height={600}>
            <BarChart data={formattedData} barCategoryGap="0%">
              <XAxis dataKey="date" reversed={true} />
              <YAxis domain={[0, 'dataMax + 1000']} tickFormatter={formatTokens} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {topModelsMonth.map((model, index) => (
                <Bar
                  key={model.id}
                  dataKey={model.name}
                  stackId="a" // Ensure all bars share the same stackId
                  fill={colors[index % colors.length]}
                />
              ))}
              {/* Add a Bar for "Other" category */}
              <Bar
                key="other"
                dataKey="Other"
                stackId="a"
                fill={colors[topModelsMonth.length % colors.length]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-12">
          <Tab.Group onChange={(index) => setSelectedTab(['today', 'week', 'month', 'trending'][index])}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              {['Top today', 'Top this week', 'Top this month', 'Trending'].map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                    ${selected
                      ? 'bg-white shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    }`
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>

          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Top Used Models</h2>
            <ul className="space-y-2">
              {tabContent[selectedTab].map((model, index) => (
                <li key={model.id} className="flex justify-between items-center">
                  <span className="font-medium">{index + 1}. {model.name}</span>
                  <span className="text-gray-600">{formatTokens(model.totalTokens)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
