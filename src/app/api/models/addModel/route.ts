import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { Model } from "@/schema/schema";

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

    return Response.json({ message: "Model added", status: 200 });
  } catch (err) {
    return Response.json({ error: "Invalid request", status: 400 });
  }
}
