import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { MIN_PURCHASE_IN_DOLLARS } from "@/constants";
import { env } from "@/env.mjs";
import { User } from "@/schema/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const creditsRouter = createTRPCRouter({
  checkout: protectedProcedure
    .input(z.object({ purchaseAmount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (input.purchaseAmount % 1 !== 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Credits must be purchased in full dollar amounts`,
        });
      }
      if (input.purchaseAmount < MIN_PURCHASE_IN_DOLLARS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Must purchase a minimum of $${MIN_PURCHASE_IN_DOLLARS}`,
        });
      }
      const [user] = await ctx.db
        .select({ customerId: User.stripeCustomerId })
        .from(User)
        .where(eq(User.id, ctx.user.id));
      try {
        // Create Checkout Sessions from body params.
        const session = await ctx.stripe.checkout.sessions.create({
          line_items: [
            {
              price: env.STRIPE_CREDIT_PRICE_ID,
              quantity: input.purchaseAmount,
            },
          ],
          metadata: {
            user_id: ctx.user.id,
          },
          customer: user!.customerId ?? undefined, // this should always be there, but in case its not.
          mode: "payment",
          success_url: `${ctx.req!.nextUrl.origin}/dashboard?success=true`,
          cancel_url: `${ctx.req!.nextUrl.origin}/dashboard?canceled=true`,
        });
        return session.url!;
      } catch (err) {
        throw new TRPCError({
          message: (err as { message: string }).message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
