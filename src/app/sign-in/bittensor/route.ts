import { type NextRequest } from "next/server";
import { generateState } from "arctic";
import { eq } from "drizzle-orm";

import { db } from "@/schema/db";
import { genId, User } from "@/schema/schema";

export async function GET(request: NextRequest): Promise<Response> {
  const ss58 = request.nextUrl.searchParams.get("ss58");
  if (!ss58 || ss58.length != 48) {
    return Response.json(
      { error: "Missing or improper ss58 address" },
      { status: 400 },
    );
  }
  const [user] = await db
    .select({ userid: User.id })
    .from(User)
    .where(eq(User.ss58, ss58));
  const challenge = generateState();
  if (user) {
    await db
      .update(User)
      .set({
        challenge,
      })
      .where(eq(User.id, user.userid));
  } else {
    await db.insert(User).values({
      pubId: genId.user(),
      ss58,
      challenge,
      verified: false,
    });
  }
  return Response.json({ message: challenge }, { status: 200 });
}
