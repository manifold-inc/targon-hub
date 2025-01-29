import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { ApiKey, genId } from "@/schema/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const coreRouter = createTRPCRouter({
  getApiKeys: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        name: ApiKey.name,
        key: ApiKey.key,
        createdAt: ApiKey.createdAt,
      })
      .from(ApiKey)
      .where(eq(ApiKey.userId, ctx.user.id))
      .orderBy(desc(ApiKey.createdAt));
  }),
  createApiKey: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.name.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Key name cannot be empty",
        });
      }
      const apiKey = genId.apikey();
      await ctx.db.insert(ApiKey).values({
        userId: ctx.user.id,
        key: apiKey,
        name: input.name,
      });
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
