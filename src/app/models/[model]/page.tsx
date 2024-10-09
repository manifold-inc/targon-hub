"use client";

import { useMemo } from "react";
import { reactClient } from "@/trpc/react";
import { getTrendingModels, type ModelStats } from "@/utils/utils";
import { usePathname } from 'next/navigation';

// Define a type for the model data
type ModelData = {
  id: string;
  name: string;
  category: string;
  maxOutput?: number;
  input?: string;
  output?: string;
  latency?: number;
  throughput?: number;
  tokens?: number;
};

export default function Page() {
  const { data: models, isLoading, error } = reactClient.model.getModels.useQuery();
  const pathname = usePathname();
  
  const trendingModels = useMemo(() => {
    if (models) {
      const modelStats: ModelStats[] = models.map(model => ({
        modelId: model.id,
        modelName: model.name || '',
        category: model.category || 'Unknown',
        dailyTokens: 0,
        weeklyTokens: 0,
        monthlyTokens: 0,
        totalTokens: 0,
        trendScore: 0,
        date: new Date().toISOString(),
      }));
      return getTrendingModels(modelStats);
    }
    return [];
  }, [models]);

  // Generate fake data for display purposes
  const displayModels: ModelData[] = useMemo(() => {
    return trendingModels.map(model => ({
      id: model.modelId.toString(),
      name: model.modelName,
      category: model.category,
      maxOutput: Math.floor(Math.random() * 1000) + 1000,
      input: `${Math.floor(Math.random() * 100) + 50}K`,
      output: `${Math.floor(Math.random() * 100) + 50}K`,
      latency: Math.random() * 100,
      throughput: Math.floor(Math.random() * 1000) + 500,
      tokens: model.dailyTokens,
    }));
  }, [trendingModels]);


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-6xl py-32">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Providers for {pathname.split('/').pop()}</h2>
          <ul className="space-y-4">
            {displayModels.map((model) => (
              <li key={model.id} className="flex justify-between items-center">
                <span className="font-medium">{model.name}</span>
                <span className="text-gray-600">Max Output: {model.maxOutput}</span>
                <span className="text-gray-600">Input: {model.input}</span>
                <span className="text-gray-600">Output: {model.output}</span>
                <span className="text-gray-600">Latency: {model.latency?.toFixed(2)}ms</span>
                <span className="text-gray-600">Throughput: {model.throughput}/s</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Apps using {pathname.split('/').pop()} </h2>
          <ul className="space-y-2">
            {displayModels.map((model, index) => (
              <li key={model.id} className="flex justify-between items-center">
                <span className="font-medium">{index + 1}. {model.name}</span>
                <span className="text-gray-600">{model.tokens?.toLocaleString()} tokens</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
