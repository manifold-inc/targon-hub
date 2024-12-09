"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { GlobeAnimation } from "@/app/_components/browse/GlobeAnimation";
import { ClientHubCard } from "@/app/_components/browse/HubCard";

// Common card content structure
const CardContent = ({
  title,
  description,
  ctaText,
  isComingSoon,
}: {
  title: string;
  description: string;
  ctaText: string;
  isComingSoon?: boolean;
}) => (
  <div className="relative flex h-full flex-col">
    <div className="flex-1">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-light text-gray-900">{title}</h3>
        {isComingSoon && (
          <span className="rounded-full border border-[#142900] bg-white px-3 py-1 text-xs font-medium text-[#142900]">
            Coming Soon
          </span>
        )}
      </div>
      <p className="w-4/5 text-base/relaxed text-gray-600">{description}</p>
    </div>
    <div className="mt-4 flex items-center text-sm text-[#142900] transition-colors group-hover:text-mf-green">
      <span className="font-medium">{ctaText}</span>
      <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </div>
  </div>
);

export default function BrowsePage() {
  const models = [
    {
      name: "Llama 3.1 70B",
      provider: "hugging-quants",
      type: "chat" as const,
      description: "Latest large language model from Meta AI",
    },
    {
      name: "Llama 3.1 8B",
      provider: "unsloth",
      type: "chat" as const,
      description: "Efficient and powerful language model",
    },
    {
      name: "Flux Schnell Text to Image",
      provider: "black-forest-labs",
      type: "text-to-image" as const,
      description: "Fast and high-quality image generation",
    },
    {
      name: "Proteus Text to Image",
      provider: "dataautopilot3",
      type: "text-to-image" as const,
      description: "Advanced image generation model",
    },
    {
      name: "Rogue Rose 103B",
      provider: "TheBloke",
      type: "completions" as const,
      description: "Large language model optimized for completions",
    },
    {
      name: "Llama 3.2 3B",
      provider: "unsloth",
      type: "chat" as const,
      description: "Lightweight and efficient language model",
    },
  ];

  return (
    <div className="relative py-14 sm:py-20">
      <div className="mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative pb-12">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base/7 font-semibold text-mf-green">
                Welcome to Targon Hub
              </h2>
              <p className="max-w-lg whitespace-nowrap py-2 text-4xl font-semibold italic tracking-tight text-mf-green sm:text-5xl">
                Your AI Hub For The Future
              </p>
            </div>
            {/* Platform Status moved to header */}
            <div className="flex items-center gap-2 rounded-full border border-mf-green bg-white/80 px-4 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-green-600"></span>
              <span className="text-sm font-medium text-mf-green">
                All Systems Operational
              </span>
            </div>
          </div>
        </div>

        {/* Bento Grid - Now without Network Stats section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6 lg:grid-rows-[auto_auto_1fr]">
          {/* Main Playground CTA */}
          <div className="relative lg:col-span-6">
            <Link
              href="/playground"
              className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all 
              duration-300 hover:shadow-lg sm:p-8 lg:rounded-tl-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#142900]/5 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#142900]/5 via-transparent to-transparent" />
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr,200px]">
                <div className="relative">
                  <CardContent
                    title="AI Model Playground"
                    description="Discover and interact with our large language models through our fast playground. Test capabilities, compare models, and find the perfect fit for your use case."
                    ctaText="Try Now"
                  />
                </div>
                <div className="pointer-events-none relative flex h-full w-full items-center justify-end overflow-visible">
                  <div className="absolute -right-2/3 -top-10 aspect-square h-full">
                    <GlobeAnimation />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Secondary CTAs */}
          <div className="relative lg:col-span-3">
            <Link
              href="/roadmap"
              className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all 
              duration-300 hover:shadow-lg sm:p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
              <CardContent
                title="Image Generation"
                description="Create stunning images with our SOTA text-to-image models. Free and open playground."
                ctaText="Learn More"
                isComingSoon
              />
            </Link>
          </div>

          <div className="relative lg:col-span-3">
            <Link
              href="/roadmap"
              className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all 
              duration-300 hover:shadow-lg sm:p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-tl from-[#142900]/5 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#142900]/5 via-transparent to-transparent" />
              <CardContent
                title="GPU Compute"
                description="Access our decentralized network of high-performance GPUs for your AI workloads."
                ctaText="Learn More"
                isComingSoon
              />
            </Link>
          </div>

          {/* Models Grid - Now spans full width */}
          <div className="relative lg:col-span-6 lg:row-span-2">
            <div className="absolute inset-px rounded-xl bg-white" />
            <div className="relative grid gap-4 rounded-xl p-8 sm:grid-cols-2 lg:grid-cols-3">
              {models.map((model) => (
                <ClientHubCard
                  key={`${model.provider}-${model.name}`}
                  {...model}
                />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-px rounded-xl shadow-md ring-1 ring-black/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
