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
    <div className="grid h-full grid-cols-1 bg-white lg:grid-cols-2">
      {/* Left column */}
      <div className="relative bg-gray-100 px-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-8">
        {/* Background pattern - simplified SVG */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          >
            <defs>
              <pattern
                id="grid-pattern"
                width={200}
                height={200}
                x="100%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M130 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="white" strokeWidth={0} />
            <rect
              width="100%"
              height="100%"
              fill="url(#grid-pattern)"
              strokeWidth={0}
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative py-12 lg:py-48">
          <div className="mx-auto lg:mx-0 lg:max-w-lg">
            <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Add Any Model
            </h2>
            <p className="pt-6 text-lg/8 text-gray-600">
              Deploy any HuggingFace model with just a few clicks. Our platform
              handles all the infrastructure complexity, so you can focus on
              using your model.
            </p>
            <dl className="space-y-4 pt-10 text-base/7 text-gray-600">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-center gap-x-3">
                  <dt className="flex-none">
                    <span className="sr-only">Feature</span>
                    <Icon className="h-6 w-6 text-mf-green" />
                  </dt>
                  <dd>
                    <span className="font-semibold text-gray-900">{title}</span>
                    <br />
                    {description}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="pt-10">
              <Link
                href="/infrastructure"
                className="group inline-flex items-center rounded-full border border-[#142900] px-6 py-2.5 text-sm font-medium text-[#142900] transition hover:bg-[#142900]/5"
              >
                Curious about how it works?
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="relative bg-white px-6 py-8 sm:py-12 lg:py-48">
        <div className="mx-auto max-w-xl lg:ml-12 lg:mr-[max(4rem,calc((100vw-80rem)/2+4rem))]">
          <StepIndicator steps={steps} />
          <div className="pt-2 sm:pt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
