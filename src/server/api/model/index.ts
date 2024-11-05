import { count, eq } from "drizzle-orm";

import { Model } from "@/schema/schema";
import { createTRPCRouter, publicAuthlessProcedure } from "../trpc";

export const modelRouter = createTRPCRouter({
  getModels: publicAuthlessProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(Model).where(eq(Model.enabled, true));
  }),
  getCountModels: publicAuthlessProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({ count: count() })
      .from(Model)
      .where(eq(Model.enabled, true));
  }),
});
