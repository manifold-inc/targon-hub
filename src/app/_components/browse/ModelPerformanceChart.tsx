import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import { reactClient } from "@/trpc/react";
import { ModelPerformanceDetail } from "./ModelPerformanceDetail";
import {
  formatModelName,
  getColorTheme,
  ModelPerformanceOverview,
} from "./ModelPerformanceOverview";

export const ModelPerformanceChart = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const { data: models } = reactClient.model.getTopModelsByTPS.useQuery();

  return (
    <div className="relative flex h-96 flex-col">
      {/* Chart Container */}
      <div className="flex-1 py-2 sm:py-3">
        <AnimatePresence mode="wait">
          {!selectedModel ? (
            <ModelPerformanceOverview onModelSelect={setSelectedModel} />
          ) : (
            <ModelPerformanceDetail
              modelName={selectedModel}
              colorIndex={
                models?.findIndex((m) => m.modelName === selectedModel) ?? 0
              }
            />
          )}
        </AnimatePresence>
      </div>

      {/* Model Filter Pills */}
      <div className="absolute -bottom-4 left-0 right-0 bg-mf-milk-300 sm:-bottom-6">
        <div className="p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {models?.map((model, index) => (
              <button
                key={model.modelName}
                onClick={() =>
                  setSelectedModel(
                    model.modelName === selectedModel ? null : model.modelName,
                  )
                }
                className={`flex items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium shadow-sm transition-all hover:shadow sm:px-2.5 ${
                  model.modelName === selectedModel
                    ? `${getColorTheme(index).pill} text-mf-milk-300`
                    : "bg-mf-milk-500 text-gray-600 hover:bg-mf-milk-300"
                }`}
              >
                <span
                  className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${
                    model.modelName === selectedModel
                      ? "bg-mf-milk-300"
                      : getColorTheme(index).pill
                  }`}
                />
                <span className="w-24 truncate">
                  {formatModelName(model.modelName)}
                </span>
              </button>
            ))}
            {selectedModel && (
              <button
                onClick={() => setSelectedModel(null)}
                className={`flex items-center justify-center gap-1 rounded-full px-2 py-1 text-xs font-medium shadow-sm transition-all hover:shadow sm:px-2.5 ${
                  getColorTheme(
                    models?.findIndex((m) => m.modelName === selectedModel) ??
                      0,
                  ).pill
                } whitespace-nowrap text-mf-milk-300`}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
