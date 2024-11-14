import { type NextRequest } from "next/server";
import { hexToU8a } from "@polkadot/util";
import { cryptoWaitReady, signatureVerify } from "@polkadot/util-crypto";
import { eq, and } from "drizzle-orm";

import { db } from "@/schema/db";
import {  User } from "@/schema/schema";

export async function GET(request: NextRequest): Promise<Response> {
  const ss58 = request.nextUrl.searchParams.get("ss58");
  const signature = request.nextUrl.searchParams.get("signature");
  
  if (!ss58 || ss58.length != 48 || !signature) {
    return Response.json(
      { error: "Missing or improper ss58 address or signature" },
      { status: 400 },
    );
  }

  const [existingVerifiedUser] = await db
    .select({
      id: User.id,
      verified: User.verified,
    })
    .from(User)
    .where(
      and(
        eq(User.ss58, ss58),
        eq(User.verified, true)
      )
    );

  if (existingVerifiedUser) {
    return Response.json(
      { error: "This SS58 address is already linked to a verified account" },
      { status: 409 }
    );
  }

  const [user] = await db
    .select({
      userid: User.id,
      challenge: User.challenge,
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

  await db
    .update(User)
    .set({
      challenge: null,
      verified: true,
    })
    .where(eq(User.id, user.userid));

  return Response.json({ success: true }, { status: 200 });
}
