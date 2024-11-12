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
export function formatLargeNumber(n: number | bigint) {
  const num = Number(n);
  if (num >= 1_000_000_000_000) {
    return num / 1_000_000_000_000 + " T";
  }
  if (num >= 1_000_000_000) {
    return num / 1_000_000_000 + " B";
  }
  if (num >= 1_000_000) {
    return num / 1_000_000 + " M";
  }
  if (num >= 1_000) {
    return num / 1_000 + " k";
  }
  return num.toString();
}

export const getModelGradient = (modelFullName: string) => {
  const gradients = [
    "from-indigo-500 via-sky-500 to-violet-500",
    "from-sky-500 via-emerald-500 to-teal-500",
    "from-violet-500 via-rose-500 to-amber-500",
    "from-rose-500 via-fuchsia-500 to-indigo-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-amber-500 via-orange-500 to-red-500",
    "from-fuchsia-500 via-purple-500 to-pink-500",
    "from-blue-500 via-indigo-500 to-violet-500",
  ];

  const seed = modelFullName
    .split("")
    .reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
  return gradients[seed % gradients.length];
};