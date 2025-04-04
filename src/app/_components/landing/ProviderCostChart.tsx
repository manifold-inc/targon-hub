import Image from "next/image";
import Link from "next/link";

import { CREDIT_PER_DOLLAR } from "@/constants";

interface Provider {
  name: string;
  tokensPerSecond: number;
  costPerMillion: number;
  logoUrl: string;
  position: {
    left: string;
    bottom: string;
  };
}

const providers: Provider[] = [
  {
    name: "TogetherAI",
    tokensPerSecond: 92,
    costPerMillion: 0.16,
    logoUrl: "/providers/Together-AI.png",
    position: { left: "23%", bottom: "35%" },
  },
  {
    name: "Lepton AI",
    tokensPerSecond: 65.19,
    costPerMillion: 0.2,
    logoUrl: "/providers/Lepton-AI.png",
    position: { left: "8%", bottom: "10%" },
  },
  {
    name: "Perplexity AI",
    tokensPerSecond: 92,
    costPerMillion: 0.2,
    logoUrl: "/providers/Perplexity-AI.png",
    position: { left: "40%", bottom: "10%" },
  },
  {
    name: "Fireworks.ai",
    tokensPerSecond: 240,
    costPerMillion: 0.2,
    logoUrl: "/providers/Fireworks-AI.png",
    position: { left: "70%", bottom: "10%" },
  },
];

const currentData = {
  name: "Manifold Labs",
  date: "Dec 2024",
  currentTokens: "400+",
  costPerMillion: (500 * 1_000_000) / CREDIT_PER_DOLLAR,
  position: { left: "55%", bottom: "60%" },
  currentPosition: { left: "73%", bottom: "75%" },
};

export function ProviderCostChart() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="relative flex flex-col items-center px-6 pb-16 pt-5">
        <div className="pb-4 text-2xl text-mf-ash-500 md:text-4xl">
          Cost by TPS Per Provider
        </div>
        <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-mf-ash-300 sm:text-lg">
          Experience the power of AI without the limits. As the{" "}
          <span className="animate-pulse font-semibold text-mf-ash-300">
            only place on Bittensor
          </span>{" "}
          offering model leasing, we make decentralized, affordable AI truly
          accessible.
        </p>
      </div>

      {/* Chart view for large screens and up */}
      <div className="hidden rounded-lg border border-mf-silver-700 bg-mf-milk-300 p-4 lg:block">
        {/* Original chart component */}
        <div className="relative flex aspect-[1280/580] w-full scale-50 flex-col md:scale-100">
          <div className="flex h-full w-full grow">
            {/* Y-axis */}
            <div className="relative flex h-full w-24 flex-col items-end pr-4 font-semibold">
              <span className="my-auto whitespace-pre-wrap break-words">
                Cost / Million Tokens
              </span>
              <span>$0.30</span>
              <div
                className="absolute right-0 h-full w-0.5 bg-gradient-to-b from-mf-ash-300 from-[0%] via-mf-ash-300 via-[40%] to-transparent to-[40%] opacity-10"
                style={{ backgroundSize: "2px 70px" }}
              />
            </div>

            {/* Main chart area */}
            <div className="relative grow">
              <div className="dot-pattern-dark absolute inset-0 opacity-50" />
              {/* Provider points */}
              {providers.map((provider) => (
                <div
                  key={provider.name}
                  className="absolute opacity-100"
                  style={{
                    left: provider.position.left,
                    bottom: provider.position.bottom,
                  }}
                >
                  <div className="absolute flex w-px origin-top translate-y-2 rotate-45 flex-col items-center">
                    <div className="h-6 w-px bg-mf-blue-500" />
                    <div className="size-2 rounded-full bg-mf-blue-500" />
                  </div>

                  <div className="relative flex items-center gap-x-4">
                    <div className="size-20">
                      <Image
                        src={provider.logoUrl}
                        alt={provider.name}
                        width={70}
                        height={70}
                        className="h-full w-full rounded-xl"
                      />
                    </div>
                    <div className="whitespace-nowrap  text-sm">
                      <div className="font-semibold">{provider.name}</div>
                      <div className="text-mf-ash-500">
                        {provider.tokensPerSecond} TPS
                      </div>
                      <div className="text-mf-ash-500">
                        ${provider.costPerMillion.toFixed(2)} / M Tokens
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Current state */}
              <div
                className="absolute whitespace-nowrap "
                style={currentData.currentPosition}
              >
                <div className="text-xs text-mf-ash-500">
                  Now (As of Dec 2024)
                </div>
                <div className="flex items-center gap-x-2 py-2">
                  <Link href="https://www.manifold.inc/">
                    <Image
                      src="/providers/ManifoldChartLogo.svg"
                      alt="Manifold Labs"
                      width={80}
                      height={80}
                      className="rounded-xl"
                    />
                  </Link>
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-mf-ash-500">
                      Manifold Labs
                    </span>
                    <div className="animate-pulse text-mf-ash-500">
                      {currentData.currentTokens} TPS
                    </div>
                    <div className="text-mf-ash-500">
                      ${currentData.costPerMillion.toFixed(2)} / M Tokens
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* X-axis */}
          <div className="relative h-14 w-full">
            <div className="relative flex items-center pl-24 pt-3 font-semibold">
              <span>50</span>
              <span className="mx-auto">Tokens Per Second</span>
              <span>400</span>
              <div
                className="absolute left-24 right-0 top-0 h-0.5 bg-gradient-to-r from-mf-ash-300 from-[0%] via-mf-ash-300 via-[40%] to-transparent to-[40%] opacity-10"
                style={{ backgroundSize: "70px 2px" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* List view for medium and smaller screens */}
      <div className="block lg:hidden">
        <div className="grid gap-6 px-6">
          <div className="flex items-center gap-4 rounded-lg border border-mf-blue-500 bg-mf-milk-300 p-4">
            <Link href="https://www.manifold.inc/">
              <Image
                src="/providers/ManifoldChartLogo.svg"
                alt="Manifold Labs"
                width={48}
                height={48}
                className="rounded-xl"
              />
            </Link>
            <div className="">
              <div className="font-semibold">Manifold Labs</div>
              <div className="animate-pulse">
                {currentData.currentTokens} TPS
              </div>
              <div className="text-mf-ash-500">
                ${currentData.costPerMillion.toFixed(2)} / M Tokens
              </div>
            </div>
          </div>

          {providers
            .sort((a, b) => b.tokensPerSecond - a.tokensPerSecond) // Sort providers by TPS in descending order
            .map((provider) => (
              <div
                key={provider.name}
                className="flex items-center gap-4 rounded-lg border border-mf-silver-700 bg-mf-milk-300 p-4"
              >
                <Image
                  src={provider.logoUrl}
                  alt={provider.name}
                  width={50}
                  height={50}
                  className="h-12 w-12 rounded-xl"
                />
                <div className="">
                  <div className="font-semibold">{provider.name}</div>
                  <div>{provider.tokensPerSecond} TPS</div>
                  <div className="text-mf-ash-500">
                    ${provider.costPerMillion.toFixed(2)} / M Tokens
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
