import { type NextRequest } from "next/server";
import { and, asc, gte, inArray, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { DailyModelTokenCounts } from "@/schema/schema";

export async function POST(request: NextRequest): Promise<Response> {
  // Default to 7 days ago
  const default_date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const { requestedModelName, startDate } = z
    .object({
      requestedModelName: z.array(z.string()),
      startDate: z.string().date().optional().default(default_date!),
    })
    .parse(await request.json());
  if (requestedModelName.length === 0) {
    return Response.json({ error: "Invalid input", status: 400 });
  }

  // Calculate how many days ago from user's input
  const start = new Date(startDate);
  const now = new Date();
  const days = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 3600 * 24),
  );

  try {
    const stats = await db
      .select({
        modelName: DailyModelTokenCounts.modelName,
        totalTokens: DailyModelTokenCounts.totalTokens,
        avgTPS: DailyModelTokenCounts.avgTPS,
        created_at: DailyModelTokenCounts.createdAt,
      })
      .from(DailyModelTokenCounts)
      .where(
        and(
          inArray(DailyModelTokenCounts.modelName, requestedModelName),
          gte(
            DailyModelTokenCounts.createdAt,
            sql`NOW() - INTERVAL ${days} DAY`,
          ),
        ),
      )
      .orderBy(asc(DailyModelTokenCounts.createdAt));
    if (stats.length === 0) {
      return Response.json({
        error: "Model not found",
        status: 404,
      });
    }
    return Response.json({ model_stats: stats, days, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({
        error: "Failed to grab model stats",
        details: err.message,
        status: 500,
      });
    }
    return Response.json({
      error: "Failed to grab model stats",
      details: "An unknown error occurred",
      status: 500,
    });
  }
}
