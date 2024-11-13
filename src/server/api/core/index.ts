import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { ApiKey, genId, Model } from "@/schema/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const coreRouter = createTRPCRouter({
  getModel: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        model: Model.id,
        failure: Model.failure,
        success: Model.success,
        cpt: Model.cpt,
        miners: Model.miners,
      })
      .from(Model)
      .where(eq(Model.enabled, true));
  }),
  getApiKeys: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({ key: ApiKey.key, createdAt: ApiKey.createdAt })
      .from(ApiKey)
      .where(eq(ApiKey.userId, ctx.user.id));
  }),
  rollApiKey: protectedProcedure
    .input(z.object({ apiKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(ApiKey)
        .where(
          and(eq(ApiKey.userId, ctx.user.id), eq(ApiKey.key, input.apiKey)),
        );
      const apiKey = genId.apikey();
      await ctx.db.insert(ApiKey).values({
        userId: ctx.user.id,
        key: apiKey,
      });
      return apiKey;
    }),

  createApiKey: protectedProcedure.mutation(async ({ ctx }) => {
    const apiKey = genId.apikey();
    await ctx.db.insert(ApiKey).values({ userId: ctx.user.id, key: apiKey });
    return apiKey;
  }),
  deleteApiKey: protectedProcedure
    .input(z.object({ apiKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(ApiKey)
        .where(
          and(eq(ApiKey.userId, ctx.user.id), eq(ApiKey.key, input.apiKey)),
        );
    }),
});
