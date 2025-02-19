import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { lucia, validateRequest } from "@/server/auth";

export async function GET(): Promise<Response> {
  const { session } = await validateRequest();
  if (!session) {
    return new Response(null, { status: 400 });
  }
  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  revalidatePath("/", "layout");
  return redirect("/");
}
