import { type NextRequest } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { COST_PER_GPU, CREDIT_PER_DOLLAR, MAX_GPU_SLOTS } from "@/constants";
import { db } from "@/schema/db";
import { ApiKey, Model, ModelLeasing, User } from "@/schema/schema";

export async function POST(request: NextRequest): Promise<Response> {
  const auth = request.headers.get("Authorization");
  const token = auth?.split(" ").at(-1);
  if (!token) {
    return Response.json({ error: "Unauthorized", status: 401 });
  }
  const [user] = await db
    .select({ credits: User.credits, id: User.id })
    .from(User)
    .innerJoin(ApiKey, eq(User.id, ApiKey.userId))
    .where(eq(ApiKey.key, token));
  if (!user) {
    return Response.json({ error: "Unauthorized", status: 401 });
  }

  const { requestedModelName } = z
    .object({ requestedModelName: z.string() })
    .parse(await request.json());
  if (!requestedModelName) {
    return Response.json({ error: "Model name is required", status: 400 });
  }

  try {
    const [[currentModel], enabledModels] = await Promise.all([
      db
        .select({
          name: Model.name,
          requiredGpus: Model.requiredGpus,
          enabled: Model.enabled,
        })
        .from(Model)
        .where(eq(Model.name, requestedModelName)),

      db
        .select({
          name: Model.name,
          requiredGpus: Model.requiredGpus,
          enabledDate: Model.enabledDate,
        })
        .from(Model)
        .where(eq(Model.enabled, true)),
    ]);

    if (!currentModel) {
      return Response.json({ error: "Model not found", status: 404 });
    }
    if (currentModel.enabled) {
      return Response.json({ error: "Model is already enabled", status: 400 });
    }
    if (currentModel.requiredGpus > 8) {
      return Response.json({
        error: "Cannot lease more than 8 GPUs",
        status: 400,
      });
    }
    if (user.credits < currentModel.requiredGpus * Number(COST_PER_GPU)) {
      return Response.json({
        error: "Insufficient funds to lease this model",
        message: `User has $${user.credits / Number(CREDIT_PER_DOLLAR)}, but requires $${(currentModel.requiredGpus * Number(COST_PER_GPU)) / Number(CREDIT_PER_DOLLAR)} to lease this model`,
        status: 400,
      });
    }

    const immunityPeriod = 7 * 24 * 60 * 60 * 1000;
    const now = new Date();

    // Calculate how many gpu slots are currently used
    const eligibleForRemoval = enabledModels
      .filter((model) => {
        if (!model.enabledDate) return false;
        return now.getTime() - model.enabledDate.getTime() > immunityPeriod;
      })
      .sort((a, b) => b.enabledDate!.getTime() - a.enabledDate!.getTime());

    const currentGPUUsage = enabledModels.reduce(
      (sum, model) => sum + (model.requiredGpus ?? 0),
      0,
    );
    const requestedGPU = currentModel.requiredGpus;

    // Check if we need to remove to make room
    if (currentGPUUsage + requestedGPU > MAX_GPU_SLOTS) {
      let gpuToRemove = currentGPUUsage + requestedGPU - MAX_GPU_SLOTS;
      const modelsToDisable = [];

      for (const model of eligibleForRemoval) {
        if (gpuToRemove <= 0) break;
        modelsToDisable.push(model.name);
        gpuToRemove -= model.requiredGpus;
      }

      if (gpuToRemove > 0) {
        return Response.json({
          error: `Cannot free up enough GPU slots. Need ${gpuToRemove} more GPUs. Try again when more models become eligible for removal.`,
          status: 400,
        });
      }

      await db
        .update(Model)
        .set({ enabled: false, enabledDate: null })
        .where(
          inArray(
            Model.name,
            modelsToDisable.filter((name): name is string => name !== null),
          ),
        );
    }

    await Promise.all([
      db
        .update(Model)
        .set({ enabled: true, enabledDate: now })
        .where(eq(Model.name, requestedModelName)),

      db
        .update(User)
        .set({ credits: user.credits - requestedGPU * Number(COST_PER_GPU) })
        .where(eq(User.id, user.id)),

      db.insert(ModelLeasing).values({
        userId: user.id,
        modelName: requestedModelName,
        amount:
          (requestedGPU * Number(COST_PER_GPU)) / Number(CREDIT_PER_DOLLAR),
      }),
    ]);
    return Response.json({
      message: `Model ${requestedModelName} leased`,
      status: 200,
    });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({
        error: "Failed to lease model",
        details: err.message,
        status: 500,
      });
    }
    return Response.json({
      error: "Failed to lease model",
      details: "An unknown error occurred",
      status: 500,
    });
  }
}
