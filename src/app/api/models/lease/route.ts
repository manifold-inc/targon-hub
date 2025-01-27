import { type NextRequest } from "next/server";
import { eq, inArray } from "drizzle-orm";

import { COST_PER_GPU, CREDIT_PER_DOLLAR, MAX_GPU_SLOTS } from "@/constants";
import { db } from "@/schema/db";
import { ApiKey, Model, ModelLeasing, User } from "@/schema/schema";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    /**
     * Authenticate user
     * grab user, credits, and wallet address from db
     */
    const auth = request.headers.get("Authorization");
    const token = auth?.split(" ").at(-1);
    if (!token) {
      return Response.json({ error: "Unauthorized", status: 401 });
    }
    const [user] = await db
      .select({ credits: User.credits, ss58: User.ss58, id: User.id })
      .from(User)
      .innerJoin(ApiKey, eq(User.id, ApiKey.userId))
      .where(eq(ApiKey.key, token));
    if (!user) {
      return Response.json({ error: "Unauthorized", status: 401 });
    }

    /**
     * Grab model from db
     * check if model exists
     * check if model is enabled
     * check if user has enough credits
     * calculate gpu slots?
     * remove models to make room? models that are enabled for the longest with no subscription
     * update model db - enabled = true, enabledDate = now
     * update user db - credits = user.credits - gpu * cost per gpu
     * create leasing record - userId, modelName, amount
     */

    const requestedModelName = request.headers.get("Model-Name");
    if (!requestedModelName) {
      return Response.json({ error: "Model name is required", status: 400 });
    }

    const [model] = await db
      .select()
      .from(Model)
      .where(eq(Model.name, requestedModelName));
    if (!model) {
      return Response.json({ error: "Model not found", status: 404 });
    }
    if (model.enabled) {
      return Response.json({ error: "Model is already enabled", status: 400 });
    }
    if (model.requiredGpus > 8) {
      return Response.json({
        error: "Cannot lease more than 8 GPUs",
        status: 400,
      });
    }
    if (user.credits < 0) {
      return Response.json({
        error: "Insufficient credits to lease this model",
        status: 400,
      });
    }

    const immunityPeriod = 7 * 24 * 60 * 60 * 1000;
    const now = new Date();

    // Calculate how many gpu slots are currently used
    const enabledModels = await db
      .select()
      .from(Model)
      .where(eq(Model.enabled, true));
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
    const requestedGPU = model.requiredGpus;

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
        .set({ enabled: true, enabledDate: null })
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
    return Response.json({ status: 200 });
  } catch (err) {
    return new Response(`Error: ${err instanceof Error && err.message}`, {
      status: 400,
    });
  }
}
