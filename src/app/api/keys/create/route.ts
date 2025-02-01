import { type NextRequest } from "next/server";
import { z } from "zod";

import { db } from "@/schema/db";
import { ApiKey, genId } from "@/schema/schema";
import { authorize } from "../../utils";

export async function POST(request: NextRequest): Promise<Response> {
  const [user_id, err] = await authorize(request);
  if (err) {
    return err;
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
      userId: user_id,
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
        error: "Failed to create API key",
        details: err.message,
        status: 500,
      });
    }
    return Response.json({
      error: "Failed to create API key",
      details: "An unknown error occurred",
      status: 500,
    });
  }
}
