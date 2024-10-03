import { faker } from "@faker-js/faker";
import { z } from "zod";

export const StatsSchema = z.object({
  max_tokens_per_second: z.number(),
  min_tokens_per_second: z.number(),
  range_tokens_per_second: z.number(),
  average_tokens_per_second: z.number(),
});
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy"); // @TODO
    document.body.removeChild(textArea);
  }
}

interface Model {
  id: number;
  name: string | null;
  category: string;
  // Add other fields if needed
}

interface ModelStats {
  modelId: number;
  modelName: string;
  category: string;
  dailyTokens: number;
  weeklyTokens: number;
  monthlyTokens: number;
  trendScore: number;
  date: string;
}

export function generateFakeStats(models: Model[], days = 30): ModelStats[] {
  const today = new Date();
  const stats: ModelStats[] = [];

  models.forEach((model) => {
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dailyTokens = faker.number.int({ min: 1000, max: 100000 });
      const weeklyTokens = faker.number.int({
        min: dailyTokens * 7,
        max: dailyTokens * 7 * 1.5,
      });
      const monthlyTokens = faker.number.int({
        min: weeklyTokens * 4,
        max: weeklyTokens * 4 * 1.5,
      });

      stats.push({
        modelId: model.id,
        modelName: model.name!,
        category: model.category,
        dailyTokens,
        weeklyTokens,
        monthlyTokens,
        trendScore: faker.number.float({ min: 0, max: 10, fractionDigits: 2 }),
        date: date.toISOString(),
      });
    }
  });

  return stats;
}

// Helper function to get stats for a specific timeframe
export function getStatsForTimeframe(
  stats: ModelStats[],
  timeframe: "daily" | "weekly" | "monthly",
): ModelStats[] {
  const today = new Date();
  let filteredStats: ModelStats[];

  switch (timeframe) {
    case "daily":
      filteredStats = stats.filter(
        (stat) => new Date(stat.date).toDateString() === today.toDateString(),
      );
      break;
    case "weekly":
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredStats = stats.filter((stat) => new Date(stat.date) >= oneWeekAgo);
      break;
    case "monthly":
      const oneMonthAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate(),
      );
      filteredStats = stats.filter(
        (stat) => new Date(stat.date) >= oneMonthAgo,
      );
      break;
    default:
      filteredStats = stats;
  }

  return filteredStats;
}

// Helper function to get trending models
export function getTrendingModels(
  stats: ModelStats[],
  limit = 5,
): ModelStats[] {
  const latestStats = getStatsForTimeframe(stats, "daily");
  return latestStats
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, limit);
}
