"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, UserRound } from "lucide-react";

import CodeBlock from "@/app/_components/CodeBlock";
import ModelsNav from "@/app/_components/ModelsNav";
import { useAuth } from "@/app/_components/providers";
import { reactClient } from "@/trpc/react";

type Props = {
  params: {
    slug: string;
  };
};

export default function Page({ params }: Props) {
  const auth = useAuth();
  const { data } = reactClient.model.getModel.useQuery({
    slug: decodeURIComponent(params.slug),
  });

  const modelName = params.slug
    ? decodeURIComponent(params.slug).charAt(0).toUpperCase() +
      decodeURIComponent(params.slug).slice(1).toLowerCase()
    : "";

  const getRandomGradient = () => {
    const gradients = [
      "from-indigo-500 via-sky-500 to-violet-500",
      "from-sky-500 via-emerald-500 to-teal-500",
      "from-violet-500 via-rose-500 to-amber-500",
      "from-rose-500 via-fuchsia-500 to-indigo-500",
    ];

    // Use the slug as a seed
    const seed = params.slug
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[seed % gradients.length];
  };

  const exampleCode = `import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: 'your-api-key',
});

const response = await openai.chat.completions.create({
  model: "${modelName}",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello!" }
  ],
});
`;

  return (
    <div className="relative flex">
      <div className="fixed right-20 top-32">
        <ModelsNav />
      </div>
      <div className="mx-auto w-1/2 animate-slideIn py-20">
        <div className="mx-auto">
          <section id="overview" data-section>
            <header className="flex w-full justify-between pb-6">
              <h1 className="text-3xl leading-9 text-[#101828]">
                {modelName.split("/")[1]!.charAt(0).toUpperCase() +
                  modelName.split("/")[1]?.slice(1)}
              </h1>
              <Link
                href={auth.status === "AUTHED" ? `/docs` : "/sign-in"}
                className="group relative flex h-12 w-28 items-center justify-center"
              >
                <div className="absolute h-11 w-24 rounded-full border-2 border-black opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-white group-hover:border-0">
                  <span className="w-16 text-center text-sm font-semibold leading-tight">
                    {auth.status === "AUTHED" ? "Use Now!" : "Sign in!"}
                  </span>
                </span>
              </Link>
            </header>

            <div className="flex items-center gap-4">
              <time className="text-sm leading-tight text-[#667085]">
                Created {data?.createdAt?.toLocaleDateString()}
              </time>
              <div className="h-5 w-px bg-[#e4e7ec]" />
              <div className="flex items-center gap-3">
                <UserRound width={16} height={16} />
                <span className="text-sm leading-tight text-[#667085]">
                  {data?.author}
                </span>
              </div>
            </div>

            <div className="py-8">
              <div
                className={`h-64 w-full rounded-lg bg-gradient-to-r ${getRandomGradient()}`}
              />
            </div>

            <div className="flex gap-4">
              {[
                { label: "Input Tokens", price: "$0.252 /M" },
                { label: "Output Tokens", price: "$0.15 /M" },
                { label: "Input IMGs", price: "$0.11 /M" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="inline-flex h-20 w-64 flex-col items-start justify-center gap-2 rounded-xl bg-gray-50 px-5 py-4"
                >
                  <span className="text-sm leading-tight text-[#667085]">
                    {item.label}
                  </span>
                  <span className="text-[#344054]">{item.price}</span>
                </div>
              ))}
            </div>

            <p className="py-6 text-sm leading-tight text-[#101828]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              efficitur sollicitudin orci in luctus. Vivamus aliquet ligula et
              volutpat faucibus. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. In efficitur sollicitudin orci in luctus. Vivamus
              aliquet ligula et volutpat faucibus. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. In efficitur sollicitudin orci in
              luctus. Vivamus aliquet ligula et volutpat faucibus.
            </p>

            <div className="flex gap-4">
              {[
                { color: "blue", label: "Category 1" },
                { color: "green", label: "Category 2" },
              ].map((category) => (
                <div
                  key={category.label}
                  className={`inline-flex h-6 items-center justify-start gap-1.5 rounded-full border ${
                    category.color === "blue"
                      ? "border-[#155dee]"
                      : "border-green-500"
                  } py-0.5 pl-2 pr-2.5`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      category.color === "blue"
                        ? "bg-[#155dee]"
                        : "bg-green-500"
                    }`}
                  />
                  <span
                    className={`text-center text-sm font-medium leading-tight ${
                      category.color === "blue"
                        ? "text-[#004eea]"
                        : "text-green-500"
                    }`}
                  >
                    {category.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="py-10">
              <div className="h-px w-full bg-[#e4e7ec]" />
            </div>
          </section>

          <section id="apps-using-this" data-section>
            <p className="text-2xl leading-loose text-[#101828]">
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
                  <div className="flex h-[68px] w-full items-center gap-6 rounded-xl p-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50 p-1.5">
                      <Image
                        src={app.image}
                        alt={app.name}
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-sm font-medium leading-tight text-[#101828]">
                        {app.name}
                      </span>
                      <span className="text-[13.02px] leading-tight text-[#667085]">
                        {app.description}
                      </span>
                    </div>
                    <span className="text-[13.02px] leading-tight text-[#667085]">
                      {app.tokens}
                    </span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="py-10">
              <div className="h-px w-full bg-[#e4e7ec]" />
            </div>
          </section>

          <section id="parameters" data-section>
            <p className="text-2xl leading-loose text-[#101828]">
              Recommended Parameters
            </p>

            {[
              {
                name: "Temperature",
                description:
                  "Controls randomness in the output. Higher values make the output more random, lower values make it more focused.",
                p10: "0.7",
                p50: "0.8",
                p90: "0.9",
              },
              {
                name: "Max Tokens",
                description:
                  "The maximum length of the generated response in tokens.",
                p10: "256",
                p50: "512",
                p90: "1024",
              },
              {
                name: "Top P",
                description:
                  "Controls diversity via nucleus sampling. Lower values mean less random completions.",
                p10: "0.1",
                p50: "0.3",
                p90: "0.7",
              },
            ].map((param) => (
              <div
                key={param.name}
                className="flex w-full items-start justify-between py-6"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <Star width={16} height={16} className="text-[#d0d5dd]" />
                    <div className="text-sm font-medium text-[#344054]">
                      {param.name}
                    </div>
                  </div>
                  <div className="w-3/4 pl-7 text-sm text-[#344054]">
                    {param.description}
                  </div>
                </div>
                <div className="flex gap-4">
                  {["p10", "p50", "p90"].map((p) => (
                    <div key={p} className="w-[53px] text-center">
                      <div className="mb-2 text-xs text-[#98a1b2]">{p}</div>
                      <div className="font-['Geist Mono'] text-sm text-[#344054]">
                        {param[p as keyof typeof param]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="py-10">
              <p className="text-sm font-medium leading-tight text-[#344054]">
                Sample Code
              </p>
              <CodeBlock code={exampleCode} language="python" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
