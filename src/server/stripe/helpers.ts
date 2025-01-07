import { eq } from "drizzle-orm";
import type Stripe from "stripe";

import { db } from "@/schema/db";
import { Model, ModelSubscription } from "@/schema/schema";

export type SubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "active"
  | "past_due"
  | "canceled";

export async function updateModelStatus(modelId: number, enabled: boolean) {
  await db
    .update(Model)
    .set({
      enabled,
      enabledDate: enabled ? new Date() : null,
    })
    .where(eq(Model.id, modelId));
}

export async function updateSubscriptionRecord(
  subscription: Stripe.Subscription,
  status: SubscriptionStatus,
  additionalFields?: Partial<{
    cancelAtPeriodEnd: boolean;
    defaultPaymentMethod: string | null;
  }>,
) {
  await db
    .update(ModelSubscription)
    .set({
      status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      latestInvoice: (subscription.latest_invoice as string) ?? null,
      updatedAt: new Date(),
      ...additionalFields,
    })
    .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

  // Verify the update
  const [updated] = await db
    .select()
    .from(ModelSubscription)
    .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));

  if (!updated) {
    throw new Error(
      `Could not find subscription ${subscription.id} after update`,
    );
  }

  return updated;
}

export async function getSubscriptionWithModel(subscriptionId: string) {
  const [subscription] = await db
    .select({
      id: ModelSubscription.id,
      modelId: ModelSubscription.modelId,
      status: ModelSubscription.status,
      gpuCount: ModelSubscription.gpuCount,
    })
    .from(ModelSubscription)
    .where(eq(ModelSubscription.stripeSubscriptionId, subscriptionId));

  if (!subscription) {
    throw new Error(`No subscription found for ID ${subscriptionId}`);
  }

  const [model] = await db
    .select({
      id: Model.id,
      name: Model.name,
      enabled: Model.enabled,
    })
    .from(Model)
    .where(eq(Model.id, subscription.modelId));

  if (!model) {
    throw new Error(`No model found for subscription ${subscriptionId}`);
  }

  return { subscription, model };
}
