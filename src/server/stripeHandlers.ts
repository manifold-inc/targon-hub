import { eq } from "drizzle-orm";
import type Stripe from "stripe";

import { CREDIT_PER_DOLLAR } from "@/constants";
import { env } from "@/env.mjs";
import { db } from "@/schema/db";
import { CheckoutSessions, User } from "@/schema/schema";
import { stripe } from "./stripe";

export const checkoutSuccess = async (
  data: Stripe.CheckoutSessionCompletedEvent.Data["object"],
) => {
  const userId = data.metadata?.user_id;
  if (!userId) {
    throw new Error("Checkout completed but no user was attached to metadata");
  }
  const [user] = await db.select().from(User).where(eq(User.id, userId));
  if (!user) {
    throw new Error("Checkout completed but no user was found");
  }

  const [existing] = await db
    .select({ userId: CheckoutSessions.userId })
    .from(CheckoutSessions)
    .where(eq(CheckoutSessions.id, data.id));
  if (existing) {
    throw new Error("Skipping duplicate Transaction");
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
  await db
    .update(User)
    .set({ credits: user.credits + line_item.quantity * CREDIT_PER_DOLLAR })
    .where(eq(User.id, userId));
  await db.insert(CheckoutSessions).values({
    id: data.id,
    credits: line_item.quantity * CREDIT_PER_DOLLAR,
    userId: userId,
  });

  return;
};
