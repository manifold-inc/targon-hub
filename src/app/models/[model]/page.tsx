"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/app/_components/providers";
import { reactClient } from "@/trpc/react";
import { getTrendingModels } from "@/utils/utils";

export default function Page() {
  const auth = useAuth();
  const { data: models, isLoading, error } = reactClient.model.getModels.useQuery();

  const trendingModels = useMemo(() => {
    if (models) {
      return getTrendingModels(models);
    }
    return [];
  }, [models]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-6xl py-32">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl mb-12 text-center">
          Welcome {auth.user || ""} to Model Page
        </h1>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Providers for Gemini Flash 1.5</h2>
          <ul className="space-y-4">
            {trendingModels.map((model) => (
              <li key={model.id} className="flex justify-between items-center">
                <span className="font-medium">{model.name}</span>
                <span className="text-gray-600">Max Output: {model.maxOutput}</span>
                <span className="text-gray-600">Input: {model.input}</span>
                <span className="text-gray-600">Output: {model.output}</span>
                <span className="text-gray-600">Latency: {model.latency}</span>
                <span className="text-gray-600">Throughput: {model.throughput}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Apps using Gemini Flash 1.5</h2>
          <ul className="space-y-2">
            {trendingModels.map((model, index) => (
              <li key={model.id} className="flex justify-between items-center">
                <span className="font-medium">{index + 1}. {model.name}</span>
                <span className="text-gray-600">{model.tokens} tokens</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
