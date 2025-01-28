import { type NextRequest } from "next/server";
import { asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { DailyModelTokenCounts, Model } from "@/schema/schema";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { requestedModelName } = z
      .object({ requestedModelName: z.array(z.string().min(1)) })
      .parse(await request.json());

    const stats = await db
      .select({
        modelName: DailyModelTokenCounts.modelName,
        totalTokens: DailyModelTokenCounts.totalTokens,
        avgTPS: DailyModelTokenCounts.avgTPS,
        cpt: Model.cpt,
      })
      .from(DailyModelTokenCounts)
      .leftJoin(Model, eq(DailyModelTokenCounts.modelName, Model.name))
      .where(inArray(DailyModelTokenCounts.modelName, requestedModelName))
      .orderBy(asc(DailyModelTokenCounts.createdAt));
    /**
     * Average TPS
     * Total Tokens
     * Request Tokens
     */
    // iterate through list if multiple models
    return Response.json({ stats: stats });
  } catch (err) {
    return Response.json({ error: "Invalid request", status: 400 });
  }
}
