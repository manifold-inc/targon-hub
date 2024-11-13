import { cookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { Scrypt } from "lucia";
import { z } from "zod";

import { ApiKey, User } from "@/schema/schema";
import { createAccount, lucia } from "@/server/auth";
import { createTRPCRouter, publicProcedure, stripeProcedure } from "../trpc";

export const accountRouter = createTRPCRouter({
  getUserId: publicProcedure.query(({ ctx }) => {
    // Public so it doesnt error if not logged in
    return ctx.user?.id ?? null;
  }),
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
        email: User.email,
        credits: User.credits,
        apiKeyCount: count(ApiKey.key),
      })
      .from(User)
      .leftJoin(ApiKey, eq(ApiKey.userId, User.id))
      .where(eq(User.id, ctx.user.id))
      .groupBy(User.id);

    return user ?? null;
  }),
});
