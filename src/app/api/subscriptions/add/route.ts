import { type NextRequest } from "next/server";
import { and, eq, notInArray } from "drizzle-orm";
import { z } from "zod";

import { MAX_GPU_SLOTS } from "@/constants";
import { env } from "@/env.mjs";
import { db } from "@/schema/db";
import { ApiKey, Model, ModelSubscription, User } from "@/schema/schema";
import { stripe } from "@/server/stripe/stripe";

export async function POST(request: NextRequest): Promise<Response> {
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

  const { requestedModelName, redirectUrl } = z
    .object({
      requestedModelName: z.string(),
      redirectUrl: z.string().optional(),
    })
    .parse(await request.json());
  if (!requestedModelName) {
    return Response.json({ error: "Invalid input", status: 400 });
  }

  const [model] = await db
    .select()
    .from(Model)
    .where(eq(Model.name, requestedModelName));
  if (!model) {
    return Response.json({ error: "Model not found", status: 404 });
  }
  if (model.requiredGpus < 1 || model.requiredGpus > MAX_GPU_SLOTS) {
    return Response.json({ error: "Invalid GPU count", status: 400 });
  }

  const [existingModel] = await db
    .select()
    .from(ModelSubscription)
    .where(
      and(
        eq(ModelSubscription.modelId, model.id),
        notInArray(ModelSubscription.status, [
          "canceled",
          "incomplete_expired",
          "past_due",
        ]),
      ),
    );
  if (existingModel) {
    return Response.json({
      error: "Model is actively subscribed",
      status: 409,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      mode: "subscription",
      customer: user.customerId,
      line_items: [
        {
          price: env.STRIPE_SUBSCRIPTION_PRICE_ID,
          quantity: model.requiredGpus,
        },
      ],
      success_url: `${request.nextUrl.origin}/models/${encodeURIComponent(requestedModelName)}?success=true`,
      cancel_url: `${request.nextUrl.origin}${redirectUrl ?? "/models/lease"}?canceled=true`,
      subscription_data: {
        metadata: {
          user_id: user.id.toString(),
          model_id: model.id.toString(),
          gpu_count: model.requiredGpus.toString(),
        },
      },
    });
    return Response.json({ customer_portal: session.url });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({
        error: "Failed to subscribe",
        details: err.message,
        status: 500,
      });
    }
    return Response.json({
      error: "Failed to subscribe",
      details: "An unknown error occurred",
      status: 500,
    });
  }
}
