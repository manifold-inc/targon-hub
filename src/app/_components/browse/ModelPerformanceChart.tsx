import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { reactClient } from "@/trpc/react";
import { CREDIT_PER_DOLLAR } from "@/constants";

// Update types to match API response
type ModelStats = {
  modelName: string;
  totalTokens: number;
  dailyTokens: number[];
  createdAt: Date;
  requiredGpus: number;
  cpt: number;
};

// Keep modelThemes type but make it more flexible
type ModelTheme = {
  from: string;
  to: string;
  bar: string;
  pill: string;
  stats: string;
  text: string;
};

// Replace the model-specific themes with a color palette
const colorPalette: ModelTheme[] = [
  {
    from: "from-sky-500",
    to: "to-sky-400",
    bar: "bg-gradient-to-r from-sky-500/80 to-sky-400/60",
    pill: "bg-gradient-to-r from-sky-500 to-sky-400",
    stats: "from-sky-500/10 to-sky-400/5",
    text: "text-sky-500/70",
  },
  {
    from: "from-violet-500",
    to: "to-violet-400",
    bar: "bg-gradient-to-r from-violet-500/80 to-violet-400/60",
    pill: "bg-gradient-to-r from-violet-500 to-violet-400",
    stats: "from-violet-500/10 to-violet-400/5",
    text: "text-violet-500/70",
  },
  {
    from: "from-amber-500",
    to: "to-amber-400",
    bar: "bg-gradient-to-r from-amber-500/80 to-amber-400/60",
    pill: "bg-gradient-to-r from-amber-500 to-amber-400",
    stats: "from-amber-500/10 to-amber-400/5",
    text: "text-amber-500/70",
  },
  {
    from: "from-emerald-500",
    to: "to-emerald-400",
    bar: "bg-gradient-to-r from-emerald-500/80 to-emerald-400/60",
    pill: "bg-gradient-to-r from-emerald-500 to-emerald-400",
    stats: "from-emerald-500/10 to-emerald-400/5",
    text: "text-emerald-500/70",
  },
  {
    from: "from-rose-500",
    to: "to-rose-400",
    bar: "bg-gradient-to-r from-rose-500/80 to-rose-400/60",
    pill: "bg-gradient-to-r from-rose-500 to-rose-400",
    stats: "from-rose-500/10 to-rose-400/5",
    text: "text-rose-500/70",
  },
  {
    from: "from-indigo-500",
    to: "to-indigo-400",
    bar: "bg-gradient-to-r from-indigo-500/80 to-indigo-400/60",
    pill: "bg-gradient-to-r from-indigo-500 to-indigo-400",
    stats: "from-indigo-500/10 to-indigo-400/5",
    text: "text-indigo-500/70",
  },
];

// Replace getTheme function with getColorTheme
const getColorTheme = (index: number): ModelTheme => {
  return colorPalette[index % colorPalette.length]!;
};

// Add this helper function near the top of the file
const formatModelName = (fullName: string) => {
  const parts = fullName.split("/");
  return parts.length > 1 ? parts[1] : fullName;
};

// Add this helper function for better number formatting
const formatTokenCount = (tokens: number) => {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(2)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}k`;
  }
  return tokens.toString();
};

// Add this type for hover data
type HoverData = {
  value: number;
  day: string;
  index: number;
} | null;

// Add this helper function for better bar scaling with a minimum visible width
const getBarWidth = (tokens: number, maxTokens: number) => {
  const MIN_WIDTH = 5;
  const BASE_WIDTH = 10;
  const MAX_WIDTH = 100;
  
  // Add small epsilon to handle zero tokens
  const logScale = Math.log(tokens + 1) / Math.log(maxTokens + 1);
  const scaledWidth = logScale * (MAX_WIDTH - BASE_WIDTH) + BASE_WIDTH;
  
  return Math.max(MIN_WIDTH, scaledWidth);
};

export const ModelPerformanceChart = () => {
  const [selectedModel, setSelectedModel] = useState<ModelStats | null>(null);
  const [hoverData, setHoverData] = useState<HoverData>(null);
  
  const { data: modelData, isLoading } = reactClient.model.getDailyModelTokenCounts.useQuery();
  
  if (isLoading || !modelData) {
    return <div>Loading...</div>;
  }

  // Group data by model name to get daily breakdown
  const modelBreakdown = modelData.reduce((acc, curr) => {    
    if (!acc[curr.modelName]) {
      // Initialize model data with empty dailyTokens array for 7 days
      acc[curr.modelName] = {
        modelName: curr.modelName,
        totalTokens: 0, // We'll calculate this after aggregating
        requiredGpus: curr.requiredGpus ?? 0,
        dailyTokens: Array<number>(7).fill(0), // Initialize with zeros
        createdAt: curr.createdAt,
        cpt: curr.cpt ?? 0,
      };
    }

    // Calculate day index (0-6) from newest to oldest
    const today = new Date();
    const dayDiff = Math.floor((today.getTime() - new Date(curr.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const dayIndex = Math.min(6, dayDiff); // Ensure index is within 0-6

    // Add tokens to the correct day
    if (dayIndex >= 0 && dayIndex < 7) {
      acc[curr.modelName]!.dailyTokens[6 - dayIndex] = curr.totalTokens;
    }

    return acc;
  }, {} as Record<string, ModelStats>);

  // Calculate total tokens for each model (use the most recent day's count)
  Object.values(modelBreakdown).forEach(model => {
    model.totalTokens = model.dailyTokens[model.dailyTokens.length - 1] || 0;
  });

  const models = Object.values(modelBreakdown);
  
  // Calculate max tokens across all days for proper scaling
  const maxTokens = Math.max(
    ...models.flatMap(model => model.dailyTokens)
  );

  const cost = (cpt: number) => {
    return (cpt * 1_000_000) / CREDIT_PER_DOLLAR;
  };

  return (
    <div className="relative flex h-96 flex-col">
      {/* Chart Container */}
      <div className="flex-1 py-2 sm:py-3">
        <AnimatePresence mode="wait">
          {!selectedModel ? (
            // Overview List - show latest token count for each model
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
                    key={model.modelName}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedModel(model)}
                  >
                    <div className="flex items-center justify-between pb-1.5 text-xs whitespace-nowrap sm:text-sm">
                      <span className="font-medium text-gray-900 group-hover:text-gray-700">
                        {formatModelName(model.modelName)}
                      </span>
                      <span className={`${getColorTheme(index).text} font-medium`}>
                        {formatTokenCount(model.dailyTokens.reduce((a, b) => a + b, 0))} tokens
                      </span>
                    </div>
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100/80">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${getBarWidth(model.dailyTokens.reduce((a, b) => a + b, 0), maxTokens)}%`,
                        }}
                        transition={{ 
                          delay: index * 0.05 + 0.1,
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                        className={`absolute left-0 h-full rounded-full ${getColorTheme(index).bar}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            // Detailed Stats - show daily breakdown
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
                    {formatModelName(selectedModel.modelName)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    by {selectedModel.modelName.split("/")[0]}
                  </p>
                </div>
              </div>

              {/* Model Stats Grid */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 sm:gap-3">
                <div className={`rounded-lg bg-gradient-to-br ${getColorTheme(models.findIndex(m => m.modelName === selectedModel.modelName)).stats} p-2 sm:p-3`}>
                  <div className={`text-xs ${getColorTheme(models.findIndex(m => m.modelName === selectedModel.modelName)).text}`}>
                    Total Tokens
                  </div>
                  <div className="pt-0.5 text-sm font-semibold text-gray-900 sm:pt-1 sm:text-base">
                    {formatTokenCount(selectedModel.dailyTokens.reduce((a, b) => a + b, 0))} tokens
                  </div>
                </div>
                <div className={`rounded-lg bg-gradient-to-br ${getColorTheme(models.findIndex(m => m.modelName === selectedModel.modelName)).stats} p-2 sm:p-3`}>
                  <div className={`text-xs ${getColorTheme(models.findIndex(m => m.modelName === selectedModel.modelName)).text}`}>
                    GPUs Required
                  </div>
                  <div className="pt-0.5 text-sm font-semibold text-gray-900 sm:pt-1 sm:text-base">
                    {selectedModel.requiredGpus} GPUs
                  </div>
                </div>
                <div className={`rounded-lg bg-gradient-to-br ${getColorTheme(models.findIndex(m => m.modelName === selectedModel.modelName)).stats} p-2 sm:p-3`}>
                  <div className={`text-xs ${getColorTheme(models.findIndex(m => m.modelName === selectedModel.modelName)).text}`}>
                    Cost
                  </div>
                  <div className="pt-0.5 text-sm font-semibold text-gray-900 sm:pt-1 sm:text-base">
                    ${cost(selectedModel.cpt).toFixed(2)} / M tokens
                  </div>
                </div>
              </div>

              {/* Daily Performance Chart */}
              <div className="flex-1 pt-2">
                <div className="py-2 text-xs font-medium text-gray-600">
                  Last 7 Days
                </div>
                <div className="relative h-28">
                  {modelBreakdown[selectedModel.modelName]?.dailyTokens.map((tokens, i) => {
                    return (
                      <div
                        key={i}
                        className="relative"
                        style={{ position: 'absolute', left: `${i * 14}%`, width: '12%', height: '100%' }}
                        onMouseEnter={() => setHoverData({ 
                          value: tokens, 
                          day: modelBreakdown[selectedModel.modelName]?.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) ?? '',
                          index: i 
                        })}
                        onMouseLeave={() => setHoverData(null)}
                      >
                        <motion.div
                          className={`absolute bottom-0 w-full rounded-sm ${getColorTheme(
                            models.findIndex(m => m.modelName === selectedModel.modelName)
                          ).bar} transition-opacity ${
                            hoverData?.index === i ? 'opacity-100' : 'opacity-80'
                          }`}
                          initial={{ height: 0 }}
                          animate={{ height: `${(tokens / selectedModel.dailyTokens.reduce((a, b) => a + b, 0)) * 100}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                        />
                        {hoverData?.index === i && (
                          <div className="absolute bottom-full mb-1 w-full">
                            <div className="relative left-1/2 -translate-x-1/2 flex justify-center items-center">
                              <div className="rounded bg-gray-900 px-2 py-1 text-xs text-white whitespace-nowrap">
                                {formatTokenCount(tokens)} tokens
                                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2 flex justify-between text-xs text-gray-500">
                  {Array.from({ length: 7 }).map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - index));
                    return (
                      <div key={index} className="text-center">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Model Filter Pills */}
      <div className="absolute -bottom-4 left-0 right-0 border-t border-gray-100 bg-white sm:-bottom-6">
        <div className="p-3 sm:p-4">
          <div className="flex flex-wrap gap-1.5">
            {models.map((model, index) => (
              model.modelName !== selectedModel?.modelName && (
                <button
                  key={model.modelName}
                  onClick={() => setSelectedModel(model)}
                  className="flex items-center justify-center gap-1 whitespace-nowrap rounded-full bg-gray-100/80 px-2 py-1 text-xs font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-100 hover:shadow sm:px-2.5 "
                >
                  <span className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${getColorTheme(index).pill}`} />
                  <span className="truncate max-w-[100px]">{formatModelName(model.modelName)}</span>
                </button>
              )
            ))}
            {selectedModel && (
              <button
                onClick={() => setSelectedModel(null)}
                className={`flex items-center justify-center gap-1 rounded-full px-2 py-1 text-xs font-medium shadow-sm transition-all hover:shadow sm:px-2.5 ${
                  getColorTheme(models.findIndex(m => m.modelName === selectedModel.modelName)).pill
                } whitespace-nowrap text-white`}
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
