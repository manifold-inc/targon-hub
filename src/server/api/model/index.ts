import { TRPCError } from "@trpc/server";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  inArray,
  like,
  or,
  sql,
} from "drizzle-orm";
import moment from "moment";
import { z } from "zod";

import { env } from "@/env.mjs";
import {
  DailyModelTokenCounts,
  MODALITIES,
  Model,
  Request,
} from "@/schema/schema";
import { createTRPCRouter, publicAuthlessProcedure } from "../trpc";

export interface HuggingFaceModelInfo {
  id: string;
  private: boolean;
  gated: boolean | "auto";
  library_name: string;
  pipeline_tag?: string;
  tags?: string[];
  transformersInfo?: {
    auto_model: string;
  };
  config?: {
    auto_map?: Record<string, string>;

    tokenizer_config?: {
      chat_template?: string;
    };
  };
}

export const modelRouter = createTRPCRouter({
  getActiveChatModels: publicAuthlessProcedure.query(async ({ ctx }) => {
    const models = await ctx.db
      .select({
        name: Model.name,
        supportedEndpoints: Model.supportedEndpoints,
      })
      .from(Model)
      .where(and(eq(Model.enabled, true)));
    return models.filter((m) => m.supportedEndpoints.includes("CHAT"));
  }),
  getActiveModels: publicAuthlessProcedure.query(async ({ ctx }) => {
    const models = await ctx.db
      .select({
        name: Model.name,
        supportedEndpoints: Model.supportedEndpoints,
        description: Model.description,
        id: Model.id,
        requiredGpus: Model.requiredGpus,
        modality: Model.modality,
        enabled: Model.enabled,
        createdAt: Model.createdAt,
      })
      .from(Model)
      .where(and(eq(Model.enabled, true)));
    return models;
  }),
  getActiveSearchModels: publicAuthlessProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .select({
          name: Model.name,
          createdAt: Model.createdAt,
        })
        .from(Model)
        .$dynamic();

      const filters = [eq(Model.enabled, true)];

      if (input.name) {
        filters.push(like(Model.name, `%${input.name}%`));
      }

      const models = await query.where(and(...filters));
      return models;
    }),
  getModels: publicAuthlessProcedure
    .input(
      z.object({
        name: z.string().optional(),
        orgs: z.array(z.string()).optional(),
        modalities: z.array(z.enum(MODALITIES)).optional(),
        endpoints: z.array(z.string()).optional(),
        showLiveOnly: z.boolean().optional(),
        showLeaseableOnly: z.boolean().optional(),
        sortBy: z.enum(["newest", "oldest"]).nullable().optional(),
        minTPS: z.number().nullable().optional(),
        minWeeklyPrice: z.number().nullable().optional(),
        maxWeeklyPrice: z.number().nullable().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .select({
          name: Model.name,
          supportedEndpoints: Model.supportedEndpoints,
          description: Model.description,
          id: Model.id,
          requiredGpus: Model.requiredGpus,
          modality: Model.modality,
          enabled: Model.enabled,
          customBuild: Model.customBuild,
          createdAt: Model.createdAt,
          avgTPS: sql<number>`(
            SELECT AVG(${DailyModelTokenCounts.avgTPS})
            FROM ${DailyModelTokenCounts}
            WHERE ${DailyModelTokenCounts.modelName} = ${Model.name}
            AND ${DailyModelTokenCounts.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          )`.mapWith(Number),
          weeklyPrice: sql<number>`${Model.requiredGpus} * 250`.mapWith(Number),
        })
        .from(Model)
        .where(eq(Model.customBuild, false))
        .$dynamic();

      // Apply filters
      const filters = [];
      if (input.name?.length) {
        filters.push(like(Model.name, `%${input.name}%`));
      }
      if (input.orgs?.length) {
        const or_filters = [];
        for (const org of input.orgs) {
          or_filters.push(like(Model.name, `${org}/%`));
        }
        filters.push(or(...or_filters));
      }
      if (input.modalities?.length) {
        filters.push(inArray(Model.modality, input.modalities));
      }
      if (input.endpoints?.length) {
        const endpointChecks = input.endpoints.map(
          (endpoint) =>
            sql`JSON_CONTAINS(${Model.supportedEndpoints}, ${JSON.stringify(endpoint)}, '$')`,
        );
        filters.push(or(...endpointChecks));
      }
      if (input.showLiveOnly) {
        filters.push(eq(Model.enabled, true));
      }
      if (input.showLeaseableOnly) {
        filters.push(eq(Model.enabled, false));
      }

      // Apply TPS filter
      if (input.minTPS !== null && input.minTPS !== undefined) {
        filters.push(sql`(
          SELECT AVG(${DailyModelTokenCounts.avgTPS})
          FROM ${DailyModelTokenCounts}
          WHERE ${DailyModelTokenCounts.modelName} = ${Model.name}
          AND ${DailyModelTokenCounts.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ) >= ${input.minTPS}`);
      }

      // Apply price range filter
      const weeklyPrice = sql<number>`${Model.requiredGpus} * 250`;
      if (input.minWeeklyPrice !== null && input.minWeeklyPrice !== undefined) {
        filters.push(sql`${weeklyPrice} >= ${input.minWeeklyPrice}`);
      }
      if (input.maxWeeklyPrice !== null && input.maxWeeklyPrice !== undefined) {
        filters.push(sql`${weeklyPrice} <= ${input.maxWeeklyPrice}`);
      }

      if (filters.length > 0) {
        await query.where(and(...filters));
      }

      // Apply sorting
      if (input.sortBy === "newest") {
        await query.orderBy(desc(Model.createdAt));
      } else if (input.sortBy === "oldest") {
        await query.orderBy(asc(Model.createdAt));
      }

      // Get total count for pagination
      const countQuery = ctx.db
        .select({ count: sql<number>`count(*)`.mapWith(Number) })
        .from(Model)
        .where(eq(Model.customBuild, false))
        .$dynamic();

      if (filters.length > 0) {
        await countQuery.where(and(...filters));
      }

      const [countResult] = await countQuery;

      const total = countResult?.count ?? 0;

      // Apply pagination
      const offset = (input.page - 1) * input.limit;
      await query.limit(input.limit).offset(offset);

      const items = await query;

      return {
        items,
        total,
        totalPages: Math.ceil(total / input.limit),
        currentPage: input.page,
      };
    }),
  getModelInfo: publicAuthlessProcedure
    .input(z.object({ model: z.string() }))
    .query(async ({ ctx, input }) => {
      const [model] = await ctx.db
        .select({
          name: Model.name,
          id: Model.id,
          enabled: Model.enabled,
          createdAt: Model.createdAt,
          modality: Model.modality,
          description: Model.description,
          supportedEndpoints: Model.supportedEndpoints,
        })
        .from(Model)
        .where(eq(Model.name, input.model));
      return model;
    }),
  getModelUsage: publicAuthlessProcedure
    .input(z.object({ model_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const usage = await ctx.db
        .select({
          count: count(Request.id),
          day: sql<number>`DAY(${Request.createdAt}) AS day`.mapWith(Number),
          month: sql<number>`MONTH(${Request.createdAt}) AS month`.mapWith(
            Number,
          ),
          year: sql<number>`YEAR(${Request.createdAt}) AS year`.mapWith(Number),
        })
        .from(Request)
        .where(
          and(
            eq(Request.model, input.model_id),
            gte(Request.createdAt, sql`NOW() - INTERVAL 1 WEEK`),
          ),
        )
        .groupBy(
          sql`DAY(${Request.createdAt}), MONTH(${Request.createdAt}), YEAR(${Request.createdAt})`,
        )
        .orderBy(asc(sql`year, month, day`));
      return usage.map((u) => ({
        Count: u.count,
        date: moment({ year: u.year, month: u.month - 1, day: u.day }).format(
          "MMM Do",
        ),
      }));
    }),
  getRequiredGpus: publicAuthlessProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const [gpus] = await ctx.db
        .select({ gpus: Model.requiredGpus })
        .from(Model)
        .where(eq(Model.name, input));
      return gpus?.gpus;
    }),
  addModel: publicAuthlessProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const [organization, modelName] = input.split("/");

      if (!modelName || !organization) {
        throw new TRPCError({
          message: `Invalid model ID format for "${input}". Expected: organization/modelName`,
          code: "BAD_REQUEST",
        });
      }

      // check if model already exists
      const existingModel = await ctx.db
        .select({
          gpus: Model.requiredGpus,
          enabled: Model.enabled,
        })
        .from(Model)
        .where(eq(Model.name, input));
      if (existingModel.length > 0) {
        if (existingModel.at(0)!.enabled) {
          return {
            gpus: 0,
            enabled: true,
            message: "Model is already enabled. It can be used immediately.",
          };
        }
        return {
          gpus: existingModel.at(0)!.gpus,
          enabled: false,
          message: "",
        };
      }

      // Validate model exists on HuggingFace using direct model endpoint
      const response = await fetch(
        `https://huggingface.co/api/models/${organization}/${modelName}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new TRPCError({
          message: `Failed to fetch model info for "${input}" from HuggingFace: ${response.statusText}`,
          code: "BAD_REQUEST",
        });
      }

      const modelInfo = (await response.json()) as HuggingFaceModelInfo;

      // Validate model accessibility
      if (modelInfo.private || modelInfo.gated) {
        throw new TRPCError({
          message: `Model "${input}" is private or gated and is not supported`,
          code: "BAD_REQUEST",
        });
      }

      // Get library name from model info
      if (!modelInfo.library_name) {
        // Don't love this but many models on HF are transformer models but dont have the library_name set. Let the gpu estimator handle it.
        modelInfo.library_name = "transformers";
      }

      if (!["transformers", "timm"].includes(modelInfo.library_name)) {
        throw new TRPCError({
          message: `Library "${modelInfo.library_name}" for model "${input}" is not supported yet. Only transformers and timm are supported.`,
          code: "BAD_REQUEST",
        });
      }

      // Get model description from README
      let description = "No description provided";
      const readmeResponse = await fetch(
        `https://huggingface.co/${organization}/${modelName}/raw/main/README.md`,
        {
          method: "GET",
        },
      );

      if (readmeResponse.ok) {
        const readmeContent = await readmeResponse.text();
        // Skip YAML frontmatter if it exists
        const contentWithoutFrontmatter = readmeContent.replace(
          /^---\n[\s\S]*?\n---\n/,
          "",
        );

        // Split into lines and find first real paragraph
        const lines = contentWithoutFrontmatter.split("\n");
        const paragraphLines: string[] = [];

        for (const line of lines) {
          const trimmedLine = line.trim();
          // Skip empty lines, headings, and common markdown elements
          if (
            !trimmedLine ||
            trimmedLine.startsWith("#") ||
            trimmedLine.startsWith("---") ||
            trimmedLine.startsWith("|") ||
            trimmedLine.startsWith("```") ||
            trimmedLine.startsWith("<!--") ||
            trimmedLine.startsWith("- ")
          ) {
            if (paragraphLines.length > 0) break; // We found a paragraph, stop at next special element
            continue;
          }
          paragraphLines.push(trimmedLine);
        }

        if (paragraphLines.length > 0) {
          description = paragraphLines.join(" ");
        }
      }

      //  common model properties
      const supportedEndpoints = modelInfo.config?.tokenizer_config
        ?.chat_template
        ? ["COMPLETION", "CHAT"]
        : ["COMPLETION"];

      if (
        !modelInfo.pipeline_tag ||
        !(MODALITIES as readonly string[]).includes(modelInfo.pipeline_tag)
      ) {
        throw new TRPCError({
          message: `Model "${input}" has unsupported modality: ${modelInfo.pipeline_tag}. Supported modalities are: ${MODALITIES.join(", ")}`,
          code: "BAD_REQUEST",
        });
      }
      const modality = modelInfo.pipeline_tag as (typeof MODALITIES)[number];

      // For transformers models, check config
      if (modelInfo.library_name === "transformers") {
        if (!modelInfo.config) {
          throw new TRPCError({
            message: `Tried to load "${input}" with transformers but it does not have any metadata.`,
            code: "BAD_REQUEST",
          });
        }
      }

      // Now try to get the GPU requirements - if this fails with 500, it needs custom build
      const gpuResponse = await fetch(`${env.HUB_API_ESTIMATE_GPU_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelInfo.id,
          library_name: modelInfo.library_name,
        }),
      });

      if (gpuResponse.status === 500) {
        await ctx.db.insert(Model).values({
          name: modelInfo.id,
          modality,
          requiredGpus: 0,
          supportedEndpoints,
          cpt: 0,
          enabled: false,
          customBuild: true,
          description: description ?? "No description provided",
        });
        return {
          gpus: 0,
          enabled: false,
          message:
            "Model requires custom build. It has been marked for review by our team.",
        };
      }

      if (!gpuResponse.ok) {
        throw new TRPCError({
          message: `Failed to estimate GPU requirements for model "${input}": ${gpuResponse.statusText}`,
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const gpuData = (await gpuResponse.json()) as { required_gpus: number };

      if (!gpuData.required_gpus) {
        throw new TRPCError({
          message: `Failed getting required GPUs for model "${input}"`,
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      if (gpuData.required_gpus > 8) {
        throw new TRPCError({
          message: `Model "${input}" requires ${gpuData.required_gpus} GPUs, which exceeds our limit of 8 GPUs. We will not be able to run this model.`,
          code: "BAD_REQUEST",
        });
      }

      // Add the model to the database
      await ctx.db.insert(Model).values({
        name: modelInfo.id,
        modality,
        requiredGpus: gpuData.required_gpus,
        supportedEndpoints,
        cpt: gpuData.required_gpus,
        enabled: false,
        customBuild: false,
        description: description ?? "No description provided",
      });

      return {
        gpus: gpuData.required_gpus,
        enabled: false,
        message: "",
      };
    }),
  getImmunityTimeline: publicAuthlessProcedure.query(async ({ ctx }) => {
    const models = await ctx.db
      .select({
        name: Model.name,
        enabled: Model.enabled,
        enabledDate: Model.enabledDate,
      })
      .from(Model)
      .where(eq(Model.enabled, true))
      .orderBy(asc(Model.enabledDate));

    return models.map((model) => ({
      ...model,
      enabledDate: model.enabledDate
        ? new Date(model.enabledDate).toLocaleDateString()
        : null,
      immunityEnds: model.enabledDate
        ? new Date(
            new Date(model.enabledDate).getTime() + 7 * 24 * 60 * 60 * 1000,
          ).toLocaleDateString()
        : null,
    }));
  }),
  getThreeClosestImmunityEnds: publicAuthlessProcedure.query(
    async ({ ctx }) => {
      const models = await ctx.db
        .select({
          name: Model.name,
          enabled: Model.enabled,
          enabledDate: Model.enabledDate,
        })
        .from(Model)
        .where(eq(Model.enabled, true))
        .orderBy(asc(Model.enabledDate))
        .limit(3);

      return models.map((model) => ({
        ...model,
        enabledDate: model.enabledDate
          ? new Date(model.enabledDate).toLocaleDateString()
          : null,
        immunityEnds: model.enabledDate
          ? new Date(
              new Date(model.enabledDate).getTime() + 7 * 24 * 60 * 60 * 1000,
            ).toLocaleDateString()
          : null,
      }));
    },
  ),
  getModelPreview: publicAuthlessProcedure.query(async ({ ctx }) => {
    const models = await ctx.db
      .select({
        name: Model.name,
        endpoints: Model.supportedEndpoints,
        description: Model.description,
        modality: Model.modality,
        totalTokens: DailyModelTokenCounts.totalTokens,
      })
      .from(Model)
      .leftJoin(
        DailyModelTokenCounts,
        eq(Model.name, DailyModelTokenCounts.modelName),
      )
      .where(
        and(
          eq(Model.enabled, true),
          gte(DailyModelTokenCounts.createdAt, sql`CURDATE() - INTERVAL 1 DAY`),
        ),
      )
      .orderBy(desc(DailyModelTokenCounts.totalTokens))
      .limit(3);

    return models;
  }),
  getTopModelsByTPS: publicAuthlessProcedure.query(async ({ ctx }) => {
    const topModels = await ctx.db
      .select({
        modelName: DailyModelTokenCounts.modelName,
        avgTPS: sql<number>`MAX(${DailyModelTokenCounts.avgTPS})`.mapWith(
          Number,
        ),
        requiredGpus: Model.requiredGpus,
        cpt: Model.cpt,
      })
      .from(DailyModelTokenCounts)
      .leftJoin(Model, eq(DailyModelTokenCounts.modelName, Model.name))
      .where(
        gte(DailyModelTokenCounts.createdAt, sql`DATE(NOW()) - INTERVAL 7 DAY`),
      )
      .groupBy(DailyModelTokenCounts.modelName, Model.requiredGpus, Model.cpt)
      .orderBy(desc(sql`MAX(${DailyModelTokenCounts.avgTPS})`))
      .limit(6);

    return topModels;
  }),
  getModelDailyStats: publicAuthlessProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const dailyStats = await ctx.db
        .select({
          modelName: DailyModelTokenCounts.modelName,
          totalTokens: DailyModelTokenCounts.totalTokens,
          createdAt: DailyModelTokenCounts.createdAt,
          avgTPS: DailyModelTokenCounts.avgTPS,
          cpt: Model.cpt,
        })
        .from(DailyModelTokenCounts)
        .leftJoin(Model, eq(DailyModelTokenCounts.modelName, Model.name))
        .where(
          and(
            eq(DailyModelTokenCounts.modelName, input),
            sql`DATE(${DailyModelTokenCounts.createdAt}) >= DATE(NOW() - INTERVAL 7 DAY)`,
          ),
        )
        .orderBy(asc(DailyModelTokenCounts.createdAt));

      return dailyStats;
    }),
  getOrganizations: publicAuthlessProcedure.query(async ({ ctx }) => {
    const models = await ctx.db
      .select({
        name: Model.name,
      })
      .from(Model);

    const orgs = Array.from(
      new Set(
        models
          .map((model) => model.name?.split("/")[0])
          .filter((org): org is string => org !== undefined),
      ),
    ).sort();

    return orgs;
  }),
});
