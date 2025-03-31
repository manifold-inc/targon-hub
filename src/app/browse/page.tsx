"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { ActionCard } from "@/app/_components/browse/ActionCard";
import { BentoCard } from "@/app/_components/browse/BentoCard";
import { CardContent, CTACard } from "@/app/_components/browse/CTACard";
import { GlobeAnimation } from "@/app/_components/browse/GlobeAnimation";
import { GpuComputeCard } from "@/app/_components/browse/GpuComputeCard";
import { ModelPerformanceChart } from "@/app/_components/browse/ModelPerformanceChart";
import { ModelPreviewCard } from "@/app/_components/browse/ModelPreviewCard";
import { RadialRings } from "@/app/_components/browse/RadialRings";
import { reactClient } from "@/trpc/react";
import { HeroSection } from "../_components/browse/HeroSection";
import { DataFlowAnimation } from "../_components/landing/DataFlowAnimation";

export default function BrowsePage() {
  const models = reactClient.model.getModelPreview.useQuery();

  const actionCards = [
    {
      label: "Lease",
      title: "Any AI Model",
      description:
        "Power your applications with Targon's AI models with the lowest cost, highest performance, and most flexible leasing options.",
      href: "/models/lease",
      background: <RadialRings position="top-right" />,
      delay: 0.2,
    },
    {
      label: "Rent",
      title: "GPU Compute",
      description:
        "Access high-performance GPU compute with flexible pricing and instant scalability for any workload.",
      href: "/roadmap",
      delay: 0.3,
      isComingSoon: true,
    },
  ];

  return (
    <div className="relative bg-mf-milk-100">
      {/* Dot pattern container */}
      <div className="absolute -top-20 left-0 right-0 h-[550px] animate-fade-in bg-gradient-to-b from-[#ABD7FF] to-[#84C4FF]">
        <div className="dot-pattern h-full w-full animate-slide-in">
          <DataFlowAnimation />
        </div>
      </div>

      <div className="relative px-16 py-14">
        <HeroSection />

        {/* Main Playground CTA */}
        <div className="relative w-full animate-slide-in-delay">
          <Link
            href="/playground"
            className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-mf-silver-700 bg-mf-milk-300 p-4 shadow-sm transition-all duration-300 hover:bg-mf-milk-100 hover:shadow-lg 
            sm:p-6 md:p-8 lg:rounded-tl-xl"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr,200px] sm:gap-8">
              <div className="relative">
                <CardContent
                  title="AI Model Playground"
                  description="Discover and interact with our large language models through our fast playground. Test capabilities, compare models, and find the perfect fit for your use case."
                  ctaText="Try Now"
                />
              </div>
              <div className="pointer-events-none relative hidden h-full w-full items-center justify-end overflow-visible sm:flex">
                <div className="absolute -right-2/3 -top-10 aspect-square h-full">
                  <GlobeAnimation />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Secondary CTAs Grid */}
        <div className="grid animate-slide-in-delay grid-cols-1 gap-6 pt-6 sm:grid-cols-2">
          <CTACard
            title="Image Generation"
            description="Create stunning images with our SOTA text-to-image models. Free and open playground."
            ctaText="Learn More"
            href="/roadmap"
            isComingSoon={true}
            variant="left"
          />

          <CTACard
            title="AI Models"
            description="Browse our collection of high-performance language models ready for deployment."
            ctaText="View Models"
            href="/models"
            variant="right"
          />
        </div>

        {/* Section Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative py-4 sm:py-8"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-mf-silver-700" />
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.6,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="relative flex justify-center"
          ></motion.div>
        </motion.div>

        {/* Bento Grid */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2"
          >
            {/* Action Cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="relative h-full lg:col-span-3"
            >
              <div className="flex h-full flex-col gap-4">
                {actionCards.map((card) => (
                  <ActionCard key={card.label} {...card} />
                ))}
              </div>
            </motion.div>

            {/* Model Rankings */}
            <BentoCard
              title="Model Rankings"
              subtitle="Performance Metrics"
              description="Compare token throughput, latency, and costs across our available models with real-time performance data"
              className="lg:col-span-3"
              roundedCorners="lg:rounded-tr-[2rem]"
              delay={0.3}
            >
              <ModelPerformanceChart />
            </BentoCard>

            {/* Text Generation */}
            <BentoCard
              title="Text Generation"
              subtitle="SOTA Large Language Models"
              className="lg:col-span-2"
              roundedCorners="lg:rounded-bl-[2rem]"
              delay={0.4}
            >
              <div className="grid gap-2">
                {models.data?.map((model, index) => (
                  <motion.div
                    key={`${model.name}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  >
                    <ModelPreviewCard
                      name={model.name ?? ""}
                      endpoints={model.endpoints}
                      description={model.description ?? ""}
                      modality={model.modality ?? ""}
                      cpt={model.cpt ?? 0}
                    />
                  </motion.div>
                ))}
              </div>
            </BentoCard>

            {/* Other Cards */}
            <BentoCard
              title="GPU Compute"
              subtitle="High-Performance Computing"
              className="lg:col-span-2"
              delay={0.5}
            >
              <GpuComputeCard />
            </BentoCard>

            <BentoCard
              title="Image Generation"
              subtitle="Text to Image Models"
              className="lg:col-span-2"
              delay={0.6}
            >
              {/* Coming soon overlay */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-mf-milk-300/40 backdrop-blur-[2px]">
                <span className="inline-flex items-center rounded-full bg-mf-milk-300 px-3 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  Coming Soon
                </span>
              </div>

              {/* Existing content (greyed out) */}
              <div className="grid gap-2 opacity-50">
                {[
                  {
                    name: "RunDiffusion/Juggernaut-XL-v9",
                    endpoints: ["GENERATION"],
                    modality: "text-to-image",
                    description:
                      "High-fidelity XL model optimized for photorealistic images and superior composition. Excels at dynamic scenes and detailed subjects.",
                    cpt: 25,
                  },
                  {
                    name: "black-forest-labs/FLUX.1-dev",
                    endpoints: ["GENERATION"],
                    modality: "text-to-image",
                    description:
                      "Next-gen image synthesis model with enhanced coherence and style control. Specializes in artistic and creative generations.",
                    cpt: 20,
                  },
                  {
                    name: "stable-diffusion-v1-5/stable-diffusion-inpainting",
                    endpoints: ["GENERATION"],
                    modality: "text-to-image",
                    description:
                      "Specialized model for image inpainting and editing. Perfect for selective image modifications while maintaining context.",
                    cpt: 15,
                  },
                ].map((model, index) => (
                  <motion.div
                    key={model.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  >
                    <ModelPreviewCard {...model} />
                  </motion.div>
                ))}
              </div>
            </BentoCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
