import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  COST_PER_GPU,
  CREDIT_PER_DOLLAR,
  MIN_PURCHASE_IN_DOLLARS,
} from "@/constants";
import { env } from "@/env.mjs";
import { db } from "@/schema/db";
import { Model, ModelLeasing, User } from "@/schema/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const creditsRouter = createTRPCRouter({
  checkout: protectedProcedure
    .input(
      z.object({
        purchaseAmount: z.number(),
        redirectTo: z.string().optional(),
      }),
    )
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
          success_url: `${ctx.req!.nextUrl.origin}${input.redirectTo ?? "/models"}&success=true`,
          cancel_url: `${ctx.req!.nextUrl.origin}${input.redirectTo ?? "/models"}?&canceled=true`,
        });
        return session.url!;
      } catch (err) {
        throw new TRPCError({
          message: (err as { message: string }).message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  leaseModel: protectedProcedure
    .input(z.object({ model: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [[requiredGPU], [user]] = await Promise.all([
        ctx.db
          .select({
            gpu: Model.requiredGpus,
          })
          .from(Model)
          .where(eq(Model.name, input.model)),

        ctx.db
          .select({
            credits: User.credits,
          })
          .from(User)
          .where(eq(User.id, ctx.user.id)),
      ]);

      // Make sure model isnt greater than what we can handle
      if (requiredGPU && requiredGPU.gpu > 8) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot lease more than 8 GPUs`,
        });
      }

      // Check if user has enough credits
      if (!user || !requiredGPU?.gpu) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found, or gpus not found.",
        });
      }

      if (BigInt(user.credits) < BigInt(requiredGPU.gpu) * COST_PER_GPU) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient credits to lease this model",
        });
      }

      const now = new Date();

      // Lease model
      await Promise.all([
        db
          .update(Model)
          .set({ enabled: true, enabledDate: now })
          .where(eq(Model.name, input.model)),

        db
          .update(User)
          .set({
            credits: user.credits - requiredGPU.gpu * Number(COST_PER_GPU),
          })
          .where(eq(User.id, ctx.user.id)),

        db.insert(ModelLeasing).values({
          userId: ctx.user.id,
          modelName: input.model,
          amount: (requiredGPU.gpu * Number(COST_PER_GPU)) / CREDIT_PER_DOLLAR,
        }),
      ]);

      return {
        success: true,
      };
    }),
});
