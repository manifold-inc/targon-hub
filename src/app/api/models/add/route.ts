import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { MODALITIES, Model } from "@/schema/schema";
import { type HuggingFaceModelInfo } from "@/server/api/model";

export async function POST(request: NextRequest): Promise<Response> {
  const { requestedModelName } = z
    .object({ requestedModelName: z.string() })
    .parse(await request.json());
  if (!requestedModelName) {
    return Response.json({ error: "Invalid input", status: 400 });
  }

  try {
    const [organization, modelName] = requestedModelName.split("/");
    if (!organization || !modelName) {
      return Response.json({
        error: `Invalid model ID format for '${requestedModelName}'. Expected: organization/modelName`,
        status: 400,
      });
    }

    // check if model already exists
    const [existingModel] = await db
      .select({
        enabled: Model.enabled,
      })
      .from(Model)
      .where(eq(Model.name, requestedModelName));

    if (existingModel) {
      if (existingModel.enabled) {
        return Response.json({
          error: `Model '${requestedModelName}' is already enabled. It can be used immediately.`,
          status: 400,
        });
      }
      return Response.json({
        error: `Model '${requestedModelName}' is not enabled but can be leased.`,
        status: 400,
      });
    }

    // Check if model exists on HuggingFace
    const response = await fetch(
      `https://huggingface.co/api/models/${organization}/${modelName}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      return Response.json({
        error: `Failed to fetch model info for '${requestedModelName}' from HuggingFace: ${response.statusText}`,
        status: 404,
      });
    }

    const modelInfo = (await response.json()) as HuggingFaceModelInfo;

    // Validate model accessibility
    if (modelInfo.private || modelInfo.gated) {
      return Response.json({
        error: `Model '${requestedModelName}' is private or gated and is not supported`,
        status: 400,
      });
    }

    // Get library name from model info
    if (!modelInfo.library_name) {
      // Don't love this but many models on HF are transformer models but dont have the library_name set. Let the gpu estimator handle it.
      modelInfo.library_name = "transformers";
    }

    if (!["transformers", "timm"].includes(modelInfo.library_name)) {
      return Response.json({
        error: `Library '${modelInfo.library_name}' for model '${requestedModelName}' is not supported yet. Only transformers and timm are supported.`,
        status: 400,
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

    // common model properties
    const supportedEndpoints = modelInfo.config?.tokenizer_config?.chat_template
      ? ["COMPLETION", "CHAT"]
      : ["COMPLETION"];

    if (
      !modelInfo.pipeline_tag ||
      !(MODALITIES as readonly string[]).includes(modelInfo.pipeline_tag)
    ) {
      return Response.json({
        error: `Model '${requestedModelName}' has unsupported modality: ${modelInfo.pipeline_tag}. Supported modalities are: ${MODALITIES.join(", ")}`,
        status: 400,
      });
    }
    const modality = modelInfo.pipeline_tag as (typeof MODALITIES)[number];

    // For transformers models, check config
    if (modelInfo.library_name === "transformers") {
      if (!modelInfo.config) {
        return Response.json({
          error: `Tried to load '${requestedModelName}' with transformers but it does not have any metadata.`,
          status: 400,
        });
      }
    }

    // Now try to get the GPU requirements - if this fails with 500, it needs custom build
    const gpuResponse = await fetch(
      `${process.env.HUB_API_ESTIMATE_GPU_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelInfo.id,
          library_name: modelInfo.library_name,
        }),
      },
    );

    if (gpuResponse.status === 500) {
      await db.insert(Model).values({
        name: modelInfo.id,
        modality,
        requiredGpus: 0,
        supportedEndpoints,
        cpt: 0,
        enabled: false,
        customBuild: true,
        description: description ?? "No description provided",
      });
      return Response.json({
        message:
          "Model requires custom build. It has been marked for review by our team.",
        status: 200,
      });
    }

    if (!gpuResponse.ok) {
      return Response.json({
        error: `Failed to estimate GPU requirements for model '${requestedModelName}': ${gpuResponse.statusText}`,
        status: 500,
      });
    }

    const gpuData = (await gpuResponse.json()) as { required_gpus: number };

    if (!gpuData.required_gpus) {
      return Response.json({
        error: `Failed getting required GPUs for model '${requestedModelName}'`,
        status: 500,
      });
    }

    if (gpuData.required_gpus > 8) {
      return Response.json({
        error: `Model '${requestedModelName}' requires ${gpuData.required_gpus} GPUs, which exceeds our limit of 8 GPUs. We will not be able to run this model.`,
        status: 400,
      });
    }

    await db.insert(Model).values({
      name: modelInfo.id,
      modality,
      requiredGpus: gpuData.required_gpus,
      supportedEndpoints,
      cpt: gpuData.required_gpus,
      enabled: false,
      customBuild: false,
      description: description ?? "No description provided",
    });

    return Response.json({
      message: `Model '${requestedModelName}' added`,
      status: 200,
    });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({
        error: "Failed to add model",
        details: err.message,
        status: 500,
      });
    }
    return Response.json({
      error: "Failed to add model",
      details: "An unknown error occurred",
      status: 500,
    });
  }
}
