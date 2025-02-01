import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/schema/db";
import { ApiKey, User } from "@/schema/schema";

export async function authorize(
  request: NextRequest,
): Promise<[number, null] | [null, Response]> {
  const auth = request.headers.get("Authorization");
  const token = auth?.split(" ").at(-1);
  if (!token) {
    return [null, Response.json({ error: "Unauthorized", status: 401 })];
  }
  const [user] = await db
    .select({ id: User.id })
    .from(User)
    .innerJoin(ApiKey, eq(User.id, ApiKey.userId))
    .where(eq(ApiKey.key, token));
  if (!user?.id) {
    return [null, Response.json({ error: "Unauthorized", status: 401 })];
  }
  return [user.id, null];
}
