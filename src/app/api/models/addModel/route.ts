import { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    return Response.json({ message: "Model added" });
  } catch (err) {
    return Response.json({ error: "Invalid request", status: 400 });
  }
}
