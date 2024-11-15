import { cache } from "react";
import { cookies } from "next/headers";
import { Google } from "arctic";
import { Lucia, Scrypt, type User as LuciaUser, type Session } from "lucia";

import { env } from "@/env.mjs";
import { adapter, type DB } from "@/schema/db";
import { ApiKey, genId, User } from "@/schema/schema";
import { type stripe as STRIPE } from "./stripe";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
  }
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
});

export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI,
);

export const uncachedValidateRequest = async (): Promise<
  { user: LuciaUser; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return { user: null, session: null };
  }
  const result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (!!result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {
    // Probably trying to set during page rendering, can safely swallow
    console.error("Failed to set session cookie");
  }
  return result;
};
export const validateRequest = cache(uncachedValidateRequest);

export const createAccount = async ({
  db,
  stripe,
  email,
  googleId,
  password,
}: {
  db: DB;
  stripe: typeof STRIPE;
  email: string;
  googleId?: string;
  password?: string;
}) => {
  const userId = genId.user();
  const stripeId = await stripe.customers.create({
    email,
    metadata: { user_id: userId },
  });

  let hashedPassowrd = null;
  if (password) {
    hashedPassowrd = await new Scrypt().hash(password);
  }
  const res = await db.insert(User).values({
    pubId: userId,
    email,
    googleId,
    stripeCustomerId: stripeId.id,
    password: hashedPassowrd,
    verified: !hashedPassowrd,
  });
  const apiKey = genId.apikey();
  await db.insert(ApiKey).values({
    userId: parseInt(res.insertId),
    key: apiKey,
    name: "Default",
  });
  return parseInt(res.insertId);
};
