import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/schema/db";
import { ApiKey } from "@/schema/schema";
import { authorize } from "../../utils";

export async function GET(request: NextRequest) {
  const [user_id, err] = await authorize(request);
  if (err) {
    return err;
  }

  const apiKey = await db
    .select({ key: ApiKey.key })
    .from(ApiKey)
    .where(eq(ApiKey.userId, user_id));
  if (apiKey.length === 0) {
    return Response.json({ error: "User has no API keys", status: 401 });
  }

  return Response.json({ keys: apiKey.map((key) => key.key), status: 200 });
}
