import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { Model } from "@/schema/schema";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { isLive } = z
      .object({ isLive: z.boolean().default(true) })
      .parse(await request.json());
    const models = await db
      .select({ name: Model.name })
      .from(Model)
      .where(eq(Model.enabled, isLive));
    return Response.json({ models: models, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({
        error: "Failed to grab models",
        details: err.message,
        status: 500,
      });
    }
    return Response.json({
      error: "Failed to grab models",
      details: "An unknown error occurred",
      status: 500,
    });
  }
}
