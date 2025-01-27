import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { env } from "@/env.mjs";
import { db } from "@/schema/db";
import { ApiKey, Model, User } from "@/schema/schema";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const auth = request.headers.get("Authorization");
    const token = auth?.split(" ").at(-1);
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const [user] = await db
      .select({ credits: User.credits, ss58: User.ss58 })
      .from(User)
      .innerJoin(ApiKey, eq(User.id, ApiKey.userId))
      .where(eq(ApiKey.key, token));
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = { credits: user.credits } as {
      credits: number;
      deposit_address?: string;
    };
    if (user.ss58) {
      body.deposit_address = env.NEXT_PUBLIC_DEPOSIT_ADDRESS;
    }

    return Response.json({ body }, { status: 200 });
  } catch (err) {
    return new Response(`Error: ${err instanceof Error && err.message}`, {
      status: 400,
    });
  }
}
