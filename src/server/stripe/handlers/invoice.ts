import { eq } from "drizzle-orm";
import type Stripe from "stripe";

import { COST_PER_GPU, CREDIT_PER_DOLLAR } from "@/constants";
import { db } from "@/schema/db";
import { ModelLeasing, ModelSubscription } from "@/schema/schema";
import { reportErrorToInflux } from "@/server/influx";
import {
  getSubscriptionWithModel,
  updateModelStatus,
  updateSubscriptionRecord,
  type SubscriptionStatus,
} from "../helpers";
import { stripe } from "../stripe";

export async function invoicePaid(invoice: Stripe.Invoice) {
  // Only process subscription invoices
  if (!invoice.subscription) return;

  try {
    // Check for duplicate invoice processing
    // This prevents double-charging and duplicate model activations
    const [existingLease] = await db
      .select()
      .from(ModelLeasing)
      .where(eq(ModelLeasing.invoiceId, invoice.id));

    if (existingLease) return;

    // Get full subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string,
    );

    // Get subscription and model details
    const { subscription: modelSub, model } = await getSubscriptionWithModel(
      subscription.id,
    );

    // Get user ID from subscription record
    // We need this to record the lease payment
    const [subDetails] = await db
      .select({ userId: ModelSubscription.userId })
      .from(ModelSubscription)
      .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

    if (!subDetails) {
      throw new Error(`No subscription details found for ${subscription.id}`);
    }

    if (!model.name) {
      throw new Error(
        `Model name not found for subscription ${subscription.id}`,
      );
    }

    // Update subscription record with latest status
    await updateSubscriptionRecord(
      subscription,
      subscription.status as SubscriptionStatus,
    );

    // Record the lease payment in our database
    // This creates an audit trail and helps prevent duplicate processing
    await db.insert(ModelLeasing).values({
      userId: subDetails.userId,
      createdAt: new Date(),
      modelName: model.name,
      amount: (modelSub.gpuCount * Number(COST_PER_GPU)) / CREDIT_PER_DOLLAR,
      type: "subscription",
      invoiceId: invoice.id,
    });

    // Enable the model if it's not already enabled and the subscription is active
    // This handles cases where the model was disabled due to payment issues
    if (!model.enabled && subscription.status === "active") {
      await updateModelStatus(modelSub.modelId, true);
    }
  } catch (error) {
    await reportErrorToInflux(error as Error);
    throw error;
  }
}

export async function invoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  try {
    // Get full subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string,
    );

    // Get subscription and model details from our database
    const { subscription: modelSub } = await getSubscriptionWithModel(
      subscription.id,
    );

    // Update subscription record with failed status
    await updateSubscriptionRecord(
      subscription,
      subscription.status as SubscriptionStatus,
    );

    // Handle final payment attempt or canceled status
    if (!invoice.next_payment_attempt || subscription.status === "canceled") {
      await Promise.all([
        updateModelStatus(modelSub.modelId, false),
        updateSubscriptionRecord(subscription, "canceled"),
      ]);
    }
  } catch (error) {
    await reportErrorToInflux(error as Error);
    throw error;
  }
}
