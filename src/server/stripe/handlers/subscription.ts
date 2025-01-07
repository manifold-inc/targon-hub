import { and, eq, gte, notInArray } from "drizzle-orm";
import type Stripe from "stripe";

import { db } from "@/schema/db";
import { Model, ModelLeasing, ModelSubscription, User } from "@/schema/schema";
import { reportErrorToInflux } from "@/server/influx";
import {
  updateModelStatus,
  updateSubscriptionRecord,
  type SubscriptionStatus,
} from "@/server/stripe/helpers";

async function validateSubscriptionMetadata(subscription: Stripe.Subscription) {
  const { user_id, model_id, gpu_count } = subscription.metadata;

  if (!user_id || !model_id || !gpu_count) {
    throw new Error("Missing required metadata on subscription");
  }

  const userId = parseInt(user_id);
  const modelId = parseInt(model_id);
  const gpuCount = parseInt(gpu_count);

  // We need the model name to check for active leases
  const [model] = await db
    .select({
      id: Model.id,
      name: Model.name,
    })
    .from(Model)
    .where(eq(Model.id, modelId));

  if (!model?.name) {
    throw new Error(`Model ${modelId} not found or has no name`);
  }

  const [[user], [existingSubscription], [activeLease]] = await Promise.all([
    // Check if user exists
    db.select().from(User).where(eq(User.id, userId)),
    // Check if model already has an active subscription
    // exclude canceled, incomplete_expired, and past_due statuses as they are not considered active
    db
      .select()
      .from(ModelSubscription)
      .where(
        and(
          eq(ModelSubscription.modelId, modelId),
          notInArray(ModelSubscription.status, [
            "canceled",
            "incomplete_expired",
            "past_due",
          ]),
        ),
      ),
    // Check if model has an active one-time lease (within the 7-day immunity period)
    // A model cannot be subscribed to if it's currently leased via one-time payment
    db
      .select()
      .from(ModelLeasing)
      .where(
        and(
          eq(ModelLeasing.modelName, model.name),
          eq(ModelLeasing.type, "onetime"),
          gte(
            ModelLeasing.createdAt,
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          ),
        ),
      ),
  ]);

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  if (existingSubscription) {
    throw new Error(`Model ${modelId} is already subscribed`);
  }

  if (activeLease) {
    throw new Error(
      `Model ${model.name} is currently leased via one time payment and cannot be subscribed to`,
    );
  }

  return { userId, modelId, gpuCount };
}

async function createSubscriptionRecord(
  subscription: Stripe.Subscription,
  metadata: { userId: number; modelId: number; gpuCount: number },
) {
  await db.insert(ModelSubscription).values({
    userId: metadata.userId,
    modelId: metadata.modelId,
    stripeSubscriptionId: subscription.id,
    status: subscription.status as SubscriptionStatus,
    gpuCount: metadata.gpuCount,
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
}

async function handleSubscriptionStateChange(
  subscription: Stripe.Subscription,
  existingSub: { status: string; modelId: number },
) {
  const [model] = await db
    .select({
      id: Model.id,
      name: Model.name,
      enabled: Model.enabled,
    })
    .from(Model)
    .where(eq(Model.id, existingSub.modelId));

  if (!model?.name) {
    throw new Error(`No model found for subscription ${subscription.id}`);
  }

  // Disable model when subscription is canceled
  if (subscription.status === "canceled" && model.enabled) {
    await updateModelStatus(model.id, false);
  }
  // Re-enable model when subscription becomes active after being past_due
  else if (
    existingSub.status === "past_due" &&
    subscription.status === "active" &&
    !model.enabled
  ) {
    // Check for active one-time lease before enabling
    // This prevents a race condition where:
    // 1. A subscription becomes past_due
    // 2. Someone leases the model with a one-time payment
    // 3. The subscription payment succeeds
    // 4. We try to re-enable the subscription
    const [activeLease] = await db
      .select()
      .from(ModelLeasing)
      .where(
        and(
          eq(ModelLeasing.modelName, model.name),
          eq(ModelLeasing.type, "onetime"),
          gte(
            ModelLeasing.createdAt,
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          ),
        ),
      );

    if (activeLease) {
      throw new Error(
        `Cannot enable model ${model.name} as it currently has an active one-time lease`,
      );
    }

    await updateModelStatus(model.id, true);
  }
}

/**
 * Handles subscription creation events from Stripe.
 * This is called when a customer.subscription.created webhook is received.
 *
 * Note: Stripe doesn't guarantee event order, so this might arrive before or after
 * other subscription-related events like invoice.created or invoice.paid.
 */
export async function subscriptionCreated(subscription: Stripe.Subscription) {
  try {
    // Validate metadata and check for conflicts with existing subscriptions or leases
    const metadata = await validateSubscriptionMetadata(subscription);
    await createSubscriptionRecord(subscription, metadata);
  } catch (error) {
    await reportErrorToInflux(error as Error);
    throw error;
  }
}

/**
 * Handles subscription update events from Stripe.
 * This is called when a customer.subscription.updated webhook is received.
 *
 * Following Stripe's best practices:
 * 1. Returns 200 quickly to prevent timeouts
 * 2. Handles out-of-order events (subscription.updated might arrive before subscription.created)
 * 3. Lets Stripe's retry mechanism handle temporary failures (retries for up to 3 days in live mode)
 */
export async function subscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const [existingSub] = await db
      .select()
      .from(ModelSubscription)
      .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

    // If subscription doesn't exist yet, return 200 and let Stripe retry
    // This handles the case where subscription.updated arrives before subscription.created
    if (!existingSub) {
      return;
    }

    // Skip processing if this is a duplicate event for an incomplete->active transition
    if (
      existingSub.status === "incomplete" &&
      subscription.status === "active" &&
      existingSub.latestInvoice === subscription.latest_invoice
    ) {
      return;
    }

    // Update subscription record with latest status and payment details
    await updateSubscriptionRecord(
      subscription,
      subscription.status as SubscriptionStatus,
      {
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        defaultPaymentMethod:
          (subscription.default_payment_method as string) ?? null,
      },
    );

    // Handle model state changes based on subscription status
    await handleSubscriptionStateChange(subscription, existingSub);
  } catch (error) {
    await reportErrorToInflux(error as Error);
    throw error;
  }
}

/**
 * Handles subscription deletion events from Stripe.
 * This is called when a customer.subscription.deleted webhook is received.
 *
 * When a subscription is deleted:
 * 1. Updates the subscription record to canceled status
 * 2. Disables access to the model
 * 3. Makes the model available for new subscriptions or leases
 */
export async function subscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const [existingSub] = await db
      .select()
      .from(ModelSubscription)
      .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

    // If subscription doesn't exist, return 200 and let Stripe retry
    if (!existingSub) {
      return;
    }

    // Update subscription record to canceled status
    await updateSubscriptionRecord(
      subscription,
      "canceled" as SubscriptionStatus,
      {
        cancelAtPeriodEnd: false,
        defaultPaymentMethod: null,
      },
    );

    // Disable the model
    await updateModelStatus(existingSub.modelId, false);
  } catch (error) {
    await reportErrorToInflux(error as Error);
    throw error;
  }
}
