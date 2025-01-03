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
  if (!invoice.subscription) return;

  try {
    // Check for duplicate processing
    const [existingLease] = await db
      .select()
      .from(ModelLeasing)
      .where(eq(ModelLeasing.invoiceId, invoice.id));

    if (existingLease) return;

    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string,
    );

    // Get subscription and model details
    const { subscription: modelSub, model } = await getSubscriptionWithModel(
      subscription.id,
    );

    // Get user ID from subscription
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

    // Update subscription status
    await updateSubscriptionRecord(
      subscription,
      subscription.status as SubscriptionStatus,
    );

    // Record the lease payment
    await db.insert(ModelLeasing).values({
      userId: subDetails.userId,
      createdAt: new Date(),
      modelName: model.name,
      amount: (modelSub.gpuCount * Number(COST_PER_GPU)) / CREDIT_PER_DOLLAR,
      type: "subscription",
      invoiceId: invoice.id,
    });

    // Enable model if needed
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
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string,
    );

    // Skip if already canceled
    if (subscription.status === "canceled") return;

    const { subscription: modelSub } = await getSubscriptionWithModel(
      subscription.id,
    );

    // Update subscription status
    await updateSubscriptionRecord(
      subscription,
      subscription.status as SubscriptionStatus,
    );

    // Handle final payment attempt
    if (!invoice.next_payment_attempt) {
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
