import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { Model } from "@/schema/schema";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { isLive } = z
      .object({ isLive: z.boolean().default(false) })
      .parse(await request.json());
    const models = await db
      .select({ name: Model.name })
      .from(Model)
      .where(eq(Model.enabled, isLive));
    return Response.json({ models: models });
  } catch (err) {
    return Response.json({ error: "Invalid request", status: 400 });
  }
}
