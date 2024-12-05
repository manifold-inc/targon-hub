import Image from "next/image";

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
  currentTokens: "300+",
  position: { left: "55%", bottom: "60%" },
  currentPosition: { left: "80%", bottom: "75%" },
};

export function ProviderCostChart() {
  return (
    <div className="mx-auto hidden w-full max-w-5xl md:block">
      <div className="relative mb-16 mt-5 flex flex-col items-center px-6">
        <div className="mb-4 text-lg font-bold text-mf-green md:text-4xl">
          Cost by TPS Per Provider - Llama 3.1 8B
        </div>
        <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-mf-green sm:text-lg">
          Experience the power of AI without the limits. As the{" "}
          <span className="text-mf-blue animate-pulse font-semibold">
            only place on Bittensor
          </span>{" "}
          offering model leasing, we make decentralized, affordable AI truly
          accessible.
        </p>
      </div>

      <div className="relative flex aspect-[1280/580] w-full scale-50 flex-col md:scale-75 xl:scale-100">
        <div className="flex h-full w-full grow">
          {/* Y-axis */}
          <div className="relative flex h-full w-[100px] flex-col items-end pr-4 font-mono text-sm">
            <span>$0.00</span>
            <span className="my-auto whitespace-pre-wrap break-words opacity-50">
              Cost / Million Tokens
            </span>
            <span>$0.30</span>
            <div
              className="absolute right-0 h-full w-[2px] bg-gradient-to-b from-mf-green from-[0%] via-mf-green via-[40%] to-transparent to-[40%] opacity-30"
              style={{ backgroundSize: "2px 70px" }}
            />
          </div>

          {/* Main chart area */}
          <div className="relative grow">
            <div className="dot-pattern absolute inset-0 opacity-50" />
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
                <div className="absolute flex w-px origin-top rotate-45 flex-col items-center">
                  <div className="h-6 w-px bg-mf-green" />
                  <div className="size-2 rounded-full bg-mf-green" />
                </div>

                <div className="relative flex items-center gap-x-4">
                  <div className="size-[70px]">
                    <Image
                      src={provider.logoUrl}
                      alt={provider.name}
                      width={70}
                      height={70}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="whitespace-nowrap font-mono text-sm">
                    <div>{provider.name}</div>
                    <div>{provider.tokensPerSecond} Tokens/s</div>
                    <div className="text-neutral-400">
                      ${provider.costPerMillion.toFixed(2)} / Million Tokens
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Current state */}
            <div
              className="absolute whitespace-nowrap font-mono"
              style={currentData.currentPosition}
            >
              <div className="text-xs text-neutral-500">
                Now (As of Dec 2024)
              </div>
              <div className="my-2 flex items-center gap-x-2">
                <Image
                  src="/ManifoldMarkTransparentGreenSVG.svg"
                  alt="Manifold Labs"
                  width={60}
                  height={60}
                />
                <span className="text-2xl">
                  Manifold<span className="text-mf-green"> Labs</span>
                </span>
              </div>
              <div>{currentData.currentTokens} Tokens/s</div>
            </div>
          </div>
        </div>

        {/* X-axis */}
        <div className="relative h-[60px] w-full">
          <div className="relative flex items-center pl-[100px] pt-3 font-mono">
            <span>50</span>
            <span className="mx-auto opacity-50">Tokens/s</span>
            <span>300</span>
            <div
              className="absolute left-[100px] right-0 top-0 h-[2px] bg-gradient-to-r from-mf-green from-[0%] via-mf-green via-[40%] to-transparent to-[40%] opacity-30"
              style={{ backgroundSize: "70px 2px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
