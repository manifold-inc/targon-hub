import { motion } from "framer-motion";

import { reactClient } from "@/trpc/react";

// Keep the existing color palette and helper functions
export const colorPalette = [
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

export const getColorTheme = (index: number) =>
  colorPalette[index % colorPalette.length]!;
export const formatModelName = (fullName: string) =>
  fullName.split("/").pop() ?? fullName;

// Simplified bar width calculation using straight percentages
const getBarWidth = (tokens: number, maxTokens: number) => {
  // Ensure we don't divide by zero and maintain a minimum visible width
  if (maxTokens === 0) return 5;
  return Math.max(5, (tokens / maxTokens) * 100);
};

export const ModelPerformanceOverview = ({
  onModelSelect,
}: {
  onModelSelect: (modelName: string) => void;
}) => {
  const { data: models, isLoading } =
    reactClient.model.getTopModelsByTPS.useQuery();

  if (isLoading || !models) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-sky-500" />
      </div>
    );
  }

  // Filter out models with null or 0 TPS
  const validModels = models.filter(
    (model) => model.avgTPS !== null && model.avgTPS !== 0,
  );

  return (
    <div className="flex flex-col space-y-2.5">
      {validModels.map((model, index) => (
        <motion.div
          key={model.modelName}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * 0.05,
            duration: 0.3,
            ease: "easeOut",
          }}
          className="group cursor-pointer"
          onClick={() => onModelSelect(model.modelName)}
        >
          <div className="flex items-center justify-between whitespace-nowrap pb-1.5 text-xs sm:text-sm">
            <span className="inline-block w-1/2 truncate font-medium text-mf-ash-700 group-hover:text-mf-ash-500">
              {formatModelName(model.modelName)}
            </span>
            <span className={`${getColorTheme(index).text} font-medium`}>
              {`${model.avgTPS.toFixed(1)} TPS`}
            </span>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-mf-milk-300">
            {model.avgTPS === null || model.avgTPS === 0 ? (
              <div className="mf-milk-300 absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                No data
              </div>
            ) : (
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width: `${getBarWidth(model.avgTPS, Math.max(...models.map((m) => m.avgTPS || 0)))}%`,
                }}
                transition={{
                  delay: index * 0.05 + 0.1,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className={`absolute left-0 h-full rounded-full ${getColorTheme(index).bar}`}
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
