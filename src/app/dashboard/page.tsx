import { type HTMLProps, type PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";

import { API_BASE_URL } from "@/constants";
import { db } from "@/schema/db";
import { User } from "@/schema/schema";
import { uncachedValidateRequest } from "@/server/auth";
import { ApiSection, WatchForSuccess } from "./ClientCards";
import { AddMoreCredits } from "./CreditsDialog";
import MinerTable from "./MinerTable";

export const dynamic = "force-dynamic";

const Container = (props: PropsWithChildren & HTMLProps<HTMLDivElement>) => {
  return (
    <div className="rounded bg-white px-8 py-6 text-gray-800 shadow-lg dark:bg-neutral-800 dark:text-gray-100">
      <div {...props}>{props.children}</div>
    </div>
  );
};

export default async function Page() {
  const { user } = await uncachedValidateRequest();
  if (!user) redirect("/");
  const [credits] = await db
    .select({ credits: User.credits })
    .from(User)
    .where(eq(User.id, user.id));
  hljs.registerLanguage("python", typescript);
  return (
    <div className="mx-auto max-w-7xl px-12 pb-20 pt-20">
      <WatchForSuccess />
      <div className="pb-10 text-6xl font-bold">Dashboard</div>
      <div className="flex flex-col gap-8">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                Credits Left
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                {credits?.credits.toLocaleString()}
              </dd>
            </div>
            <AddMoreCredits />
          </div>
        </Container>
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="w-full">
              <div className="truncate pb-4 text-3xl font-medium text-gray-900 dark:text-gray-50">
                Current Models
              </div>
              <MinerTable />
            </div>
          </div>
        </Container>
        <Container>
          <h3 className="pb-8 text-3xl font-semibold leading-6 text-gray-900 dark:text-gray-50">
            Api
          </h3>
          <ApiSection />
        </Container>
        <Container>
          <h3 className="pb-8 text-3xl font-semibold leading-6 text-gray-900 dark:text-gray-50">
            Docs
          </h3>

          <h4 className="pb-2 text-xl font-semibold leading-6 text-gray-900 dark:text-gray-50">
            Chat Completion
          </h4>
          <div className="overflow-x-scroll pb-4">
            <div className="w-fit whitespace-nowrap rounded bg-gray-200 px-2 py-2 font-mono text-sm leading-3 dark:bg-neutral-900">
              POST {API_BASE_URL}/v1/chat/completions
            </div>
          </div>
          <div className="pb-4">
            Creates a model response for the given chat conversation. Generally
            Reference{" "}
            <a
              className="text-blue-500"
              href="https://platform.openai.com/docs/api-reference/chat/create"
            >
              OpenAI{"'"}s api endpoint
            </a>{" "}
            for the definition behind each field.
          </div>
          <div className="pt-2">
            <pre className="hljs prose-sm overflow-x-scroll rounded bg-gray-800 px-2 py-2 dark:bg-neutral-900">
              <code
                dangerouslySetInnerHTML={{
                  __html: hljs.highlight(
                    `from openai import OpenAI

client = OpenAI(
    base_url="${API_BASE_URL}/v1", api_key="[your api token]"
)

response = client.chat.completions.create(
    model="NousResearch/Meta-Llama-3.1-8B-Instruct",
    stream=True,
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Whose a good little assistant"},
    ],
)
for chunk in response:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
`,
                    { language: "python" },
                  ).value,
                }}
              />
            </pre>
          </div>

          <h4 className="pb-2 pt-12 text-xl font-semibold leading-6 text-gray-900 dark:text-gray-50">
            Completion
          </h4>
          <div className="overflow-x-scroll pb-4">
            <div className="w-fit whitespace-nowrap rounded bg-gray-200 px-2 py-2 font-mono text-sm leading-3 dark:bg-neutral-900">
              POST {API_BASE_URL}/v1/completions
            </div>
          </div>
          <div className="pb-4">
            Creates a model completion for the given text. Generally Reference{" "}
            <a
              className="text-blue-500"
              href="https://platform.openai.com/docs/api-reference/completion/create"
            >
              OpenAI{"'"}s api endpoint
            </a>{" "}
            for the definition behind each field.
          </div>
          <div className="pt-2">
            <pre className="hljs prose-sm overflow-x-scroll rounded bg-gray-800 px-2 py-2 dark:bg-neutral-900">
              <code
                dangerouslySetInnerHTML={{
                  __html: hljs.highlight(
                    `from openai import OpenAI

client = OpenAI(
    base_url="${API_BASE_URL}/v1", api_key="[your api token]"
)

response = client.completions.create(
    model="NousResearch/Meta-Llama-3.1-8B-Instruct",
    stream=True,
    prompt="The x y problem is",
)
for chunk in response:
    if chunk.choices[0].text is not None:
        print(chunk.choices[0].text, end="")
`,
                    { language: "python" },
                  ).value,
                }}
              />
            </pre>
          </div>
        </Container>
      </div>
    </div>
  );
}
