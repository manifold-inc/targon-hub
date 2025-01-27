import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/schema/db";
import { Model } from "@/schema/schema";

export async function GET(request: NextRequest): Promise<Response> {
  const models = await db.select().from(Model);
  return Response.json(models);
}
