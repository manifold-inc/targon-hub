import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Add type for valid model names
type ModelName = keyof typeof modelThemes;

interface ModelStats {
  name: ModelName;
  provider: string;
  totalTokens: number;
  breakdown: {
    daily: number[];
    gpusNeeded: number;
    costPerDay: number;
  };
}

const models: ModelStats[] = [
  {
    name: "Llama 3.1 70B",
    provider: "hugging-quants",
    totalTokens: 850000,
    breakdown: {
      daily: [820000, 840000, 860000, 850000, 830000, 870000, 850000],
      gpusNeeded: 4,
      costPerDay: 120,
    },
  },
  {
    name: "Llama 3.1 8B",
    provider: "unsloth",
    totalTokens: 1200000,
    breakdown: {
      daily: [1150000, 1180000, 1220000, 1200000, 1190000, 1210000, 1200000],
      gpusNeeded: 6,
      costPerDay: 150,
    },
  },
  {
    name: "Rogue Rose 103B",
    provider: "TheBloke",
    totalTokens: 600000,
    breakdown: {
      daily: [580000, 590000, 610000, 600000, 620000, 590000, 600000],
      gpusNeeded: 3,
      costPerDay: 90,
    },
  },
  {
    name: "Claude 3 Opus",
    provider: "anthropic",
    totalTokens: 1500000,
    breakdown: {
      daily: [1450000, 1480000, 1520000, 1500000, 1490000, 1510000, 1500000],
      gpusNeeded: 8,
      costPerDay: 180,
    },
  },
  {
    name: "GPT-4 Turbo",
    provider: "openai",
    totalTokens: 1800000,
    breakdown: {
      daily: [1750000, 1780000, 1820000, 1800000, 1790000, 1810000, 1800000],
      gpusNeeded: 10,
      costPerDay: 220,
    },
  },
  {
    name: "Mixtral 8x7B",
    provider: "mistral",
    totalTokens: 1600000,
    breakdown: {
      daily: [1550000, 1580000, 1620000, 1600000, 1590000, 1610000, 1600000],
      gpusNeeded: 7,
      costPerDay: 160,
    },
  },
];

// Add color schemes for each model
const modelThemes = {
  "Llama 3.1 70B": {
    from: "from-sky-500",
    to: "to-sky-400",
    bar: "bg-gradient-to-r from-sky-500/80 to-sky-400/60",
    pill: "bg-gradient-to-r from-sky-500 to-sky-400",
    stats: "from-sky-500/10 to-sky-400/5",
    text: "text-sky-500/70",
  },
  "Llama 3.1 8B": {
    from: "from-amber-500",
    to: "to-amber-400",
    bar: "bg-gradient-to-r from-amber-500/80 to-amber-400/60",
    pill: "bg-gradient-to-r from-amber-500 to-amber-400",
    stats: "from-amber-500/10 to-amber-400/5",
    text: "text-amber-500/70",
  },
  "Rogue Rose 103B": {
    from: "from-fuchsia-500",
    to: "to-fuchsia-400",
    bar: "bg-gradient-to-r from-fuchsia-500/80 to-fuchsia-400/60",
    pill: "bg-gradient-to-r from-fuchsia-500 to-fuchsia-400",
    stats: "from-fuchsia-500/10 to-fuchsia-400/5",
    text: "text-fuchsia-500/70",
  },
  "Claude 3 Opus": {
    from: "from-orange-500",
    to: "to-orange-400",
    bar: "bg-gradient-to-r from-orange-500/80 to-orange-400/60",
    pill: "bg-gradient-to-r from-orange-500 to-orange-400",
    stats: "from-orange-500/10 to-orange-400/5",
    text: "text-orange-500/70",
  },
  "GPT-4 Turbo": {
    from: "from-indigo-500",
    to: "to-indigo-400",
    bar: "bg-gradient-to-r from-indigo-500/80 to-indigo-400/60",
    pill: "bg-gradient-to-r from-indigo-500 to-indigo-400",
    stats: "from-indigo-500/10 to-indigo-400/5",
    text: "text-indigo-500/70",
  },
  "Mixtral 8x7B": {
    from: "from-violet-500",
    to: "to-violet-400",
    bar: "bg-gradient-to-r from-violet-500/80 to-violet-400/60",
    pill: "bg-gradient-to-r from-violet-500 to-violet-400",
    stats: "from-violet-500/10 to-violet-400/5",
    text: "text-violet-500/70",
  },
} as const;

export const ModelPerformanceChart = () => {
  const [selectedModel, setSelectedModel] = useState<ModelStats | null>(null);
  const maxTokens = Math.max(...models.map((m) => m.totalTokens));

  return (
    <div className="relative flex h-[400px] flex-col">
      {/* Chart Container */}
      <div className="flex-1 py-4 sm:py-6">
        <AnimatePresence mode="wait">
          {!selectedModel ? (
            // Overview List
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <div className="flex flex-col space-y-2.5">
                {models.map((model, index) => (
                  <motion.div
                    key={model.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedModel(model)}
                  >
                    <div className="flex items-center justify-between pb-1.5 text-sm">
                      <span className="font-medium text-gray-900 group-hover:text-gray-700">
                        {model.name}
                      </span>
                      <span
                        className={`${modelThemes[model.name].text} font-medium`}
                      >
                        {(model.totalTokens / 1000).toFixed(0)}k tokens/day
                      </span>
                    </div>
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100/80">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${(model.totalTokens / maxTokens) * 100}%`,
                        }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                        className={`absolute left-0 h-full rounded-full ${modelThemes[model.name].bar}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            // Detailed Stats
            <motion.div
              key="details"
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
                    {selectedModel.name}
                  </h3>
                  <p
                    className={`text-sm ${modelThemes[selectedModel.name].text}`}
                  >
                    by {selectedModel.provider}
                  </p>
                </div>
              </div>

              {/* Model Stats Grid */}
              <div className="grid grid-cols-3 gap-1.5 pt-4 sm:gap-3">
                <div
                  className={`rounded-lg bg-gradient-to-br ${modelThemes[selectedModel.name].stats} p-2 sm:p-3`}
                >
                  <div
                    className={`text-[10px] sm:text-xs ${modelThemes[selectedModel.name].text}`}
                  >
                    Total Tokens
                  </div>
                  <div className="pt-0.5 text-sm font-semibold text-gray-900 sm:pt-1 sm:text-base">
                    {(selectedModel.totalTokens / 1000).toFixed(0)}k/day
                  </div>
                </div>
                <div
                  className={`rounded-lg bg-gradient-to-br ${modelThemes[selectedModel.name].stats} p-2 sm:p-3`}
                >
                  <div
                    className={`text-[10px] sm:text-xs ${modelThemes[selectedModel.name].text}`}
                  >
                    GPUs Needed
                  </div>
                  <div className="pt-0.5 text-sm font-semibold text-gray-900 sm:pt-1 sm:text-base">
                    {selectedModel.breakdown.gpusNeeded} GPUs
                  </div>
                </div>
                <div
                  className={`rounded-lg bg-gradient-to-br ${modelThemes[selectedModel.name].stats} p-2 sm:p-3`}
                >
                  <div
                    className={`text-[10px] sm:text-xs ${modelThemes[selectedModel.name].text}`}
                  >
                    Daily Cost
                  </div>
                  <div className="pt-0.5 text-sm font-semibold text-gray-900 sm:pt-1 sm:text-base">
                    ${selectedModel.breakdown.costPerDay}/day
                  </div>
                </div>
              </div>

              {/* Daily Performance Chart */}
              <div className="flex-1 pt-4">
                <div className="py-2 text-xs font-medium text-gray-600">
                  Last 7 Days
                </div>
                <div className="relative h-[120px]">
                  {selectedModel.breakdown.daily.map((tokens, i) => (
                    <motion.div
                      key={i}
                      className={`absolute bottom-0 w-[12%] rounded-sm ${modelThemes[selectedModel.name].bar}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${(tokens / maxTokens) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      style={{ left: `${i * 14}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-gray-500">
                  {["6d", "5d", "4d", "3d", "2d", "1d", "Today"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Model Filter Pills */}
      <div className="absolute -bottom-4 left-0 right-0 border-t border-gray-100 bg-white sm:-bottom-6">
        <div className="p-3 sm:p-6">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2">
            {models
              .filter((model) => model.name !== selectedModel?.name)
              .map((model) => (
                <button
                  key={model.name}
                  onClick={() => setSelectedModel(model)}
                  className="flex items-center justify-center gap-1 whitespace-nowrap rounded-full bg-gray-100/80 px-2 py-1 text-[10px] font-medium text-gray-600 shadow-sm transition-all
                    hover:bg-gray-100 hover:shadow sm:px-2.5 sm:text-xs"
                >
                  <span
                    className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${modelThemes[model.name].pill}`}
                  />
                  {model.name}
                </button>
              ))}
            {selectedModel && (
              <button
                onClick={() => setSelectedModel(null)}
                className={`flex items-center justify-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium shadow-sm transition-all hover:shadow sm:px-2.5 sm:text-xs
                  ${modelThemes[selectedModel.name].pill} whitespace-nowrap text-white`}
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
