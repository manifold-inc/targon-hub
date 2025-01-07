import { TRPCError } from "@trpc/server";
import { and, eq, notInArray } from "drizzle-orm";
import { z } from "zod";

import { MAX_GPU_SLOTS } from "@/constants";
import { env } from "@/env.mjs";
import { Model, ModelSubscription, User } from "@/schema/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const subscriptionRouter = createTRPCRouter({
  createSubscription: protectedProcedure
    .input(
      z.object({
        modelName: z.string(),
        redirectUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [model] = await ctx.db
        .select()
        .from(Model)
        .where(eq(Model.name, input.modelName));

      if (!model) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Model not found",
        });
      }

      //this shouldn't happen but just in case
      if (model.requiredGpus < 1 || model.requiredGpus > MAX_GPU_SLOTS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid GPU count",
        });
      }

      const [existing] = await ctx.db
        .select()
        .from(ModelSubscription)
        .where(
          and(
            eq(ModelSubscription.modelId, model.id),
            notInArray(ModelSubscription.status, [
              "canceled",
              "incomplete_expired",
              "past_due",
            ]),
          ),
        );

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Model is actively subscribed",
        });
      }

      const [user] = await ctx.db
        .select({ customerId: User.stripeCustomerId })
        .from(User)
        .where(eq(User.id, ctx.user.id));

      try {
        const session = await ctx.stripe.checkout.sessions.create({
          billing_address_collection: "auto",
          mode: "subscription",
          customer: user!.customerId!,
          line_items: [
            {
              price: env.STRIPE_SUBSCRIPTION_PRICE_ID,
              quantity: model.requiredGpus,
            },
          ],
          success_url: `${ctx.req!.nextUrl.origin}/models/${encodeURIComponent(input.modelName)}?success=true`,
          cancel_url: `${ctx.req!.nextUrl.origin}${input.redirectUrl ?? "/models/lease"}?canceled=true`,
          subscription_data: {
            metadata: {
              user_id: ctx.user.id.toString(),
              model_id: model.id.toString(),
              gpu_count: model.requiredGpus.toString(),
            },
          },
        });

        return session.url!;
      } catch (err) {
        throw new TRPCError({
          message: (err as { message: string }).message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const [user] = await ctx.db
      .select({ customerId: User.stripeCustomerId })
      .from(User)
      .where(eq(User.id, ctx.user.id));

    if (!user?.customerId) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "No Stripe customer found",
      });
    }

    const session = await ctx.stripe.billingPortal.sessions.create({
      customer: user.customerId,
      return_url: `${ctx.req!.nextUrl.origin}/models`,
    });

    return session.url;
  }),
});
