import { type NextRequest } from "next/server";
import { asc, inArray } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { DailyModelTokenCounts } from "@/schema/schema";

export async function POST(request: NextRequest): Promise<Response> {
  const { requestedModelName } = z
    .object({ requestedModelName: z.array(z.string()) })
    .parse(await request.json());
  if (requestedModelName.length === 0) {
    return Response.json({ error: "Invalid input", status: 400 });
  }

  try {
    const stats = await db
      .select({
        modelName: DailyModelTokenCounts.modelName,
        totalTokens: DailyModelTokenCounts.totalTokens,
        avgTPS: DailyModelTokenCounts.avgTPS,
      })
      .from(DailyModelTokenCounts)
      .where(inArray(DailyModelTokenCounts.modelName, requestedModelName))
      .orderBy(asc(DailyModelTokenCounts.createdAt));
    if (stats.length === 0) {
      return Response.json({ error: "Model not found", status: 404 });
    }
    return Response.json({ model_stats: stats, status: 200 });
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
