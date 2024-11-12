import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { env } from "@/env.mjs";
import { Model } from "@/schema/schema";
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
  config?: {
    tokenizer_config?: {
      chat_template?: string;
    };
  };
}

export const modelRouter = createTRPCRouter({
  getModels: publicAuthlessProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(Model);
  }),
  getModelFilters: publicAuthlessProcedure.query(async ({ ctx }) => {
    const models = await ctx.db
      .select({
        name: Model.name,
        modality: Model.modality,
        supportedEndpoints: Model.supportedEndpoints,
      })
      .from(Model);

    // Extract unique organizations and modalities
    const organizations = new Set(
      models.map((model) => model.name?.split("/")[0]).filter(Boolean),
    );

    const modalities = new Set(
      models.map((model) => model.modality).filter(Boolean),
    );

    const supportedEndpoints = new Set(
      models.map((model) => model.supportedEndpoints).filter(Boolean),
    );

    return {
      organizations: Array.from(organizations),
      modalities: Array.from(modalities),
      supportedEndpoints: Array.from(supportedEndpoints),
    };
  }),
  getModelsInfo: publicAuthlessProcedure.query(async ({ ctx }) => {
    const models = await ctx.db
      .select({
        modelName: Model.name,
        modality: Model.modality,
        description: Model.description,
        enabled: Model.enabled,
        cpt: Model.cpt,
        supportedEndpoints: Model.supportedEndpoints,
      })
      .from(Model);

    return models.map((model) => {
      const [organization, name] = model.modelName?.split("/") ?? [];
      return {
        ...model,
        organization,
        name,
        description: model.description,
      };
    });
  }),
  getModelInfo: publicAuthlessProcedure
    .input(z.object({ model: z.string() }))
    .query(async ({ ctx, input }) => {
      const model = await ctx.db
        .select({
          name: Model.name,
          cpt: Model.cpt,
          enabled: Model.enabled,
          createdAt: Model.createdAt,
          modality: Model.modality,
          description: Model.description,
          supportedEndpoints: Model.supportedEndpoints,
        })
        .from(Model)
        .where(eq(Model.name, input.model));

      const [organization, name] = model[0]?.name?.split("/") ?? [];
      return {
        ...model[0],
        organization,
        name,
      };
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
        })
        .from(Model)
        .where(eq(Model.name, input));
      if (existingModel.length > 0) {
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
        !modelInfo.pipeline_tag ||
        !Modality.includes(modelInfo.pipeline_tag as ModalityType)
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

      const gpuResponse = await fetch(`${env.HUB_API_ENDPOINT}/estimate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelInfo.id,
          library_name: modelInfo.library_name,
        }),
      });

      if (!gpuResponse.ok) {
        throw new TRPCError({
          message: "Failed to estimate GPU requirements",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const gpuData = (await gpuResponse.json()) as {
        required_gpus: number;
      };
      console.log(gpuData)
      if (!gpuData.required_gpus) {
        throw new TRPCError({
          message: "Failed getting required GPUS",
          code: "INTERNAL_SERVER_ERROR",
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
});
