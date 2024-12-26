"use client";

import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24 lg:pt-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="inline-flex items-center rounded-full border border-[#142900]/10 bg-[#142900]/5 px-3 py-1 text-sm font-medium text-[#142900]">
          Infrastructure
        </span>
        <h1 className="pt-6 text-3xl font-bold tracking-tight text-gray-900 sm:pt-8 sm:text-4xl md:text-5xl lg:text-6xl">
          Targon
        </h1>
        <p className="pt-6 text-sm leading-7 text-gray-600 sm:pt-8 sm:text-base sm:leading-8 md:text-lg">
          Operating on Bittensor&apos;s Subnet 4 to provide a deterministic
          verification of Large Language Models through a network of validators
          and miners
        </p>
      </motion.div>
    </div>
  );
};
