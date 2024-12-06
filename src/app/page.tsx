import { DataFlowAnimation } from "./_components/landing/DataFlowAnimation";
import { HeroSection } from "./_components/landing/HeroSection";
import { MetricsSection } from "./_components/landing/MetricsSection";
import { ModelTabs } from "./_components/landing/ModelTabs";
import { ProviderCostChart } from "./_components/landing/ProviderCostChart";
import { TrustedBySection } from "./_components/landing/TrustedBySection";

export default function Page() {
  return (
    <div className="relative bg-[#fafafa]">
      {/* Dot pattern container */}
      <div className="absolute -top-20 left-0 right-0 h-2/5">
        <div className="dot-pattern h-full w-full animate-slide-in">
          <DataFlowAnimation />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fafafa]" />
        </div>
      </div>

      <div className="relative py-14">
        <HeroSection />

        <div className="relative -mt-20 px-4 pt-4 sm:px-10 sm:pt-10">
          <ModelTabs />
          <TrustedBySection />
          <MetricsSection />
        </div>

        <div className="relative px-4 pb-20 sm:px-10">
          {/* Content without background */}

          <div className="animate-slide-in-delay">
            {/* provider cost chart */}
            <ProviderCostChart />
          </div>
        </div>
      </div>
    </div>
  );
}
