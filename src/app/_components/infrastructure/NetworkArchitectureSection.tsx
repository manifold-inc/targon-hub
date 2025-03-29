"use client";

import { motion } from "framer-motion";
import { Network } from "lucide-react";

import { fadeInVariants, slideUpVariants } from "./HeroSection";
import { NetworkAnimation } from "./NetworkAnimation";

export const slideLeftVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

//  Reusable card styles
const cardClasses =
  "rounded-2xl border border-mf-silver-700 bg-mf-milk-300/50 p-6 backdrop-blur-sm";
const statCardClasses =
  "rounded-2xl border border-mf-silver-700 bg-mf-milk-300/50 p-4 sm:p-6";

//  Reusable stat card component
const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className={statCardClasses}>
    <div className="text-2xl font-semibold text-mf-blue-700 sm:text-3xl">
      {value}
    </div>
    <div className="pt-1 text-[10px] text-gray-600 sm:pt-2 sm:text-xs md:text-sm">
      {label}
    </div>
  </div>
);

//  Reusable feature card component
const FeatureCard = ({
  title,
  items,
  delay,
}: {
  title: string;
  items: string[];
  delay: number;
}) => (
  <motion.div
    variants={slideUpVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={cardClasses}
  >
    <h3 className="text-center font-medium text-gray-900 lg:text-left">
      {title}
    </h3>
    <ul className="mt-4 list-inside list-disc space-y-3 text-sm leading-6 text-gray-600 marker:text-mf-blue-700">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </motion.div>
);

export const NetworkArchitectureSection = () => {
  return (
    <motion.section
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:sticky lg:top-8 lg:pt-12">
          <motion.div
            variants={slideLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14 lg:mx-0">
              <Network className="h-6 w-6 text-mf-blue-700 sm:h-7 sm:w-7" />
            </div>
            <div>
              <h2 className="text-center text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl lg:text-left">
                Network Architecture
              </h2>
              <p className="pt-4 text-sm leading-7 text-gray-600 sm:pt-6 sm:text-base md:text-lg">
                Built on Bittensor&apos;s Subnet 4, our API seamlessly connects
                users to a decentralized network of miners, backed by a robust
                validator system.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6">
              <FeatureCard
                title="API Layer"
                items={[
                  "OpenAI-compatible interface for seamless integration",
                  "Smart request routing to high-performing miners",
                ]}
                delay={0.2}
              />
              <FeatureCard
                title="Bittensor Network"
                items={[
                  "Decentralized network of validators and miners",
                  "Performance-based incentives for reliable responses",
                ]}
                delay={0.3}
              />
            </div>
          </motion.div>
        </div>
        <div className="relative lg:pt-12">
          <div className="absolute -inset-x-4 -bottom-16 top-0 rounded-3xl" />
          <div className="relative space-y-6 sm:space-y-8">
            {/* Large screens */}
            <div className="hidden aspect-[3/2] overflow-hidden rounded-2xl border border-mf-silver-700 bg-mf-milk-300/50 shadow-xl sm:aspect-[4/3] lg:block xl:hidden">
              <NetworkAnimation variant="compact" />
            </div>
            {/* Larger screens -- not the biggest fan of doing it like this */}
            <div className="hidden aspect-[3/2] overflow-hidden rounded-2xl border border-mf-silver-700 bg-mf-milk-300/50 shadow-xl sm:aspect-[4/3] xl:block">
              <NetworkAnimation variant="default" />
            </div>
            <motion.div
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-2 gap-3 sm:gap-4 lg:mt-auto"
            >
              <StatCard value="99.9%" label="Network Uptime" />
              <StatCard value="300+" label="Avg Tokens Per Second" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
