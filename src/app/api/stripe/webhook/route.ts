import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import type Stripe from "stripe";

import { env } from "@/env.mjs";
import { stripe } from "@/server/stripe";
import { checkoutSuccess } from "@/server/stripeHandlers";

export async function POST(request: NextRequest) {
  const headersList = headers();
  const body = await request.text();

  const signature = headersList.get("stripe-signature");
  if (!signature)
    return new Response("Error: Missing Signature Header", { status: 400 });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_ENDPOINT_SECRET,
    );
  } catch (err) {
    if (err instanceof Error)
      console.log(`Webhook signature verification failed.`, err.message);
    return new Response(
      `Webhook Error: ${err instanceof Error && err.message}`,
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      await checkoutSuccess(event.data.object);
      break;
    default:
      console.log("Invalid Event Type");
      break;
  }

  return new Response(null, { status: 200 });
}
