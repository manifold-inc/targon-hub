import { eq } from "drizzle-orm";
import type Stripe from "stripe";

import { COST_PER_GPU, CREDIT_PER_DOLLAR } from "@/constants";
import { db } from "@/schema/db";
import { Model, ModelLeasing, ModelSubscription } from "@/schema/schema";
import { stripe } from "../stripe";

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
      status: subscription.status as "active" | "past_due" | "canceled",
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
    createdAt: new Date(),
    modelName: model.name,
    amount: (modelSub.gpuCount * Number(COST_PER_GPU)) / CREDIT_PER_DOLLAR,
    type: "subscription",
    invoiceId: invoice.id,
  });

  // Only enable the model if:
  // 1. It's not already enabled
  // 2. The subscription is active
  if (!model.enabled && subscription.status === "active") {
    console.log("Enabling model for first time after successful payment", {
      modelId: modelSub.modelId,
      subscriptionStatus: subscription.status,
    });

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

export const invoicePaymentFailed = async (invoice: Stripe.Invoice) => {
  console.log("Invoice payment failed webhook:", {
    id: invoice.id,
    subscriptionId: invoice.subscription,
    status: invoice.status,
    attemptCount: invoice.attempt_count,
    nextPaymentAttempt: invoice.next_payment_attempt,
  });

  // Only handle subscription invoices
  if (!invoice.subscription) {
    console.log("Skipping non-subscription invoice");
    return;
  }

  // Get the subscription details
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string,
  );
  console.log("Retrieved subscription for failed invoice:", {
    id: subscription.id,
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  });

  // Skip if subscription is already canceled
  if (subscription.status === "canceled") {
    console.log("Subscription is already canceled - skipping");
    return;
  }

  // Get the subscription and model details
  const [modelSub] = await db
    .select({
      id: ModelSubscription.id,
      modelId: ModelSubscription.modelId,
      status: ModelSubscription.status,
    })
    .from(ModelSubscription)
    .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

  if (!modelSub) {
    throw new Error(`No subscription found for invoice ${invoice.id}`);
  }

  // Get current model state
  const [model] = await db
    .select({
      id: Model.id,
      enabled: Model.enabled,
    })
    .from(Model)
    .where(eq(Model.id, modelSub.modelId));

  if (!model) {
    throw new Error(`No model found for subscription ${subscription.id}`);
  }

  // Update subscription status
  await db
    .update(ModelSubscription)
    .set({
      status: subscription.status as "past_due" | "canceled",
      latestInvoice: invoice.id,
      updatedAt: new Date(),
    })
    .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

  // If this is the final retry attempt or no more retries scheduled
  if (!invoice.next_payment_attempt) {
    console.log("Final payment attempt failed - disabling model", {
      modelId: model.id,
      wasEnabled: model.enabled,
      attemptCount: invoice.attempt_count,
      nextAttempt: invoice.next_payment_attempt,
    });

    // Disable the model
    await db
      .update(Model)
      .set({
        enabled: false,
        enabledDate: null,
      })
      .where(eq(Model.id, model.id));

    // Update subscription to canceled
    await db
      .update(ModelSubscription)
      .set({
        status: "canceled",
        updatedAt: new Date(),
      })
      .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

    console.log("Model disabled and subscription marked as canceled");
  } else {
    console.log("Payment will be retried", {
      attemptCount: invoice.attempt_count,
      nextAttempt: new Date(invoice.next_payment_attempt * 1000),
    });
  }

  return;
};
