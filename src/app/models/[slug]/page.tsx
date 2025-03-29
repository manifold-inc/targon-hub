import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";

import { CodeSamples } from "@/app/_components/CodeSamples";
import ModelsNav from "@/app/_components/ModelsNav";
import ModelStatusIndicator from "@/app/_components/ModelStatusIndicator";
import { CREDIT_PER_DOLLAR } from "@/constants";
import { db } from "@/schema/db";
import { createCaller } from "@/server/api/root";
import { uncachedValidateRequest } from "@/server/auth";
import UseageChart from "./UsageChart";

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const { user, session } = await uncachedValidateRequest();
  const caller = createCaller({ user, db: db, req: null, session: session });

  const data = await caller.model.getModelInfo({
    model: decodeURIComponent(params.slug),
  });
  if (!data) {
    redirect("/models");
  }
  let usage = null;
  if (data?.enabled) {
    usage = await caller.model.getModelUsage({ model_id: data.id });

    // Dont include the current day since its still accumulating
    usage.pop();
  }

  let first_key = "YOUR_API_KEY";
  try {
    const keys = await caller.core.getApiKeys();
    first_key = keys[0]?.key ?? "YOUR_API_KEY";
  } catch (e) {}

  return (
    <div className="relative flex">
      <div className="fixed right-20 top-32 hidden lg:block">
        <ModelsNav />
      </div>
      <div className="h-fit w-full animate-slide-in">
        <div className="mx-auto w-10/12 py-20 lg:w-1/2">
          <div className="mx-auto">
            <section id="overview" data-section>
              <header className="flex w-full flex-col gap-4 pb-6 pr-4 sm:flex-row sm:justify-between">
                <h1 className="text-center text-xl leading-9 text-mf-ash-700 sm:text-left sm:text-2xl md:text-3xl">
                  {data.name}
                </h1>

                <Link
                  href={
                    user?.id
                      ? data.enabled
                        ? `#code-samples`
                        : `/models/lease?model=${encodeURIComponent(params.slug)}`
                      : `/sign-in?redirect=${encodeURIComponent("/models" + params.slug)}`
                  }
                  className="group relative flex h-9 w-full items-center justify-center self-center sm:w-32 sm:self-auto"
                >
                  <span className="inline-flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-full border border-mf-silver-700 bg-mf-milk-300 px-3 py-2 text-mf-ash-300 group-hover:bg-mf-milk-300 sm:w-auto">
                    <span className="w-full text-center text-sm leading-tight sm:w-24">
                      {user?.id
                        ? data.enabled
                          ? "Use Now"
                          : "Lease Model"
                        : "Sign in"}
                    </span>
                  </span>
                </Link>
              </header>

              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <time className="whitespace-nowrap text-xs leading-tight text-mf-ash-500 sm:text-sm">
                  Created {data?.createdAt?.toLocaleDateString()}
                </time>
                <div className="hidden h-5 w-px bg-[#e4e7ec] sm:block" />
                <div className="flex items-center gap-3">
                  <UserRound width={16} height={16} />
                  <span className="text-sm leading-tight text-mf-ash-500">
                    {data.name!.split("/")[0]}
                  </span>
                </div>
                <div className="hidden h-5 w-px bg-[#e4e7ec] sm:block" />
                <div className="text-xs leading-tight text-mf-ash-500 sm:text-sm">
                  ${((data.cpt * 1_000_000) / CREDIT_PER_DOLLAR).toFixed(2)} / M
                  Tokens
                </div>
                <div className="hidden h-5 w-px bg-[#e4e7ec] sm:block" />
                <ModelStatusIndicator
                  enabled={data.enabled ?? false}
                  showBorder={true}
                />
              </div>
              <p className="pb-6 pt-8 text-sm leading-tight text-mf-ash-700">
                {data?.description}
              </p>

              <div className="flex gap-4 pb-4">
                {data?.modality && (
                  <div className="inline-flex h-6 items-center justify-start gap-1.5 rounded-full border border-mf-blue-700 py-0.5 pl-2 pr-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-mf-blue-700" />
                    <span className="text-center text-sm font-medium leading-tight text-mf-blue-700">
                      {data.modality === "text-generation"
                        ? "Text Generation"
                        : "Text to Image"}
                    </span>
                  </div>
                )}
              </div>
            </section>
            {!!usage?.length && (
              <section id="usage">
                <div className="py-10">
                  <div className="h-px w-full bg-mf-silver-700" />
                </div>
                <p className="text-2xl leading-loose text-mf-ash-700">
                  Model Usage
                </p>
                <div className="pt-8">
                  <UseageChart data={usage} />
                </div>
              </section>
            )}
            <section className="hidden" id="apps-using-this" data-section>
              <div className="py-10">
                <div className="h-px w-full bg-mf-silver-700" />
              </div>
              <p className="text-2xl leading-loose text-mf-ash-700">
                Apps Using This
              </p>
              <ol className="list-decimal py-6 pl-4">
                {[
                  {
                    name: "Greenfelder, Wolff and Stehr",
                    description: "Realigned multi-tasking solution",
                    tokens: "901k tokens",
                    image: "https://picsum.photos/32/32?random=1",
                  },
                  {
                    name: "Smith and Partners",
                    description: "Integrated analytics platform",
                    tokens: "756k tokens",
                    image: "https://picsum.photos/32/32?random=2",
                  },
                  {
                    name: "Tech Solutions Inc",
                    description: "Cloud-based workflow automation",
                    tokens: "623k tokens",
                    image: "https://picsum.photos/32/32?random=3",
                  },
                ].map((app) => (
                  <li key={app.name}>
                    <div className="flex w-full flex-wrap items-center gap-3 rounded-xl py-3 sm:gap-6 sm:p-3">
                      <div className="mf-milk-300 flex h-11 w-11 items-center justify-center rounded-lg p-1.5">
                        <Image
                          src={app.image}
                          alt={app.name}
                          width={32}
                          height={32}
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <span className="text-sm font-medium leading-tight text-mf-ash-700">
                          {app.name}
                        </span>
                        <span className="text-[13.02px] leading-tight text-mf-ash-500">
                          {app.description}
                        </span>
                        <span className="text-[13.02px] leading-tight text-mf-ash-500 sm:hidden">
                          {app.tokens}
                        </span>
                      </div>
                      <span className="hidden text-[13.02px] leading-tight text-mf-ash-500 sm:block">
                        {app.tokens}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
            <section id="code-samples" data-section>
              <div className="mt-10 border-t border-mf-silver-700 py-4">
                <div className="flex flex-1 flex-col overflow-hidden">
                  <CodeSamples
                    model={data.name}
                    apiKey={first_key}
                    typesShown={["chat", "completions"]}
                    params={{
                      temperature: 0.7,
                      max_tokens: 256,
                      top_p: 0.1,
                      frequency_penalty: 0,
                      presence_penalty: 0,
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
