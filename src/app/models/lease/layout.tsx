"use client";

import { usePathname } from "next/navigation";

import { LeaseHero } from "@/app/_components/lease/LeaseHero";
import { StepIndicator } from "@/app/_components/lease/StepIndicator";

const STEPS = ["model", "pricing", "confirm"] as const;
type LeaseStep = (typeof STEPS)[number];

const STEP_NAMES: Record<LeaseStep, string> = {
  model: "Select Model",
  pricing: "Review Pricing",
  confirm: "Complete",
};

type Step = {
  name: string;
  status: "current" | "complete" | "upcoming";
};

export default function LeaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = (pathname.split("/").pop() as LeaseStep) || "model";

  const currentStepIndex = STEPS.indexOf(currentStep);
  const steps = STEPS.map((step, index) => ({
    name: STEP_NAMES[step],
    status:
      index === currentStepIndex
        ? "current"
        : index < currentStepIndex
          ? "complete"
          : "upcoming",
  }));

  return (
    <div className="relative isolate bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <LeaseHero />
        <div className="px-6 py-6 sm:pb-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl animate-slide-in-delay lg:mr-0 lg:max-w-lg">
            <StepIndicator steps={steps as Step[]} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
