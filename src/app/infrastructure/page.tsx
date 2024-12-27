import { GetStartedSection } from "@/app/_components/infrastructure/GetStartedSection";
import { HeroSection } from "@/app/_components/infrastructure/HeroSection";
import { ModelLeasingSection } from "@/app/_components/infrastructure/ModelLeasingSection";
import { ModelSupportSection } from "@/app/_components/infrastructure/ModelSupportSection";
import { NetworkArchitectureSection } from "@/app/_components/infrastructure/NetworkArchitectureSection";

export default function InfrastructurePage() {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,41,0,0.1),rgba(255,255,255,0))]" />
      </div>

      <div className="relative">
        <HeroSection />

        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div className="space-y-6 sm:space-y-12 lg:space-y-24">
            <NetworkArchitectureSection />
            <ModelSupportSection />
            <ModelLeasingSection />
            <GetStartedSection />
          </div>
        </div>
      </div>
    </div>
  );
}
