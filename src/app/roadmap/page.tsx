"use client";

import { motion } from "framer-motion";
import { RadialRings } from "@/app/_components/browse/RadialRings";

interface RoadmapItem {
  quarter: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  features: string[];
}

const roadmapItems: RoadmapItem[] = [
  {
    quarter: "Q4 2024",
    title: "Foundation Launch",
    description: "Establishing the core platform infrastructure for AI model deployment and management.",
    status: "completed",
    features: [
      "Model Marketplace & Discovery",
      "Basic Model Deployment Pipeline",
      "Usage Analytics Dashboard",
      "User Authentication & Billing",
    ],
  },
  {
    quarter: "Q1 2025",
    title: "Infrastructure Scale",
    description: "Building robust infrastructure and advanced deployment capabilities to support enterprise workloads.",
    status: "in-progress",
    features: [
      "High-Performance GPU Infrastructure",
      "Auto-scaling Model Deployments",
      "Advanced Monitoring & Logging",
      "Enterprise Security Controls",
    ],
  },
  {
    quarter: "Q2 2025",
    title: "Platform Expansion",
    description: "Expanding core capabilities with multi-modal AI support and compute integration features.",
    status: "upcoming",
    features: [
      "Multi-Modal Model Support",
      "Compute Integration API",
      "Cross-Modal Data Pipeline",
      "Custom Compute Provider Integration",
    ],
  },
  {
    quarter: "Q3 2025",
    title: "Advanced Applications",
    description: "Expanding platform capabilities with specialized tools and advanced AI applications.",
    status: "upcoming",
    features: [
      "Multi-Modal Model Fine-tuning",
      "Custom Training Pipeline",
      "Model Composition Tools",
      "Advanced API Integration",
    ],
  },
  {
    quarter: "Q4 2025",
    title: "Enterprise Features",
    description: "Delivering comprehensive enterprise features for large-scale AI operations.",
    status: "upcoming",
    features: [
      "Team Collaboration Tools",
      "Enterprise SSO Integration",
      "Advanced Access Controls",
      "24/7 Enterprise Support",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/4 top-0 h-[800px] w-[800px] opacity-30">
          <RadialRings position="top-right" />
        </div>
        <div className="absolute -left-1/4 top-96 h-[600px] w-[600px] opacity-30">
          <RadialRings position="bottom-left" />
        </div>
        <div className="absolute left-1/4 top-32 h-32 w-32 rounded-full bg-gradient-to-r from-mf-green/5 to-transparent blur-3xl" />
        <div className="absolute right-1/4 top-64 h-48 w-48 rounded-full bg-gradient-to-l from-mf-green/5 to-transparent blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative space-y-4 sm:space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-gray-50/80 px-6 pb-12 pt-24 shadow-2xl shadow-mf-green/5 sm:px-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#142900]/10 to-transparent"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 1,
                type: "spring",
                stiffness: 50,
                damping: 20,
              }}
              className="relative text-center"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block"
              >
                <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#142900]/10 px-6 py-2 text-sm font-semibold text-mf-green ring-1 ring-[#142900]/20">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mf-green opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-mf-green"></span>
                  </span>
                  Building the Future of AI Infrastructure
                </span>
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mx-auto max-w-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text pb-4 text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl"
              >
                Product Roadmap
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl"
              >
                Follow our journey as we revolutionize AI infrastructure and empower businesses with cutting-edge machine learning capabilities.
              </motion.p>
            </motion.div>
          </div>
        </div>

        <div className="relative mt-24 flow-root pb-24">
          <div className="absolute inset-0 flex justify-center">
            <div className="w-px bg-gradient-to-b from-mf-green/30 via-mf-green/10 to-transparent" />
          </div>
          
          <ul role="list" className="-mb-8">
            {roadmapItems.map((item, itemIdx) => (
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + itemIdx * 0.1, duration: 0.5 }}
                key={item.quarter}
                className="relative pb-12"
              >
                {itemIdx !== roadmapItems.length - 1 ? (
                  <span
                    className="absolute left-6 top-6 -ml-px h-full w-0.5 bg-gradient-to-b from-mf-green via-mf-green/50 to-transparent"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex gap-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#142900]/20 to-[#142900]/5 ring-4 ring-white shadow-lg">
                    <div
                      className={`relative h-4 w-4 rounded-full transition-all duration-500 ${
                        item.status === "completed"
                          ? "bg-mf-green shadow-lg shadow-mf-green/30"
                          : item.status === "in-progress"
                          ? "bg-yellow-400 shadow-lg shadow-yellow-400/30"
                          : "bg-gray-300"
                      }`}
                    >
                      {item.status === "in-progress" && (
                        <span className="absolute -inset-1 animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                      )}
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4">
                    <div className="w-full">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-xl shadow-mf-green/5 backdrop-blur-sm transition-all duration-300 hover:border-mf-green/30 hover:shadow-2xl hover:shadow-mf-green/10"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#142900]/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-mf-green to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-2 rounded-lg bg-[#142900]/10 px-4 py-2 text-sm font-semibold text-mf-green ring-1 ring-inset ring-[#142900]/20">
                              {item.quarter}
                              {item.status === "in-progress" && (
                                <span className="relative flex h-2 w-2">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                                  <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400"></span>
                                </span>
                              )}
                            </span>
                            <span
                              className={`rounded-full px-4 py-1 text-sm font-medium ${
                                item.status === "completed"
                                  ? "bg-green-100 text-green-800 ring-1 ring-green-600/20"
                                  : item.status === "in-progress"
                                  ? "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20"
                                  : "bg-gray-100 text-gray-800 ring-1 ring-gray-400/20"
                              }`}
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </div>
                          <h3 className="mt-4 text-xl font-bold text-gray-900">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-base text-gray-600">
                            {item.description}
                          </p>
                          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {item.features.map((feature, featureIdx) => (
                              <li
                                key={featureIdx}
                                className="flex items-center rounded-xl bg-gradient-to-br from-gray-50 to-white p-3 text-sm text-gray-700 shadow-sm ring-1 ring-gray-900/5"
                              >
                                <svg
                                  className="mr-3 h-5 w-5 flex-shrink-0 text-mf-green"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 