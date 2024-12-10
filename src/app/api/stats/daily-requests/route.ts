import { count, gte, sql } from "drizzle-orm";

import { db } from "@/schema/db";
import { Request } from "@/schema/schema";

export async function GET(): Promise<Response> {
  const [total_today] = await db
    .select({ total: count(Request.id) })
    .from(Request)
    .where(gte(Request.createdAt, sql`CURRENT_DATE()`));
  const [total_hour] = await db
    .select({ total: count(Request.id) })
    .from(Request)
    .where(gte(Request.createdAt, sql`NOW() - INTERVAL 1 HOUR`));

  return Response.json(
    { today: total_today?.total, hour: total_hour?.total },
    { status: 200 },
  );
}
