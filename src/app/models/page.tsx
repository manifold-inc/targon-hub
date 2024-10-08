"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/providers";
import Sidebar from "@/app/_components/browse/sidebar";
import { reactClient } from "@/trpc/react";

export default function BrowsePage() {
  const auth = useAuth();
  const router = useRouter();
  const [filterText, setFilterText] = useState("");

  const {
    data: models,
    isLoading,
    error,
  } = reactClient.model.getModels.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Filter models based on the filter text
  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(filterText.toLowerCase())
  );

  // Navigate to the model's page
  const handleModelClick = (modelId: string) => {
    router.push(`/models/${modelId}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 px-6 lg:px-8">
        <div className="mx-auto pl-24 max-w-6xl py-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl mb-12 text-center">
            Browse Models
          </h1>
          <div className="mb-12">
            <input
              type="text"
              placeholder="Filter models"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <ul className="space-y-4">
              {filteredModels.map((model) => (
                <li
                  key={model.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleModelClick(model.id)}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                      {model.name}
                    </h2>
                    <span className="text-gray-600 dark:text-gray-300">
                      {model.tokens} tokens
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {model.description}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    by {model.author} | {model.context} context | $
                    {model.inputPrice}/M input tokens | ${model.outputPrice}/M
                    output tokens
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
