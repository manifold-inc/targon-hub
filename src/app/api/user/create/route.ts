import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { Scrypt } from "lucia/dist/crypto";
import { z } from "zod";

import { db } from "@/schema/db";
import { ApiKey, genId, User } from "@/schema/schema";
import { stripe } from "@/server/stripe/stripe";

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

  const [accountExists] = await db
    .select({ id: User.id })
    .from(User)
    .where(eq(User.email, email));
  if (accountExists) {
    return Response.json({
      error: "Account already exists",
      status: 409,
    });
  }

  try {
    const userId = genId.user();
    const hashedPassword = await new Scrypt().hash(password);
    const stripeId = await stripe.customers.create({
      email,
      metadata: { user_id: userId },
    });

    const res = await db.insert(User).values({
      pubId: userId,
      email,
      stripeCustomerId: stripeId.id,
      password: hashedPassword,
      verified: !hashedPassword,
    });

    const apiKey = genId.apikey();
    await db.insert(ApiKey).values({
      userId: parseInt(res.insertId),
      key: apiKey,
      name: "Default",
    });

    return Response.json({
      message: "Account created",
      status: 200,
    });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({
        error: "Failed to create account",
        details: err.message,
        status: 500,
      });
    }
    return Response.json({
      error: "Failed to create account",
      details: "An unknown error occurred",
      status: 500,
    });
  }
}
