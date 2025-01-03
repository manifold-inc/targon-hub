import { eq } from "drizzle-orm";
import type Stripe from "stripe";

import { env } from "@/env.mjs";
import { db } from "@/schema/db";
import { CheckoutSession, User } from "@/schema/schema";
import { stripe } from "../stripe";
import { CREDIT_PER_DOLLAR } from "@/constants";

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