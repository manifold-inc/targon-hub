import { type NextRequest } from "next/server";
import { z } from "zod";

import { db } from "@/schema/db";
import { User } from "@/schema/schema";

export async function POST(request: NextRequest): Promise<Response> {
  const { email, password } = z
    .object({ email: z.string(), password: z.string() })
    .parse(await request.json());

  if (!email.includes("@") || !email.includes(".") || email.length < 3) {
    return Response.json({ error: "Invalid email", status: 400 });
  }
  if (password.length < 8 || password.length > 255) {
    return Response.json({
      error: "Password should be at least 8 characters",
      status: 400,
    });
  }
}
