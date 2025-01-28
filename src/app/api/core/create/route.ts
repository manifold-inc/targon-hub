import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { ApiKey, genId, User } from "@/schema/schema";

export async function POST(request: NextRequest): Promise<Response> {
  const auth = request.headers.get("Authorization");
  const token = auth?.split(" ").at(-1);
  if (!token) {
    return Response.json({ error: "Unauthorized", status: 401 });
  }
  const [user] = await db
    .select({ id: User.id })
    .from(User)
    .innerJoin(ApiKey, eq(User.id, ApiKey.userId))
    .where(eq(ApiKey.key, token));
  if (!user) {
    return Response.json({ error: "Unauthorized", status: 401 });
  }

  const { keyName } = z
    .object({ keyName: z.string() })
    .parse(await request.json());
  if (keyName.length === 0) {
    return Response.json({ error: "Key name cannot be empty", status: 400 });
  }
  const newApiKey = genId.apikey();

  try {
    await db.insert(ApiKey).values({
      userId: user.id,
      key: newApiKey,
      name: keyName,
    });
    return Response.json({
      key: newApiKey,
      message: "Key created",
      status: 200,
    });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({
        error: "Failed to create api key",
        details: err.message,
        status: 500,
      });
    }
    return Response.json({
      error: "Failed to create api key",
      details: "An unknown error occurred",
      status: 500,
    });
  }
}
