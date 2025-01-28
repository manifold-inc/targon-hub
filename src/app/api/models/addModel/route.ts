import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { MODALITIES, Model } from "@/schema/schema";

interface HuggingFaceModelInfo {
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

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { modelId } = z
      .object({ modelId: z.string().min(1) })
      .parse(await request.json());

    const [organization, modelName] = modelId.split("/");
    if (!organization || !modelName) {
      return Response.json({
        error: `Invalid model ID format for "${modelId}". Expected: organization/modelName`,
        status: 400,
      });
    }

    // check if model already exists
    const [existingModel] = await db
      .select({
        enabled: Model.enabled,
      })
      .from(Model)
      .where(eq(Model.name, modelId));

    if (existingModel) {
      if (existingModel.enabled) {
        return Response.json({
          error: `Model "${modelId}" is already enabled. It can be used immediately.`,
          status: 400,
        });
      }
      return Response.json({
        error: `Model "${modelId}" already exists`,
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
        error: `Failed to fetch model info for "${modelId}" from HuggingFace: ${response.statusText}`,
        status: 404,
      });
    }

    const modelInfo = (await response.json()) as HuggingFaceModelInfo;

    // Validate model accessibility
    if (modelInfo.private || modelInfo.gated) {
      return Response.json({
        error: `Model "${modelId}" is private or gated and is not supported`,
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
        error: `Library "${modelInfo.library_name}" for model "${modelId}" is not supported yet. Only transformers and timm are supported.`,
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
        error: `Model "${modelId}" has unsupported modality: ${modelInfo.pipeline_tag}. Supported modalities are: ${MODALITIES.join(", ")}`,
        status: 400,
      });
    }

    return Response.json({ message: "Model added", status: 200 });
  } catch (err) {
    return Response.json({ error: "Invalid request", status: 400 });
  }
}
