import { cookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { count, desc, eq } from "drizzle-orm";
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
        createdAt: Request.createdAt,
        model: Model.name,
        tokens: Request.tokens,
        creditsUsed: Request.creditsUsed,
      })
      .from(Request)
      .leftJoin(Model, eq(Request.model, Model.id))
      .where(eq(Request.userId, ctx.user.id))
      .orderBy(desc(Request.createdAt))
      .limit(100);
    return activity ?? null;
  }),
});
