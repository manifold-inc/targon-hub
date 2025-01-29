import { type NextRequest } from "next/server";
import { inArray } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/schema/db";
import { Model } from "@/schema/schema";

export async function POST(request: NextRequest): Promise<Response> {
  const { requestedModelName } = z
    .object({ requestedModelName: z.array(z.string()) })
    .parse(await request.json());
  if (requestedModelName.length === 0) {
    return Response.json({ error: "Invalid input", status: 400 });
  }
  try {
    const model = await db
      .select({
        name: Model.name,
        id: Model.id,
        enabled: Model.enabled,
        createdAt: Model.createdAt,
        requiredGps: Model.requiredGpus,
        modality: Model.modality,
        description: Model.description,
        supportedEndpoints: Model.supportedEndpoints,
      })
      .from(Model)
      .where(inArray(Model.name, requestedModelName));
    if (model.length === 0) {
      return Response.json({ error: "Model not found", status: 404 });
    }
    return Response.json(model);
  } catch (error) {
    return Response.json({ error: "Invalid request", status: 400 });
  }
}
