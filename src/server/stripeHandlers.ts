import { and, eq, notInArray } from "drizzle-orm";
import type Stripe from "stripe";

import { COST_PER_GPU, CREDIT_PER_DOLLAR } from "@/constants";
import { env } from "@/env.mjs";
import { db } from "@/schema/db";
import {
  CheckoutSession,
  Model,
  ModelLeasing,
  ModelSubscription,
  User,
} from "@/schema/schema";
import { stripe } from "./stripe";

export const checkoutSuccess = async (
  data: Stripe.CheckoutSessionCompletedEvent.Data["object"],
) => {
  const metadataUserId = data.metadata?.user_id;
  if (!metadataUserId) {
    throw new Error("Checkout completed but no user was attached to metadata");
  }
  const userId = parseInt(metadataUserId);
  const [user] = await db.select().from(User).where(eq(User.id, userId));
  if (!user) {
    throw new Error("Checkout completed but no user was found");
  }

  const [existing] = await db
    .select({ userId: CheckoutSession.userId })
    .from(CheckoutSession)
    .where(eq(CheckoutSession.id, data.id));
  if (existing) {
    return;
  }

  const line_items = await stripe.checkout.sessions.listLineItems(data.id);
  if (line_items.data.length != 1) {
    throw new Error("Checkout has unexpected line items");
  }
  const line_item = line_items.data[0];
  if (
    line_item?.price?.id != env.STRIPE_CREDIT_PRICE_ID ||
    !line_item.quantity
  ) {
    throw new Error("Checkout has unexpected line items");
  }
  const session = (await stripe.checkout.sessions.retrieve(data.id, {
    expand: ["payment_intent.payment_method"],
  })) as Stripe.Checkout.Session & {
    payment_intent: Stripe.PaymentIntent & {
      payment_method: Stripe.PaymentMethod;
    };
  };
  const last4 = session.payment_intent?.payment_method?.card?.last4 ?? null;
  const cardBrand = session.payment_intent?.payment_method?.card?.brand ?? null;

  await db
    .update(User)
    .set({ credits: user.credits + line_item.quantity * CREDIT_PER_DOLLAR })
    .where(eq(User.id, userId));
  await db.insert(CheckoutSession).values({
    id: data.id,
    credits: line_item.quantity * CREDIT_PER_DOLLAR,
    userId,
    cardLast4: last4 ?? null,
    cardBrand: cardBrand ?? null,
  });

  return;
};

export const subscriptionCreated = async (
  subscription: Stripe.Subscription,
) => {
  const { user_id, model_id, gpu_count } = subscription.metadata;

  // Validation
  if (!user_id || !model_id || !gpu_count) {
    throw new Error("Missing required metadata on subscription");
  }

  // Check if user exists
  const [user] = await db
    .select()
    .from(User)
    .where(eq(User.id, parseInt(user_id)));
  if (!user) {
    throw new Error(`User ${user_id} not found`);
  }

  // Check if model exists
  const [model] = await db
    .select()
    .from(Model)
    .where(eq(Model.id, parseInt(model_id)));
  if (!model) {
    throw new Error(`Model ${model_id} not found`);
  }

  // Check if model is already subscribed
  const [existing] = await db
    .select()
    .from(ModelSubscription)
    .where(
      and(
        eq(ModelSubscription.modelId, parseInt(model_id)),
        notInArray(ModelSubscription.status, [
          "canceled",
          "incomplete_expired",
          "unpaid",
          "past_due",
        ]),
      ),
    );

  if (existing) {
    throw new Error(`Model ${model_id} is already subscribed`);
  }

  // Create subscription
  await db.insert(ModelSubscription).values({
    userId: parseInt(user_id),
    modelId: parseInt(model_id),
    stripeSubscriptionId: subscription.id,
    status: subscription.status as
      | "incomplete"
      | "incomplete_expired"
      | "active"
      | "past_due"
      | "canceled"
      | "unpaid",
    gpuCount: parseInt(gpu_count),
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    priceId: subscription.items.data[0]?.price?.id ?? "",
    defaultPaymentMethod:
      (subscription.default_payment_method as string) ?? null,
    latestInvoice: (subscription.latest_invoice as string) ?? null,
    collectionMethod: "charge_automatically" as const,
  });

  // Update model status and model leasing table
  await db
    .update(Model)
    .set({
      enabled: true,
      enabledDate: new Date(),
    })
    .where(eq(Model.id, parseInt(model_id)));

  await db.insert(ModelLeasing).values({
    userId: user.id,
    enabledDate: new Date(),
    modelName: model.name!,
    amount: (parseInt(gpu_count) * Number(COST_PER_GPU)) / CREDIT_PER_DOLLAR,
  });

  return;
};
