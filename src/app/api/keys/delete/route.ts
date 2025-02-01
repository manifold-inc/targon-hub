import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { ApiKey } from "@/schema/schema";
import { authorize } from "../../utils";

export async function DELETE(request: NextRequest): Promise<Response> {
  const [_, err] = await authorize(request);
  if (err) {
    return err;
  }

  const { keyName, apiKey } = z
    .object({
      keyName: z.string().optional(),
      apiKey: z.string().optional(),
    })
    .parse(await request.json());
  if (!keyName && !apiKey) {
    return Response.json({ error: "Key cannot be empty", status: 400 });
  }

  try {
    if (apiKey) {
      await db.delete(ApiKey).where(eq(ApiKey.key, apiKey));
      return Response.json({ message: `Key ${apiKey} deleted`, status: 200 });
    }
    await db.delete(ApiKey).where(eq(ApiKey.name, keyName!));
    return Response.json({ message: `Key ${keyName} deleted`, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({
        error: "Failed to delete API key",
        details: err.message,
        status: 500,
      });
    }
    return Response.json({
      error: "Failed to delete API key",
      details: "An unknown error occured",
      status: 500,
    });
  }
}
