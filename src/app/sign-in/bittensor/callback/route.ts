import { type NextRequest } from "next/server";
import { hexToU8a } from "@polkadot/util";
import { cryptoWaitReady, signatureVerify } from "@polkadot/util-crypto";
import { eq } from "drizzle-orm";

import { db } from "@/schema/db";
import { ApiKey, genId, User } from "@/schema/schema";
import { stripe } from "@/server/stripe";

export async function GET(request: NextRequest): Promise<Response> {
  const ss58 = request.nextUrl.searchParams.get("ss58");
  const signature = request.nextUrl.searchParams.get("signature");
  const roll = request.nextUrl.searchParams.has("roll")
  if (!ss58 || ss58.length != 48 || !signature) {
    return Response.json(
      { error: "Missing or improper ss58 address or signature" },
      { status: 400 },
    );
  }
  const [user] = await db
    .select({
      userid: User.id,
      challenge: User.challenge,
      verified: User.verified,
    })
    .from(User)
    .where(eq(User.ss58, ss58));
  if (!user?.challenge) {
    return Response.json({ error: "Unknown user" }, { status: 403 });
  }
  await cryptoWaitReady();
  const binSignature = hexToU8a(signature);
  let verified;
  try {
    const verifiedResult = signatureVerify(user.challenge, binSignature, ss58);
    verified = verifiedResult.isValid;
  } catch (e) {
    verified = false;
  }
  if (!verified) {
    return Response.json(
      { error: "Failed to verify signature" },
      { status: 401 },
    );
  }
  if (!user.verified) {
    const stripeId = await stripe.customers.create({
      metadata: { user_id: user.userid },
    });
    const apiKey = genId.apikey();
    await db.insert(ApiKey).values({
      userId: user.userid,
      key: apiKey,
    });
    await db
      .update(User)
      .set({
        challenge: null,
        verified: true,
        stripeCustomerId: stripeId.id,
      })
      .where(eq(User.id, user.userid));
    return Response.json({ api_key: apiKey }, { status: 200 });
  }
  const [api_key_row] = await db
    .select({ api_key: ApiKey.key })
    .from(ApiKey)
    .where(eq(ApiKey.userId, user.userid));
  let apiKey = api_key_row?.api_key;
  if (roll || !apiKey) {
    apiKey = genId.apikey();
    await db.delete(ApiKey).where(eq(ApiKey.userId, user.userid));
    await db.insert(ApiKey).values({
      userId: user.userid,
      key: apiKey,
    });
  }
  return Response.json({ api_key: apiKey }, { status: 200 });
}
