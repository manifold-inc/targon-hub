import { count, eq } from "drizzle-orm";
import { z } from "zod";

import { Model } from "@/schema/schema";
import { createTRPCRouter, publicAuthlessProcedure } from "../trpc";

interface ModelSibling {
  rfilename: string;
}

interface HuggingFaceModelInfo {
  _id: string;
  id: string;
  author: string;
  gated: boolean;
  inference: string;
  lastModified: string;
  likes: number;
  trendingScore: number;
  private: boolean;
  sha: string;
  downloads: number;
  tags: string[];
  pipeline_tag?: string;
  library_name: string;
  createdAt: string;
  modelId: string;
  siblings: ModelSibling[];
}

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
  getModelInfo: publicAuthlessProcedure.query(async ({ ctx }) => {
    const models = await ctx.db
      .select({ modelName: Model.name })
      .from(Model)
      .where(eq(Model.enabled, true));

    const modelInfoPromises = models.map(async (model) => {
      const response = await fetch(
        `https://huggingface.co/api/models?search=${model.modelName}&limit=20&full=true&config=true`,
        {
          method: "GET",
          headers: {},
        },
      );
      const data = (await response.json()) as HuggingFaceModelInfo[];
      const exactMatch = data.find(
        (item) => item.id.toLowerCase() === model.modelName?.toLowerCase(),
      );

      if (exactMatch) {
        return {
          id: exactMatch.id,
          author: exactMatch.author,
          category: exactMatch.pipeline_tag,
        };
      }
      return null;
    });

    const modelInfoResults = await Promise.all(modelInfoPromises);
    return modelInfoResults.filter((result) => result !== null);
  }),

  getModel: publicAuthlessProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const model = await ctx.db
        .select()
        .from(Model)
        .where(eq(Model.enabled, true) && eq(Model.name, input.slug));

      if (model.length === 0) return null;

      const response = await fetch(
        `https://huggingface.co/api/models?search=${input.slug}&limit=20&full=true&config=true`,
        {
          method: "GET",
          headers: {},
        },
      );
      const data = (await response.json()) as HuggingFaceModelInfo[];
      const exactMatch = data.find(
        (item) => item.id.toLowerCase() === input.slug.toLowerCase(),
      );

      return {
        ...model[0],
        author: exactMatch?.author ?? null,
        category: exactMatch?.pipeline_tag ?? null,
      };
    }),
});
