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
  console.log("Subscription created webhook:", {
    id: subscription.id,
    status: subscription.status,
    metadata: subscription.metadata,
    latestInvoice: subscription.latest_invoice,
  });

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

  // Create subscription record only - don't enable model or create lease yet
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
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("Created subscription record in DB");
  return;
};

export const subscriptionUpdated = async (
  subscription: Stripe.Subscription,
) => {
  console.log("Subscription updated webhook:", {
    id: subscription.id,
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    latestInvoice: subscription.latest_invoice,
  });

  // Get the existing subscription to check if this is the initial activation
  const [existingSub] = await db
    .select()
    .from(ModelSubscription)
    .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

  // If this is the initial activation (incomplete -> active) with same invoice, skip it
  if (
    existingSub?.status === "incomplete" &&
    subscription.status === "active" &&
    existingSub.latestInvoice === subscription.latest_invoice
  ) {
    console.log(
      "Skipping initial activation update - will be handled by invoice.paid",
    );
    return;
  }

  // Update the subscription record with new status
  try {
    await db
      .update(ModelSubscription)
      .set({
        status: subscription.status as
          | "incomplete"
          | "incomplete_expired"
          | "active"
          | "past_due"
          | "canceled"
          | "unpaid",
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        defaultPaymentMethod:
          (subscription.default_payment_method as string) ?? null,
        latestInvoice: (subscription.latest_invoice as string) ?? null,
        // represents our processing of the webhook
        updatedAt: new Date(),
      })
      .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

    console.log("Updated subscription in DB, fetching to verify...");

    // Verify the update
    const [updated] = await db
      .select()
      .from(ModelSubscription)
      .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

    if (updated) {
      console.log("Subscription state after update:", {
        id: updated.stripeSubscriptionId,
        status: updated.status,
        latestInvoice: updated.latestInvoice,
      });
    } else {
      console.log("Could not find subscription after update");
    }
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
};

export const invoicePaid = async (invoice: Stripe.Invoice) => {
  console.log("Invoice paid webhook:", {
    id: invoice.id,
    subscriptionId: invoice.subscription,
    status: invoice.status,
    paid: invoice.paid,
  });

  // Only handle subscription invoices
  if (!invoice.subscription) return;

  // Get the subscription details
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string,
  );
  console.log("Retrieved subscription for invoice:", {
    id: subscription.id,
    status: subscription.status,
  });

  // Check if we've already processed this invoice
  const [existingLease] = await db
    .select()
    .from(ModelLeasing)
    .where(eq(ModelLeasing.invoiceId, invoice.id));

  if (existingLease) {
    return;
  }

  // Update the subscription record with new period
  await db
    .update(ModelSubscription)
    .set({
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      status: subscription.status as
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid",
      latestInvoice: invoice.id,
      updatedAt: new Date(),
    })
    .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

  // Record the lease payment
  const [modelSub] = await db
    .select({
      userId: ModelSubscription.userId,
      modelId: ModelSubscription.modelId,
      gpuCount: ModelSubscription.gpuCount,
    })
    .from(ModelSubscription)
    .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

  if (!modelSub) {
    throw new Error(`No subscription found for invoice ${invoice.id}`);
  }

  const [model] = await db
    .select({
      name: Model.name,
      enabled: Model.enabled,
    })
    .from(Model)
    .where(eq(Model.id, modelSub.modelId));

  if (!model?.name) {
    throw new Error(`No model found for subscription ${subscription.id}`);
  }

  // Record the lease payment
  await db.insert(ModelLeasing).values({
    userId: modelSub.userId,
    enabledDate: new Date(),
    modelName: model.name,
    amount: (modelSub.gpuCount * Number(COST_PER_GPU)) / CREDIT_PER_DOLLAR,
    type: "subscription",
    invoiceId: invoice.id,
  });

  // Only enable the model if it's not already enabled (first payment)
  if (!model.enabled) {
    await db
      .update(Model)
      .set({
        enabled: true,
        enabledDate: new Date(),
      })
      .where(eq(Model.id, modelSub.modelId));
  }

  return;
};
