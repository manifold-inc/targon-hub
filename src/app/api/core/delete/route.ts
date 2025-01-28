import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { ApiKey, User } from "@/schema/schema";

export async function DELETE(request: NextRequest): Promise<Response> {
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

  const { apiKey } = z
    .object({ apiKey: z.string() })
    .parse(await request.json());
  if (apiKey.length === 0) {
    return Response.json({ error: "Key cannot be empty", status: 400 });
  }

  try {
    await db.delete(ApiKey).where(eq(ApiKey.key, apiKey));
    return Response.json({ message: "Key deleted", status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({
        error: "Failed to delete api key",
        details: err.message,
        status: 500,
      });
    }
    return Response.json({
      error: "Failed to delete api key",
      details: "An unknown error occured",
      status: 500,
    });
  }
}
