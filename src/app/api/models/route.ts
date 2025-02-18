import { eq } from "drizzle-orm";

import { db } from "@/schema/db";
import { Model } from "@/schema/schema";

export async function GET(): Promise<Response> {
  const models = await db
    .select({ name: Model.name, context_length: Model.contextLength })
    .from(Model)
    .where(eq(Model.enabled, true));

  return Response.json(
    models.map((m) => ({ model: m.name, context_length: m.context_length })),
    { status: 200 },
  );
}
