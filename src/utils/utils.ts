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
