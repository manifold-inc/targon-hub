import { type inferReactQueryProcedureOptions } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { accountRouter } from "./account";
import { coreRouter } from "./core";
import { creditsRouter } from "./credits";
import { minerRouter } from "./miner";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  account: accountRouter,
  credits: creditsRouter,
  core: coreRouter,
  miner: minerRouter,
});

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// export type definition of API
export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
