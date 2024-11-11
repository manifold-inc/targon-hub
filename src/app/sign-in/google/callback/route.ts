import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";

import { db } from "@/schema/db";
import { User } from "@/schema/schema";
import { createAccount, google, lucia } from "@/server/auth";
import { stripe } from "@/server/stripe";

async function handle(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier =
    cookies().get("google_code_verifier")?.value ?? null;
  const storedReturnTo = cookies().get("google_return_to")?.value ?? null;
  if (!code || !storedCodeVerifier || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      const { message, description } = e;
      console.error(`[google-callback] Token Error: ${message} ${description}`);
    }
    return new Response(null, { status: 500 });
  }

  const response = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    },
  );
  if (!response.ok) {
    console.error(`[google-callback] userinfo Error: ${response.status}`);
    return new Response(null, { status: 500 });
  }

  const user = (await response.json()) as GoogleUser;
  const [existing] = await db
    .select()
    .from(User)
    .where(eq(User.googleId, user.sub));
  const userId =
    existing?.id ??
    (await createAccount({
      db,
      stripe,
      email: user.email,
      googleId: user.sub,
    }));

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return new Response(null, {
    status: 302,
    headers: {
      Location: storedReturnTo ?? "/models",
    },
  });
}

interface GoogleUser {
  sub: string; // unique google identifier
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
  hd: string;
}
export const GET = handle;
