import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { LineDecoder } from "sse-decoder";
import { z } from "zod";

import { env } from "@/env.mjs";
import { db } from "@/schema/db";
import { ApiKey, genId, Model, OrganicRequest, User } from "@/schema/schema";

const schema = z.object({
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "system", "assistant"]),
      content: z.string(),
      name: z.string().optional(),
    }),
  ),
  stream: z.boolean().optional(),
  max_tokens: z.number().default(1024),

  // manually set fields
  api_key: z.string().optional(),
  pub_id: z.string().optional(),
});

const ResponseSchema = z.object({
  choices: z.array(z.object({ delta: z.object({ content: z.string() }) })),
});

export const POST = async (req: NextRequest) => {
  const bearerToken = req.headers.get("Authorization")?.split(" ").at(1);
  if (!bearerToken) {
    return NextResponse.json(
      { error: "Missing Bearer Token" },
      { status: 401 },
    );
  }

  const response = schema.safeParse(await req.json());
  if (!response.success) {
    return NextResponse.json(
      {
        error: { message: "Invalid request", errors: response.error },
      },
      { status: 400 },
    );
  }
  if (response.data.stream === false) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid request",
          errors:
            "Targon hub does not currently support non-streaming requests",
        },
      },
      { status: 500 },
    );
  }
  const body = response.data;

  const [[user], [model]] = await Promise.all([
    db
      .select({
        credits: User.credits,
        id: User.id,
      })
      .from(User)
      .innerJoin(ApiKey, eq(ApiKey.userId, User.id))
      .where(eq(ApiKey.key, bearerToken))
      .limit(1),
    db
      .select({ cpt: Model.cpt, miners: Model.cpt })
      .from(Model)
      .where(eq(Model.id, body.model))
      .limit(1),
  ]);

  switch (true) {
    case !user:
      return NextResponse.json(
        { error: "Invalid Bearer Token" },
        { status: 401 },
      );
    case !model:
      return NextResponse.json(
        { error: `Model ${body.model} not found` },
        { status: 400 },
      );
    case user!.credits < body.max_tokens * model!.cpt:
      return NextResponse.json(
        {
          error: `Token balance ${user.credits} too low for max_tokens: ${body.max_tokens}`,
        },
        { status: 401 },
      );
  }
  const starttime = performance.now();
  const pub_id = genId.organicRequest();
  await db.insert(OrganicRequest).values({
    pubId: pub_id,
    request: body,
    model: body.model,
    userId: user.id,
    creditsUsed: 0,
    tokens: 0,
  });

  body.api_key = env.HUB_SECRET_TOKEN;
  body.pub_id = pub_id;

  const controller = new AbortController();
  const context = {
    responseText: "",
    finished: false,
    finishReason: "normal",
    tokens_used: 0,
  };
  controller.signal.onabort = () => {
    context.finishReason = "abort";
  };

  const res = await fetch(env.HUB_API_ENDPOINT + "/api/chat/completions", {
    body: JSON.stringify(body),
    method: "POST",
    signal: controller.signal,
    cache: "no-cache",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
  });
  const reader = res.body?.getReader();
  if (!reader) {
    return NextResponse.json(
      { error: "Failed to send request" },
      { status: 500 },
    );
  }
  const lineDecoder = new LineDecoder();
  return new NextResponse(
    new ReadableStream({
      start(controller) {
        const pump = async (): Promise<void> => {
          return reader.read().then(async ({ done, value }) => {
            // When no more data needs to be consumed, close the stream
            if (done) {
              body.api_key = undefined;
              const endtime = performance.now();
              const credits_used = context.tokens_used * model.cpt;
              await db
                .update(OrganicRequest)
                .set({
                  creditsUsed: credits_used,
                  tokens: context.tokens_used,
                  response: context.responseText,
                  metadata: {
                    starttime,
                    endtime,
                    request_duration_ms: endtime - starttime,
                    request_ip: req.ip,
                  },
                })
                .where(eq(OrganicRequest.pubId, pub_id));
              await db
                .update(User)
                .set({
                  credits: user.credits - credits_used,
                })
                .where(eq(User.id, user.id));
              controller.close();
              return;
            }
            // This can be imporved later on to accept multiple event types, at the cost of perf.
            const tee = new Uint8Array(value);
            controller.enqueue(value);
            const lines = lineDecoder.decode(tee);
            for (const line of lines) {
              const divIndex = line.indexOf(":");
              if (divIndex < 1) continue;
              const event = line.slice(0, divIndex).trim();
              const v = line.slice(divIndex + 1, line.length).trim();
              switch (true) {
                case v === "[DONE]":
                  break;
                case event === "data":
                  context.responseText +=
                    ResponseSchema.parse(JSON.parse(v)).choices[0]?.delta
                      .content ?? "";
                  context.tokens_used++;
                  break;
              }
            }
            return pump();
          });
        };
        return pump();
      },
    }),
  );
};
