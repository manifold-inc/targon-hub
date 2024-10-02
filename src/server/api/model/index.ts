import { eq } from "drizzle-orm";

import { Model } from "@/schema/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const modelRouter = createTRPCRouter({
  getModels: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: Model.id,
        name: Model.name,
      })
      .from(Model)
      .where(eq(Model.enabled, true));
  }),
});
