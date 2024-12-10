"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { CardContent, CTACard } from "@/app/_components/browse/CTACard";
import { GlobeAnimation } from "@/app/_components/browse/GlobeAnimation";
import { ClientHubCard } from "@/app/_components/browse/HubCard";

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
    <div className="relative">
      <div className="mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative space-y-6 sm:space-y-8">
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
                <span className="italic text-mf-green">Targon&apos;s Ecosystem</span>
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
          className="relative py-6 sm:py-8"
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
        <div className="py-2">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2"
          >
            {/* Community Card (top-left) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="relative lg:col-span-3"
            >
              <div className="flex h-full flex-col justify-between space-y-4">
                {/* Lease Model Card */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="group relative"
                >
                  <Link href="/lease" className="block">
                    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#142900] to-[#1e3b00] p-6 transition-all duration-300 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="relative">
                        <h3 className="text-sm font-medium text-white/70">
                          Lease
                        </h3>
                        <p className="pt-1.5 text-xl font-semibold tracking-tight text-white">
                          Your AI Model
                        </p>
                        <p className="pt-2 text-sm/6 text-white/80">
                          Monetize your AI models through our marketplace
                        </p>
                        <div className="pt-4 flex items-center text-white/90">
                          <span className="text-sm">Learn more</span>
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Rent Compute Card */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="group relative"
                >
                  <Link href="/compute" className="block">
                    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#142900] to-[#1e3b00] p-6 transition-all duration-300 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="relative">
                        <h3 className="text-sm font-medium text-white/70">
                          Rent
                        </h3>
                        <p className="pt-1.5 text-xl font-semibold tracking-tight text-white">
                          GPU Compute
                        </p>
                        <p className="pt-2 text-sm/6 text-white/80">
                          Access high-performance computing on demand
                        </p>
                        <div className="pt-4 flex items-center text-white/90">
                          <span className="text-sm">Learn more</span>
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Model Rankings Card (stays in same position) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative lg:col-span-3"
            >
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-tr-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-mf-green">
                    Model Rankings
                  </h3>
                  <p className="pt-1.5 text-lg font-medium tracking-tight text-gray-900">
                    Performance Benchmarks
                  </p>
                  <p className="max-w-lg pt-2 text-sm/6 text-gray-600">
                    Compare model performance across different tasks and find
                    the best fit for your needs
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-tr-[2rem]" />
            </motion.div>

            {/* Text Generation Card (Moved to bottom) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative lg:col-span-2"
            >
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-bl-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
                <div className="p-6">
                  <h3 className="text-sm/4 font-semibold text-mf-green">
                    Text Generation
                  </h3>
                  <p className="pt-1.5 text-lg font-medium tracking-tight text-gray-900">
                    State-of-the-art Language Models
                  </p>
                  <div className="grid gap-2 pt-3">
                    {models.slice(0, 2).map((model, index) => (
                      <motion.div
                        key={`${model.provider}-${model.name}`}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                      >
                        <ClientHubCard {...model} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-bl-[2rem]" />
            </motion.div>

            {/* GPU Compute Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative lg:col-span-2"
            >
              <div className="absolute inset-px rounded-lg bg-white" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-mf-green">GPU Compute</h3>
                  <p className="pt-1.5 text-lg font-medium tracking-tight text-gray-900">
                    High-Performance Computing
                  </p>
                  <p className="max-w-lg pt-2 text-sm/6 text-gray-600">
                    Access our distributed GPU network
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5" />
            </motion.div>

            {/* Image Generation Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative lg:col-span-2"
            >
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-mf-green">Image Generation</h3>
                  <p className="pt-1.5 text-lg font-medium tracking-tight text-gray-900">
                    Text to Image Models
                  </p>
                  <p className="max-w-lg pt-2 text-sm/6 text-gray-600">
                    Create stunning visuals from text descriptions
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
