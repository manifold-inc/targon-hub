import { and, eq, notInArray } from "drizzle-orm";
import type Stripe from "stripe";

import { db } from "@/schema/db";
import { Model, ModelSubscription, User } from "@/schema/schema";
import { reportErrorToInflux } from "@/server/influx";
import {
  updateModelStatus,
  updateSubscriptionRecord,
  type SubscriptionStatus,
} from "../helpers";

async function validateSubscriptionMetadata(subscription: Stripe.Subscription) {
  const { user_id, model_id, gpu_count } = subscription.metadata;

  if (!user_id || !model_id || !gpu_count) {
    throw new Error("Missing required metadata on subscription");
  }

  const userId = parseInt(user_id);
  const modelId = parseInt(model_id);
  const gpuCount = parseInt(gpu_count);

  const [[user], [model], [existing]] = await Promise.all([
    db.select().from(User).where(eq(User.id, userId)),
    db.select().from(Model).where(eq(Model.id, modelId)),
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
  ]);

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  if (!model) {
    throw new Error(`Model ${modelId} not found`);
  }

  if (existing) {
    throw new Error(`Model ${modelId} is already subscribed`);
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
      enabled: Model.enabled,
    })
    .from(Model)
    .where(eq(Model.id, existingSub.modelId));

  if (!model) {
    throw new Error(`No model found for subscription ${subscription.id}`);
  }

  if (subscription.status === "canceled" && model.enabled) {
    await updateModelStatus(model.id, false);
  } else if (
    existingSub.status === "past_due" &&
    subscription.status === "active" &&
    !model.enabled
  ) {
    await updateModelStatus(model.id, true);
  }
}

export async function subscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const metadata = await validateSubscriptionMetadata(subscription);
    await createSubscriptionRecord(subscription, metadata);
  } catch (error) {
    await reportErrorToInflux(error as Error);
    throw error;
  }
}

export async function subscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const [existingSub] = await db
      .select()
      .from(ModelSubscription)
      .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

    if (
      existingSub?.status === "incomplete" &&
      subscription.status === "active" &&
      existingSub.latestInvoice === subscription.latest_invoice
    ) {
      return;
    }

    await updateSubscriptionRecord(
      subscription,
      subscription.status as SubscriptionStatus,
      {
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        defaultPaymentMethod:
          (subscription.default_payment_method as string) ?? null,
      },
    );

    if (existingSub) {
      await handleSubscriptionStateChange(subscription, existingSub);
    }
  } catch (error) {
    await reportErrorToInflux(error as Error);
    throw error;
  }
}
