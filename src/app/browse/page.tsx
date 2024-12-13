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

export default function BrowsePage() {
  const models = reactClient.model.getModelPreview.useQuery();

  console.log(models.data);

  const actionCards = [
    {
      label: "Lease",
      title: "Any AI Model",
      description:
        "Power your applications with Targon's AI models with the lowest cost, highest performance, and most flexible leasing options.",
      href: "/lease",
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
    <div className="relative">
      <div className="mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative space-y-4 sm:space-y-6">
          <div className="relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#142900]/5 to-transparent"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 50,
                damping: 20,
              }}
              className="relative pb-8 pt-16 text-center"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block"
              >
                <span className="mb-4 inline-block rounded-full bg-[#142900]/5 px-4 py-1.5 text-sm font-medium text-mf-green">
                  Explore Targon
                </span>
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mx-auto max-w-2xl text-2xl font-semibold text-gray-900 sm:text-3xl md:text-4xl"
              >
                An Inside Look at{" "}
                <span className="italic text-mf-green">
                  Targon&apos;s Ecosystem
                </span>
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mx-auto max-w-xl pt-4 text-base text-gray-600 sm:text-lg"
              >
                Discover our comprehensive suite of AI tools and services
                designed to power the next generation of applications
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Main Playground CTA */}
        <div className="relative w-full animate-slide-in-delay">
          <Link
            href="/playground"
            className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg 
            sm:p-6 md:p-8 lg:rounded-tl-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#142900]/5 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#142900]/5 via-transparent to-transparent" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr,200px] sm:gap-8">
              <div className="relative">
                <CardContent
                  title="AI Model Playground"
                  description="Discover and interact with our large language models through our fast playground. Test capabilities, compare models, and find the perfect fit for your use case."
                  ctaText="Try Now"
                />
              </div>
              <div className="pointer-events-none relative hidden h-full w-full items-center justify-end overflow-visible sm:flex">
                <div className="absolute -right-2/3 -top-10 aspect-square h-full ">
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
            title="GPU Compute"
            description="Access our decentralized network of high-performance GPUs for your AI workloads."
            ctaText="Learn More"
            href="/roadmap"
            isComingSoon={true}
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
            <div className="w-full border-t border-gray-200" />
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
          >
            <span className="bg-white px-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mf-green/5">
                <div className="h-3 w-3 rounded-full bg-mf-green" />
              </div>
            </span>
          </motion.div>
        </motion.div>

        {/* Bento Grid */}
        <div className="py-4">
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
                      modality={model.modality}
                      cpt={model.cpt}
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
              className="relative lg:col-span-2"
              roundedCorners="max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]"
              delay={0.6}
            >
              {/* Coming soon overlay */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-gray-100/40 backdrop-blur-[2px]">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
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
