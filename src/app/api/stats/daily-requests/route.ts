import { count, gte, sql } from "drizzle-orm";

import { db } from "@/schema/db";
import { Request } from "@/schema/schema";

export async function GET(): Promise<Response> {
  const [total] = await db
    .select({ total: count(Request.id) })
    .from(Request)
    .where(gte(Request.createdAt, sql`CURRENT_DATE()`));

  return Response.json(total?.total, { status: 200 });
}
