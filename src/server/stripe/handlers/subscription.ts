import type Stripe from "stripe";
import { and, eq, notInArray } from "drizzle-orm";

import { db } from "@/schema/db";
import { Model, ModelSubscription, User } from "@/schema/schema";

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
        | "canceled",
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
            | "canceled",
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          defaultPaymentMethod:
            (subscription.default_payment_method as string) ?? null,
          latestInvoice: (subscription.latest_invoice as string) ?? null,
          updatedAt: new Date(),
        })
        .where(eq(ModelSubscription.stripeSubscriptionId, subscription.id));
  
      // Handle model state based on subscription status
      if (!existingSub) {
        console.log(
          "No existing subscription found - skipping model state update",
        );
        return;
      }
  
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
  
      // If subscription is canceled (manually or otherwise), ensure model is disabled
      if (subscription.status === "canceled" && model.enabled) {
        console.log("Subscription canceled - disabling model", {
          modelId: model.id,
          wasEnabled: model.enabled,
        });
  
        await db
          .update(Model)
          .set({
            enabled: false,
            enabledDate: null,
          })
          .where(eq(Model.id, model.id));
      }
  
      // If subscription recovers from past_due to active, re-enable model
      if (
        existingSub.status === "past_due" &&
        subscription.status === "active" &&
        !model.enabled
      ) {
        console.log("Subscription recovered from past_due - re-enabling model", {
          modelId: model.id,
          wasEnabled: model.enabled,
        });
  
        await db
          .update(Model)
          .set({
            enabled: true,
            enabledDate: new Date(),
          })
          .where(eq(Model.id, model.id));
      }
  
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