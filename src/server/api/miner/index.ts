import { and, desc, eq, gte, or, sql } from "drizzle-orm";
import { z } from "zod";

import { MinerResponse, ValidatorRequest } from "@/schema/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

function getStatsSchema(version: number) {
  switch (true) {
    case version > 204050:
      return z.object({
        uid: z.number(),
        hotkey: z.string(),
        coldkey: z.string(),
        block: z.number(),
        jaro_avg: z.number().optional(),
        wps: z.number().optional(),
        total_time: z.number().optional(),
        time_for_all_tokens: z.number().optional(),
        time_to_first_token: z.number().optional(),
      });
    default:
      return z.object({
        jaro_score: z.number().nullable(),
        words_per_second: z.number(),
        time_for_all_tokens: z.number(),
        total_time: z.number(),
        time_to_first_token: z.number(),
      });
  }
}

export const minerRouter = createTRPCRouter({
  globalAvgStats: publicProcedure
    .input(z.object({ verified: z.boolean() }))
    .query(async ({ input, ctx }) => {
      const latestVersion = await ctx.db
        .select({ version: ValidatorRequest.version })
        .from(ValidatorRequest)
        .orderBy(desc(ValidatorRequest.block))
        .limit(1)
        .then((result) => result[0]?.version ?? 1);

      const stats = await ctx.db
        .select({
          minute:
            sql<string>`DATE_TRUNC('MINUTES', ${ValidatorRequest.timestamp})`.mapWith(
              (v: string) => {
                const date = new Date(v);
                const utc = Date.UTC(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  date.getHours(),
                  date.getMinutes(),
                );
                return utc;
              },
            ),
          avg_jaro:
             sql<number>`
                AVG(
                  (SELECT AVG(value::float) 
                   FROM jsonb_array_elements(${MinerResponse.stats}->'jaros'))
                )`.mapWith(Number),
          avg_wps:
            sql<number>`AVG(CAST(${MinerResponse.stats}->'wps' AS DECIMAL))`.mapWith(
              Number,
            ),
          avg_time_for_all_tokens:
            sql<number>`AVG(CAST(${MinerResponse.stats}->'time_for_all_tokens' AS DECIMAL))`.mapWith(
              Number,
            ),
          avg_total_time:
            sql<number>`AVG(CAST(${MinerResponse.stats}->'total_time' AS DECIMAL))`.mapWith(
              Number,
            ),
          avg_time_to_first_token:
            sql<number>`AVG(CAST(${MinerResponse.stats}->'time_to_first_token' AS DECIMAL))`.mapWith(
              Number,
            ),
        })
        .from(MinerResponse)
        .innerJoin(
          ValidatorRequest,
          eq(ValidatorRequest.r_nanoid, MinerResponse.r_nanoid),
        )
        .where(
          and(
            gte(ValidatorRequest.timestamp, sql`NOW() - INTERVAL '2 hours'`),
            gte(ValidatorRequest.version, 204070),
            ...(input.verified
              ? [
                  eq(
                    sql`CAST(${MinerResponse.stats}->'verified' AS BOOLEAN)`,
                    input.verified,
                  ),
                ]
              : []),
          ),
        )
        .groupBy(sql`DATE_TRUNC('MINUTES', ${ValidatorRequest.timestamp})`)
        .orderBy(desc(sql`DATE_TRUNC('MINUTES', ${ValidatorRequest.timestamp})`));


      return stats;
    }),

  stats: publicProcedure
    .input(
      z.object({
        query: z.string(),
        block: z.number().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { query, block } = input;

      const latestBlock = await ctx.db
        .select({ maxBlock: sql<number>`MAX(${ValidatorRequest.block})` })
        .from(ValidatorRequest)
        .then((result) => result[0]?.maxBlock ?? 0);

      const startBlock = latestBlock - Math.min(block!, 360);

      const latestVersion = await ctx.db
        .select({ version: ValidatorRequest.version })
        .from(ValidatorRequest)
        .orderBy(desc(ValidatorRequest.block))
        .limit(1)
        .then((result) => result[0]?.version ?? 1);

      const schema = getStatsSchema(latestVersion);

      const eqs =
        query.length < 5
          ? [eq(MinerResponse.uid, parseInt(query))]
          : [eq(MinerResponse.hotkey, query), eq(MinerResponse.coldkey, query)];

      const stats: typeof schema[] = await ctx.db
        .select({
          uid: MinerResponse.uid,
          hotkey: MinerResponse.hotkey,
          coldkey: MinerResponse.coldkey,
          block: ValidatorRequest.block,
          jaro_avg: sql<number>`
            (CASE
              WHEN ${MinerResponse.stats}->'jaros' IS NOT NULL
              THEN
                (SELECT AVG(value::float) 
                FROM jsonb_array_elements(${MinerResponse.stats}->'jaros'))
              ELSE 0
            END)`.mapWith(Number),
          wps: sql<number>`COALESCE(${MinerResponse.stats}->>'wps', '0')::DECIMAL`.mapWith(
            Number,
          ),
          total_time:
            sql<number>`COALESCE(${MinerResponse.stats}->>'total_time', '0')::DECIMAL`.mapWith(
              Number,
            ),
          time_for_all_tokens:
            sql<number>`COALESCE(${MinerResponse.stats}->>'time_for_all_tokens', '0')::DECIMAL`.mapWith(
              Number,
            ),
          time_to_first_token:
            sql<number>`COALESCE(${MinerResponse.stats}->>'time_to_first_token', '0')::DECIMAL`.mapWith(
              Number,
            ),
        })
        .from(MinerResponse)
        .innerJoin(
          ValidatorRequest,
          eq(ValidatorRequest.r_nanoid, MinerResponse.r_nanoid),
        )
        .where(and(gte(ValidatorRequest.block, startBlock), or(...eqs)))
        .orderBy(desc(ValidatorRequest.block));

      return stats.reverse();

    }),

  getResponses: publicProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { query } = input;

      const eqs =
        query.length < 5
          ? [eq(MinerResponse.uid, parseInt(query))]
          : [eq(MinerResponse.hotkey, query), eq(MinerResponse.coldkey, query)];
      const results = await ctx.db
        .select({
          response: sql<string>`${MinerResponse.stats}->'response'`,
          ground_truth: sql<string>`${ValidatorRequest.ground_truth}->'ground_truth'`,
          prompt: sql<string>`${ValidatorRequest.ground_truth}->'messages'`,
          hotkey: MinerResponse.hotkey,
          seed: sql<string>`${ValidatorRequest.sampling_params}->'seed'`,
          top_k: sql<string>`${ValidatorRequest.sampling_params}->'top_k'`,
          top_p: sql<string>`${ValidatorRequest.sampling_params}->'top_p'`,
          best_of: sql<string>`${ValidatorRequest.sampling_params}->'best_of'`,
          typical_p: sql<string>`${ValidatorRequest.sampling_params}->'typical_p'`,
          temperature: sql<string>`${ValidatorRequest.sampling_params}->'temperature'`,
          top_n_tokens: sql<string>`${ValidatorRequest.sampling_params}->'top_n_tokens'`,
          max_n_tokens: sql<string>`${ValidatorRequest.sampling_params}->'max_new_tokens'`,
          repetition_penalty: sql<string>`${ValidatorRequest.sampling_params}->'repetition_penalty'`,
          verified: sql<boolean>`${MinerResponse.stats}->'verified'`,
          avg_jaro_score: sql<number>`
          (CASE
            WHEN ${MinerResponse.stats}->'jaros' IS NOT NULL
            THEN
              (SELECT AVG((value::numeric)::float) 
              FROM jsonb_array_elements(${MinerResponse.stats}->'jaros'))
            ELSE 0
          END)`.mapWith(Number),
          jaros: sql<number[]>`${MinerResponse.stats}->'jaros'`,
          words_per_second:
            sql<number>`CAST(${MinerResponse.stats}->'wps' AS DECIMAL)`.mapWith(
              Number,
            ),
          time_for_all_tokens:
            sql<number>`CAST(${MinerResponse.stats}->'time_for_all_tokens' AS DECIMAL)`.mapWith(
              Number,
            ),
          total_time:
            sql<number>`CAST(${MinerResponse.stats}->'total_time' AS DECIMAL)`.mapWith(
              Number,
            ),
          time_to_first_token:
            sql<number>`CAST(${MinerResponse.stats}->'time_to_first_token' AS DECIMAL)`.mapWith(
              Number,
            ),
        })
        .from(MinerResponse)
        .innerJoin(
          ValidatorRequest,
          eq(ValidatorRequest.r_nanoid, MinerResponse.r_nanoid),
        )
        .where(or(...eqs))
        .orderBy(desc(ValidatorRequest.timestamp))
        .limit(10);

      return results;
    }),
});
