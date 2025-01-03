import { TRPCError } from "@trpc/server";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

import {
  COST_PER_GPU,
  CREDIT_PER_DOLLAR,
  MAX_GPU_SLOTS,
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
      const [[requiredGPU], enabledModels, [user]] = await Promise.all([
        ctx.db
          .select({
            gpu: Model.requiredGpus,
          })
          .from(Model)
          .where(eq(Model.name, input.model)),

        ctx.db
          .select({
            name: Model.name,
            requiredGpus: Model.requiredGpus,
            enabledDate: Model.enabledDate,
          })
          .from(Model)
          .where(eq(Model.enabled, true)),

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
      if (!user || user.credits < (requiredGPU?.gpu ?? 0)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient credits to lease this model",
        });
      }

      const immunityPeriod = 7 * 24 * 60 * 60 * 1000;
      const now = new Date();

      // Calculate how many gpu slots are currently used
      const eligibleForRemoval = enabledModels
        .filter((model) => {
          if (!model.enabledDate) return false;
          return now.getTime() - model.enabledDate.getTime() > immunityPeriod;
        })
        .sort((a, b) => b.enabledDate!.getTime() - a.enabledDate!.getTime());

      const currentGPUUsage = enabledModels.reduce(
        (sum, model) => sum + (model.requiredGpus ?? 0),
        0,
      );
      const requestedGPU = requiredGPU?.gpu ?? 0;

      // Check if we need to remove to make room
      if (currentGPUUsage + requestedGPU > MAX_GPU_SLOTS) {
        let gpuToRemove = currentGPUUsage + requestedGPU - MAX_GPU_SLOTS;
        const modelsToDisable = [];

        for (const model of eligibleForRemoval) {
          if (gpuToRemove <= 0) break;
          modelsToDisable.push(model.name);
          gpuToRemove -= model.requiredGpus;
        }

        if (gpuToRemove > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Cannot free up enough GPU slots. Need ${gpuToRemove} more GPUs. Try again when more models become eligible for removal.`,
          });
        }
        await ctx.db
          .update(Model)
          .set({
            enabled: false,
            enabledDate: null,
          })
          .where(
            inArray(
              Model.name,
              modelsToDisable.filter((name): name is string => name !== null),
            ),
          );
      }

      // Lease model
      await Promise.all([
        db
          .update(Model)
          .set({ enabled: true, enabledDate: now })
          .where(eq(Model.name, input.model)),

        db
          .update(User)
          .set({
            credits:
              user.credits - requiredGPU!.gpu * Number(COST_PER_GPU),
          })
          .where(eq(User.id, ctx.user.id)),

        db.insert(ModelLeasing).values({
          userId: ctx.user.id,
          modelName: input.model,
          amount:
            (requiredGPU!.gpu * Number(COST_PER_GPU)) / CREDIT_PER_DOLLAR,
        }),
      ]);

      return {
        success: true,
      };
    }),
});
