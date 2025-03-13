import { cookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, gte, sql, sum } from "drizzle-orm";
import { Scrypt } from "lucia";
import { z } from "zod";

import {
  ApiKey,
  CheckoutSession,
  Model,
  Request,
  TaoTransfers,
  User,
} from "@/schema/schema";
import { createAccount, lucia } from "@/server/auth";
import { createTRPCRouter, publicProcedure, stripeProcedure } from "../trpc";

export const accountRouter = createTRPCRouter({
  getUser: publicProcedure.query(async ({ ctx }) => {
    // Public so it doesnt error if not logged in
    if (!ctx.user?.id) return null;
    const [user] = await ctx.db
      .select({
        credits: User.credits,
        id: User.id,
      })
      .from(User)
      .where(eq(User.id, ctx.user.id));
    return user ?? null;
  }),
  signIn: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select({ id: User.id, password: User.password })
        .from(User)
        .where(eq(User.email, input.email));
      if (!user?.password)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Invalid Credentials",
        });
      const validPassword = await new Scrypt().verify(
        user.password,
        input.password,
      );
      if (!validPassword)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Invalid Credentials",
        });
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }),
  createAccount: stripeProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      if (!email.includes("@") || !email.includes(".") || email.length < 3) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Email" });
      }
      if (password.length < 8 || password.length > 255) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Password should be atleast 8 characters",
        });
      }
      const [existing] = await ctx.db
        .select({ id: User.id })
        .from(User)
        .where(eq(User.email, email));
      if (existing)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Account already Exists",
        });

      const userId = await createAccount({
        db: ctx.db,
        stripe: ctx.stripe,
        email,
        password,
      });

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return;
    }),
  getUserDashboard: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) return null;

    const [user] = await ctx.db
      .select({
        id: User.id,
        email: User.email,
        credits: User.credits,
        apiKeyCount: count(ApiKey.key),
        ss58: User.ss58,
      })
      .from(User)
      .leftJoin(ApiKey, eq(ApiKey.userId, User.id))
      .where(eq(User.id, ctx.user.id))
      .groupBy(User.id);

    return user ?? null;
  }),
  getUserPaymentHistory: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) return null;

    // Get Stripe payments
    const checkoutSessions = await ctx.db
      .select({
        credits: CheckoutSession.credits,
        cardLast4: CheckoutSession.cardLast4,
        cardBrand: CheckoutSession.cardBrand,
        createdAt: CheckoutSession.createdAt,
      })
      .from(CheckoutSession)
      .where(eq(CheckoutSession.userId, ctx.user.id))
      .limit(10);

    // Get TAO transfers
    const taoTransfers = await ctx.db
      .select({
        credits: TaoTransfers.credits,
        createdAt: TaoTransfers.createdAt,
        txHash: TaoTransfers.tx_hash,
        rao: TaoTransfers.rao,
        pricedAt: TaoTransfers.priced_at,
      })
      .from(TaoTransfers)
      .where(eq(TaoTransfers.userId, ctx.user.id))
      .limit(10);

    // Combine and sort both payment types
    const allPayments = [
      ...checkoutSessions.map((c) => ({ ...c, type: "stripe" as const })),
      ...taoTransfers.map((t) => ({ ...t, type: "tao" as const })),
    ].sort(
      (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    );

    return allPayments;
  }),
  getUserActivity: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) return null;
    const activity = await ctx.db
      .select({
        id: Request.id,
        createdAt: Request.createdAt,
        model: Model.name,
        creditsUsed: Request.usedCredits,
        responseTokens: Request.responseTokens,
      })
      .from(Request)
      .leftJoin(Model, eq(Request.model, Model.id))
      .where(eq(Request.userId, ctx.user.id))
      .orderBy(desc(Request.createdAt))
      .limit(100);
    return activity ?? null;
  }),
  getUserActivityMonthly: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) return null;
    // Get date from 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const rawActivity = await ctx.db
      .select({
        date: sql<string>`DATE(${Request.createdAt})`,
        model: Model.name,
        totalResponseTokens: sum(Request.responseTokens),
        requestCount: count(),
      })
      .from(Request)
      .leftJoin(Model, eq(Request.model, Model.id))
      .where(
        and(
          eq(Request.userId, ctx.user.id),
          gte(Request.createdAt, thirtyDaysAgo),
        ),
      )
      .groupBy(sql`DATE(${Request.createdAt})`, Model.name)
      .orderBy(sql`DATE(${Request.createdAt})`);

    if (!rawActivity?.length) return null;

    // Get unique models
    const models = new Set<string>();
    rawActivity.forEach((item) => {
      if (item.model) models.add(item.model);
    });

    // Create a map to store data by date
    const dataByDate = new Map<string, Record<string, number>>();

    // Initialize all dates with all models set to 0
    rawActivity.forEach((item) => {
      const dateStr = item.date;
      if (dateStr && !dataByDate.has(dateStr)) {
        const modelData: Record<string, number> = {};
        Array.from(models).forEach((model) => {
          modelData[model] = 0;
        });
        dataByDate.set(dateStr, modelData);
      }
    });

    // Fill in the actual values
    rawActivity.forEach((item) => {
      const dateStr = item.date;
      if (dateStr) {
        const dateData = dataByDate.get(dateStr);
        if (dateData && item.model) {
          dateData[item.model] = Number(item.totalResponseTokens) || 0;
        }
      }
    });

    // Convert map to array and sort by date
    return Array.from(dataByDate.entries())
      .map(([date, modelData]) => ({
        date,
        ...modelData,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }),

  getTaoPrice: publicProcedure.query(async () => {
    const res = await fetch(
      "https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=0x410f41de235f2db824e562ea7ab2d3d3d4ff048316c61d629c0b93f58584e1af",
    );
    const body = (await res.json()) as {
      parsed: { price: { price: string } }[];
    };
    const result = Number(body.parsed[0]?.price.price) / 1e8;
    if (result == 0) {
      return null;
    }
    return result;
  }),
});
