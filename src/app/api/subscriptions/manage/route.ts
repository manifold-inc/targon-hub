import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/schema/db";
import { ApiKey, User } from "@/schema/schema";
import { stripe } from "@/server/stripe/stripe";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = request.headers.get("Authorization");
  const token = auth?.split(" ").at(-1);
  if (!token) {
    return Response.json({ error: "Unauthorized", status: 401 });
  }
  const [user] = await db
    .select({ customerId: User.stripeCustomerId, id: User.id })
    .from(User)
    .innerJoin(ApiKey, eq(User.id, ApiKey.userId))
    .where(eq(ApiKey.key, token));
  if (!user) {
    return Response.json({ error: "Unauthorized", status: 401 });
  }
  if (!user.customerId) {
    return Response.json({ error: "No Stripe customer found", status: 404 });
  }
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: user.customerId,
      return_url: `${request.nextUrl.origin}/models`,
    });
    return Response.json({ customer_portal: session.url });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({
        error: "Failed to get Stripe's customer portal",
        details: err.message,
        status: 500,
      });
    }
    return Response.json({
      error: "Failed to get Stripe's customer portal",
      details: "An unknown error occurred",
      status: 500,
    });
  }
}
