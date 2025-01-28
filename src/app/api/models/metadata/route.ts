import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/schema/db";
import { Model } from "@/schema/schema";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { requestedModelName } = await request.json();
    const [model] = await db
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
      .where(eq(Model.name, requestedModelName));
    if (!model) {
      return Response.json({ error: "Model not found", status: 404 });
    }
    return Response.json(model);
  } catch (error) {
    return Response.json({ error: "Invalid request", status: 400 });
  }
}
