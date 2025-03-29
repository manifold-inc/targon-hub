"use client";

import { motion } from "framer-motion";
import { Check, CircleDashed, Hourglass, MessagesSquare } from "lucide-react";

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
    description:
      "Establishing the core platform infrastructure for AI model deployment and management.",
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
    description:
      "Building robust infrastructure and advanced deployment capabilities to support enterprises.",
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
    description:
      "Expanding core capabilities with multi-modal AI support and compute integration features.",
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
    description:
      "Expanding platform capabilities with specialized tools and advanced AI applications.",
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
    description:
      "Delivering comprehensive enterprise features for large-scale AI operations.",
    status: "upcoming",
    features: [
      "Team Collaboration Tools",
      "Enterprise SSO Integration",
      "Advanced Access Controls",
      "24/7 Enterprise Support",
    ],
  },
  {
    quarter: "Community",
    title: "Connect with Us",
    description: "Join our community to help shape the future of Targon.",
    status: "completed",
    features: [
      "Join Developer Discord",
      "Chat with the Team",
      "Email Support",
      "Feature Requests & Feedback",
    ],
  },
];

const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

const StatusBadge = ({ status }: { status: RoadmapItem["status"] }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      status === "completed"
        ? "bg-mf-blue-500/10 text-mf-blue-700/60 ring-1 ring-inset ring-mf-blue-500/30"
        : status === "in-progress"
          ? "bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
          : "mf-milk-300 text-gray-600 ring-1 ring-inset ring-gray-500/10"
    }`}
  >
    {status === "in-progress" && (
      <span className="relative mr-1 flex h-1 w-1">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
        <span className="relative inline-flex h-1 w-1 rounded-full bg-yellow-400" />
      </span>
    )}
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const FeatureIcon = ({
  status,
  isCommunitySection,
}: {
  status: RoadmapItem["status"];
  isCommunitySection: boolean;
}) => {
  if (isCommunitySection)
    return <MessagesSquare className="h-4 w-4 text-mf-blue-700/80" />;
  if (status === "completed")
    return <Check className="h-4 w-4 text-green-800" />;
  if (status === "in-progress")
    return (
      //custom animation speed
      <CircleDashed className="h-4 w-4 animate-spin text-yellow-500 [animation-duration:3000ms]" />
    );
  return <Hourglass className="h-4 w-4 text-gray-500" />;
};

export default function RoadmapPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-mf-blue-500/20 to-transparent" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] overflow-hidden">
        {/* using pixels here, because its a gradient which is hard to do with tailwind */}
        <div className="absolute -top-48 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-mf-blue-500/20 via-mf-blue-500/5 to-transparent blur-3xl" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={animations.stagger}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div variants={animations.fadeInUp}>
            <span className="inline-block rounded-full bg-mf-blue-900/5 px-3 py-1 text-sm font-medium text-mf-blue-700 sm:px-4 sm:py-1.5">
              Product Roadmap
            </span>
          </motion.div>
          <motion.h1
            variants={animations.fadeInUp}
            className="font-display pt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-6xl"
          >
            Building the future of{" "}
            <p className="text-mf-blue-700">AI infrastructure</p>
          </motion.h1>
          <motion.p
            variants={animations.fadeInUp}
            className="pt-4 text-base leading-7 text-gray-600 sm:pt-6 sm:text-lg sm:leading-8"
          >
            Our vision for revolutionizing how businesses deploy and scale AI
            models
          </motion.p>
        </motion.div>

        {/* Roadmap Grid */}
        <div className="relative pb-4 pt-8 sm:pb-8 sm:pt-16">
          <motion.div
            initial="initial"
            animate="animate"
            variants={animations.stagger}
            className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {roadmapItems.map((item, idx) => (
              <motion.div
                key={item.quarter}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: idx * 0.1 },
                  },
                }}
                className="group relative h-full"
              >
                <div className="relative flex h-full flex-col rounded-2xl border border-mf-silver-700 bg-mf-milk-300 p-4 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-6 lg:p-8">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white via-white to-gray-50/50" />

                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-medium text-mf-blue-700">
                        {item.quarter}
                      </span>
                      {item.quarter !== "Community" && (
                        <StatusBadge status={item.status} />
                      )}
                    </div>

                    <div className="pb-6 pt-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="pt-2 text-sm leading-6 text-gray-600">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex-1 space-y-3">
                      {item.features.map((feature, featureIdx) => (
                        <div
                          key={featureIdx}
                          className="mf-milk-300/80 flex h-10 items-center gap-3 rounded-xl px-4 text-sm text-gray-900 ring-1 ring-inset ring-gray-100"
                        >
                          <div className="flex h-5 w-5 flex-none items-center justify-center">
                            <FeatureIcon
                              status={item.status}
                              isCommunitySection={item.quarter === "Community"}
                            />
                          </div>
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
