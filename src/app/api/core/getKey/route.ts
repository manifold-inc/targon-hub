import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/schema/db";
import { ApiKey, User } from "@/schema/schema";

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("Authorization");
    const token = auth?.split(" ").at(-1);
    if (!token) {
      return Response.json({ error: "Unauthorized", status: 401 });
    }
    const [user] = await db
      .select({ credits: User.credits, id: User.id })
      .from(User)
      .innerJoin(ApiKey, eq(User.id, ApiKey.userId))
      .where(eq(ApiKey.key, token));
    if (!user) {
      return Response.json({ error: "Unauthorized", status: 401 });
    }

    const apiKey = await db
      .select({ key: ApiKey.key })
      .from(ApiKey)
      .where(eq(ApiKey.userId, user.id));
    if (apiKey.length === 0) {
      return Response.json({ error: "User has no API keys", status: 401 });
    }

    return Response.json({ keys: apiKey.map((key) => key.key), status: 200 });
  } catch (err) {
    return Response.json({ error: "Invalid request", status: 400 });
  }
}
