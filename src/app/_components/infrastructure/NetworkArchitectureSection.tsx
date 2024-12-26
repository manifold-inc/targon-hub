"use client";

import { motion } from "framer-motion";
import { Network } from "lucide-react";

import { NetworkAnimation } from "./NetworkAnimation";

export const NetworkArchitectureSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:sticky lg:top-8 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#142900]/10 sm:h-14 sm:w-14">
              <Network className="h-6 w-6 text-[#142900] sm:h-7 sm:w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl">
                Network Architecture
              </h2>
              <p className="pt-4 text-sm leading-7 text-gray-600 sm:pt-6 sm:text-base md:text-lg">
                A decentralized network where validators send queries to miners
                and score them based on speed and response accuracy.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="rounded-2xl border border-gray-100 bg-white/50 p-6 backdrop-blur-sm"
              >
                <h3 className="font-medium text-gray-900">Validator Role</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                  <li className="flex gap-x-3">
                    <span className="text-[#142900]">•</span>
                    Sending OpenAI-compliant requests to miners
                  </li>
                  <li className="flex gap-x-3">
                    <span className="text-[#142900]">•</span>
                    Verifying miner outputs using log probability values
                  </li>
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="rounded-2xl border border-gray-100 bg-white/50 p-6 backdrop-blur-sm"
              >
                <h3 className="font-medium text-gray-900">Miner Role</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                  <li className="flex gap-x-3">
                    <span className="text-[#142900]">•</span>
                    Generating outputs from both organic and synthetic queries
                  </li>
                  <li className="flex gap-x-3">
                    <span className="text-[#142900]">•</span>
                    Running optimized instances of supported models
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <div className="relative lg:pt-12">
          <div className="absolute -inset-x-4 -bottom-16 top-0 rounded-3xl bg-gradient-to-br from-[#142900]/5 via-transparent to-transparent" />
          <div className="relative space-y-6 sm:space-y-8">
            <div className="aspect-[3/2] overflow-hidden rounded-2xl border border-gray-100 bg-white/50 shadow-xl sm:aspect-[4/3]">
              <NetworkAnimation />
            </div>
            <motion.div
              className="grid grid-cols-2 gap-3 sm:gap-4 lg:mt-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="rounded-2xl border border-gray-100 bg-white/50 p-4 sm:p-6">
                <div className="text-2xl font-semibold text-[#142900] sm:text-3xl">
                  99.9%
                </div>
                <div className="pt-1 text-[10px] text-gray-600 sm:pt-2 sm:text-xs md:text-sm">
                  Network Uptime
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white/50 p-4 sm:p-6">
                <div className="text-2xl font-semibold text-[#142900] sm:text-3xl">
                  300+
                </div>
                <div className="pt-1 text-[10px] text-gray-600 sm:pt-2 sm:text-xs md:text-sm">
                  Avg Tokens Per Second
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
