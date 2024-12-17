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

const Modality = ["text-generation", "text-to-image"] as const;
type ModalityType = (typeof Modality)[number];

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
  cardData?: {
    license?: string;
    extra_gated_prompt?: string;
  };
  config?: {
    tokenizer_config?: {
      chat_template?: string;
    };
  };
}

// Why are we checking these? we only need to check if it has a restrictive license
//const UNRESTRICTED_LICENSES = [
//  // Highly permissive - no API key needed
//  "mit",
//  "apache-2.0",
//  "bsd",
//  "bsd-2-clause",
//  "bsd-3-clause",
//  "bsd-3-clause-clear",
//  "cc0-1.0",
//  "unlicense",
//  "bsl-1.0",
//  "isc",
//  "zlib",
//
//  // Additional open source - should work without API key
//  "gpl-2.0",
//  "gpl-3.0",
//  "lgpl-2.1",
//  "lgpl-3.0",
//  "mpl-2.0",
//  "artistic-2.0",
//  "eupl-1.1",
//  "postgresql",
//  "ncsa",
//] as const;

const RESTRICTED_ACCESS_LICENSES = [
  // Likely needs API key or authentication
  "openrail",
  "bigscience-openrail-m",
  "creativeml-openrail-m",
  "bigscience-bloom-rail-1.0",
  "bigcode-openrail-m",
  "llama2",
  "llama3",
  "llama3.1",
  "llama3.2",
  "deepfloyd-if-license",
  "gemma",
] as const;

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
        cpt: Model.cpt,
        createdAt: Model.createdAt,
      })
      .from(Model)
      .where(and(eq(Model.enabled, true)));
    return models;
  }),
  getModels: publicAuthlessProcedure
    .input(
      z.object({
        name: z.string().optional(),
        orgs: z.array(z.string()).optional(),
        modalities: z.array(z.enum(MODALITIES)).optional(),
        endpoints: z.array(z.string()).optional(),
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
          cpt: Model.cpt,
          createdAt: Model.createdAt,
        })
        .from(Model)
        .$dynamic()
        .limit(15);
      const filters = [];
      if (input.name?.length) {
        filters.push(like(Model.name, `%${input.name}%`));
      }
      if (input.orgs?.length) {
        const or_filters = [];
        for (const org of input.orgs) {
          or_filters.push(like(Model.name, `${org}%`));
        }
        filters.push(or(...or_filters));
      }
      if (input.modalities?.length) {
        filters.push(inArray(Model.modality, input.modalities));
      }
      if (input.endpoints?.length) {
        filters.push(like(Model.name, `%${input.name}%`));
      }

      return await query.where(and(...filters));
    }),
  getModelInfo: publicAuthlessProcedure
    .input(z.object({ model: z.string() }))
    .query(async ({ ctx, input }) => {
      const [model] = await ctx.db
        .select({
          name: Model.name,
          id: Model.id,
          cpt: Model.cpt,
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
          message: "Invalid model ID format. Expected: organization/modelName",
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
          return -1;
        }
        return existingModel.at(0)!.gpus;
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
          message: "Model not found on HuggingFace",
          code: "BAD_REQUEST",
        });
      }

      const modelInfo = (await response.json()) as HuggingFaceModelInfo;

      if (
        modelInfo.private ||
        modelInfo.gated ||
        modelInfo.cardData?.extra_gated_prompt
      ) {
        throw new TRPCError({
          message: "Private or gated models are not supported",
          code: "BAD_REQUEST",
        });
      }

      // Get license from model card or tags
      const modelLicense = modelInfo.cardData?.license?.toLowerCase() || "";
      const licenseTags = modelInfo.tags
        .filter((tag) => tag.startsWith("license:"))
        .map((tag) => tag.replace("license:", "").toLowerCase());

      const allLicenses = [modelLicense, ...licenseTags];

      // Check if any license requires authentication
      const hasRestrictedLicense = allLicenses.some((license) =>
        RESTRICTED_ACCESS_LICENSES.includes(
          license as (typeof RESTRICTED_ACCESS_LICENSES)[number],
        ),
      );

      if (hasRestrictedLicense) {
        throw new TRPCError({
          message:
            "Only models with unrestricted licenses that don't require API keys are supported",
          code: "BAD_REQUEST",
        });
      }

      // If license is "unknown" or "other", reject it to be safe
      if (
        allLicenses.some((license) => ["unknown", "other"].includes(license))
      ) {
        throw new TRPCError({
          message:
            "Models with unknown or unspecified licenses are not supported",
          code: "BAD_REQUEST",
        });
      }

      if (
        (!modelInfo.pipeline_tag ||
          !Modality.includes(modelInfo.pipeline_tag as ModalityType)) &&
        !modelInfo.config?.tokenizer_config
      ) {
        throw new TRPCError({
          message: `Unsupported model type. Model must be either text-generation or text-to-image. Got: ${modelInfo.pipeline_tag}`,
          code: "BAD_REQUEST",
        });
      }

      const supportedEndpoints = ["COMPLETION"];
      if (modelInfo.config?.tokenizer_config?.chat_template) {
        supportedEndpoints.push("CHAT");
      }

      let library_name = modelInfo.library_name;
      if (modelInfo.config?.tokenizer_config && !library_name) {
        library_name = "transformers";
      } else {
        library_name = "diffusers";
      }
      const gpuResponse = await fetch(
        `${env.NEXT_PUBLIC_HUB_API_ENDPOINT}/estimate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelInfo.id,
            library_name,
          }),
        },
      );

      if (!gpuResponse.ok) {
        throw new TRPCError({
          message: "Failed to estimate GPU requirements",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const gpuData = (await gpuResponse.json()) as {
        required_gpus: number;
      };
      if (!gpuData.required_gpus) {
        throw new TRPCError({
          message: "Failed getting required GPUS",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      if (gpuData.required_gpus > 8) {
        throw new TRPCError({
          message:
            "This model requires more than 8 GPUs, which exceeds our limit of 8 GPUs. We will not be able to run this model.",
          code: "BAD_REQUEST",
        });
      }

      // Try to get description from README
      let description: string | undefined;
      try {
        const readmeResponse = await fetch(
          `https://huggingface.co/${organization}/${modelName}/raw/main/README.md`,
        );
        if (readmeResponse.ok) {
          const readmeContent = await readmeResponse.text();
          const modelDescMatch = readmeContent.match(
            /#+\s*Model Description\s*(.*?)(?=\n#|\Z)/is,
          );
          description =
            modelDescMatch?.[1]?.trim() ||
            readmeContent
              .split("\n")
              .filter(
                (line) =>
                  line.trim() &&
                  !line.startsWith("#") &&
                  !line.startsWith("---") &&
                  !line.startsWith("<"),
              )
              .slice(0, 3)
              .join(" ")
              .slice(0, 1000);
        }
      } catch (error) {
        console.error("Error fetching README:", error);
      }

      await ctx.db.insert(Model).values({
        name: modelInfo.id,
        modality: modelInfo.pipeline_tag as ModalityType,
        requiredGpus: gpuData.required_gpus,
        supportedEndpoints: supportedEndpoints,
        cpt: 1 * gpuData.required_gpus,
        ...(description && { description }), // Only include if we found one
      });

      return gpuData.required_gpus;
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
  getModelPreview: publicAuthlessProcedure.query(async ({ ctx }) => {
    const models = await ctx.db
      .select({
        name: Model.name,
        endpoints: Model.supportedEndpoints,
        description: Model.description,
        modality: Model.modality,
        cpt: Model.cpt,
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
});
