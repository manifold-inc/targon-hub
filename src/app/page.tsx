import { DataFlowAnimation } from "./_components/landing/DataFlowAnimation";
import { HeroSection } from "./_components/landing/HeroSection";
import { MetricsSection } from "./_components/landing/MetricsSection";
import { ModelTabs } from "./_components/landing/ModelTabs";
import { ProviderCostChart } from "./_components/landing/ProviderCostChart";
import { TrustedBySection } from "./_components/landing/TrustedBySection";

export default function Page() {
  return (
    <div className="relative bg-mf-milk-300">
      {/* Dot pattern container */}
      <div className="absolute -top-20 left-0 right-0 h-[550px] animate-fade-in bg-gradient-to-b from-[#ABD7FF] to-[#84C4FF]">
        <div className="dot-pattern h-full w-full animate-slide-in">
          <DataFlowAnimation />
        </div>
      </div>

      <div className="relative py-14">
        <HeroSection />

        <div className="relative -mt-20 px-4 pt-10 sm:px-32">
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
