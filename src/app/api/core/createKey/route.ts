import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { ApiKey, genId, User } from "@/schema/schema";

export async function POST(request: NextRequest) {
  try {
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

    // Is it okay to have explicit error handling or remove the zod validation?
    const { keyName } = z
      .object({ keyName: z.string().min(1) })
      .parse(await request.json());

    const apiKey = genId.apikey();
    await db.insert(ApiKey).values({
      userId: user.id,
      key: apiKey,
      name: keyName,
    });

    return Response.json({ key: apiKey, message: "Key created", status: 200 });
  } catch (err) {
    return Response.json({ error: err, status: 400 });
  }
}
