import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import type Stripe from "stripe";

import { env } from "@/env.mjs";
import { reportErrorToInflux } from "@/server/influx";
import {
  checkoutSuccess,
  invoicePaid,
  invoicePaymentFailed,
  subscriptionCreated,
  subscriptionDeleted,
  subscriptionUpdated,
} from "@/server/stripe/handlers";
import { stripe } from "@/server/stripe/stripe";

export async function POST(request: NextRequest) {
  try {
    const headersList = headers();
    const body = await request.text();

    const signature = headersList.get("stripe-signature");
    if (!signature) {
      return new Response("Error: Missing Signature Header", { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_ENDPOINT_SECRET,
      );
    } catch (err) {
      return new Response(
        `Webhook Error: ${err instanceof Error && err.message}`,
        { status: 400 },
      );
    }

    switch (event.type) {
      case "checkout.session.completed":
        if (event.data.object.mode === "subscription") {
          // Skip - this is handled by subscription events
          break;
        }
        await checkoutSuccess(event.data.object);
        break;
      case "customer.subscription.created":
        await subscriptionCreated(event.data.object);
        break;
      case "customer.subscription.updated":
        await subscriptionUpdated(event.data.object);
        break;
      case "invoice.paid":
        await invoicePaid(event.data.object);
        break;
      case "invoice.payment_failed":
        await invoicePaymentFailed(event.data.object);
        break;
      case "customer.subscription.deleted":
        await subscriptionDeleted(event.data.object);
        break;
      default:
        break;
    }

    return new Response(null, { status: 200 });
  } catch (e) {
    await reportErrorToInflux(e as Error);
    return new Response(null, { status: 500 });
  }
}
