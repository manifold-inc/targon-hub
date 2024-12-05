import { DataFlowAnimation } from "./_components/landing/DataFlowAnimation";
import { HeroSection } from "./_components/landing/HeroSection";
import { ModelTabs } from "./_components/landing/ModelTabs";
import { MetricsSection } from "./_components/landing/MetricsSection";
import { TrustedBySection } from "./_components/landing/TrustedBySection";

export default function Page() {
  return (
    <div className="relative bg-[#fafafa] pt-8">
      {/* Dot pattern container */}
      <div className="absolute -top-20 left-0 right-0 h-2/5">
        <div className="animate-slide-in dot-pattern h-full w-full">
          <DataFlowAnimation />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fafafa]" />
        </div>
      </div>

      <HeroSection />

      {/* Content without background */}
      <div className="relative -mt-20 px-4 sm:px-10">

          <ModelTabs />
          <TrustedBySection />
          <MetricsSection />
          <div className="animate-slide-in-delay">
          <div className="mx-auto flex flex-col items-center justify-center gap-6 pb-8 text-center">
            <h1 className="whitespace-no-wrap text-4xl font-semibold leading-tight text-mf-green sm:text-5xl">
              Permissionlessly Unlock Affordable AI Inference
            </h1>
            <p className="max-w-2xl text-base text-mf-green sm:text-lg">
              Experience the power of AI without the limits. As the{" "}
              <span className="animate-pulse font-semibold">
                only place on Bittensor
              </span>{" "}
              offering model leasing, we make decentralized, affordable AI truly
              accessible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
