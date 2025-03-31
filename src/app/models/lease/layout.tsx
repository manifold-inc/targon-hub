"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, CreditCard, Gauge, Zap } from "lucide-react";

import { StepIndicator } from "@/app/_components/lease/StepIndicator";

const STEPS = ["model", "pricing", "confirm"] as const;
type LeaseStep = (typeof STEPS)[number];

const STEP_NAMES: Record<LeaseStep, string> = {
  model: "Select Model",
  pricing: "Review Pricing",
  confirm: "Complete",
};

// Consolidate feature data to reduce repetition
const FEATURES = [
  {
    icon: Zap,
    title: "Fast Deployment",
    description: "Ready to use within 24 hours",
  },
  {
    icon: CreditCard,
    title: "Pay Per Use",
    description: "Only pay for the GPU resources you need",
  },
  {
    icon: Gauge,
    title: "Optimized Performance",
    description: "Automatically configured for optimal inference speed",
  },
] as const;

type Step = {
  name: string;
  status: "complete" | "current" | "upcoming";
};

export default function LeaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = (pathname.split("/").pop() as LeaseStep) || "model";

  const steps = STEPS.map(
    (step, index) =>
      ({
        name: STEP_NAMES[step],
        status:
          index === STEPS.indexOf(currentStep)
            ? "current"
            : index < STEPS.indexOf(currentStep)
              ? "complete"
              : "upcoming",
      }) satisfies Step,
  );

  return (
    <div className="grid h-full grid-cols-1 bg-mf-milk-300 lg:grid-cols-2">
      {/* Left column */}
      <div className="relative px-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-8">
        {/* Content */}
        <div className="relative py-12 lg:py-48">
          <div className="mx-auto lg:mx-0 lg:max-w-lg">
            <h2 className="text-pretty text-4xl font-semibold tracking-tight text-mf-ash-500 sm:text-5xl">
              Add Any Model
            </h2>
            <p className="pt-6 text-lg/8 text-mf-ash-300">
              Deploy any HuggingFace model with just a few clicks. Our platform
              handles all the infrastructure complexity, so you can focus on
              using your model.
            </p>
            <dl className="space-y-4 pt-10 text-base/7 text-mf-ash-300">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-center gap-x-3">
                  <dt className="flex-none">
                    <span className="sr-only">Feature</span>
                    <Icon className="h-6 w-6 text-mf-blue-700" />
                  </dt>
                  <dd>
                    <span className="font-semibold text-mf-ash-500">
                      {title}
                    </span>
                    <br />
                    {description}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="pt-10">
              <Link
                href="/infrastructure"
                className="group inline-flex items-center rounded-full border border-mf-blue-700 px-6 py-2.5 text-sm font-medium text-mf-blue-700 transition hover:bg-mf-blue-900/5"
              >
                Curious about how it works?
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="relative px-6 py-8 sm:py-12 lg:py-48">
        <div className="mx-auto max-w-xl lg:ml-12 lg:mr-[max(4rem,calc((100vw-80rem)/2+4rem))]">
          <StepIndicator steps={steps} />
          <div className="pt-2 sm:pt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
