import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/schema/db";
import { ApiKey, User } from "@/schema/schema";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = request.headers.get("Authorization");
  const token = auth?.split(" ").at(-1);
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [user] = await db
    .select({ credits: User.credits })
    .from(User)
    .innerJoin(ApiKey, eq(User.id, ApiKey.userId))
    .where(eq(ApiKey.key, token));
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ credits: user.credits }, { status: 200 });
}
