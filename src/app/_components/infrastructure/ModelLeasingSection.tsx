"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Shield } from "lucide-react";

import { reactClient } from "@/trpc/react";
import { fadeInAnimation } from "./ModelSupportSection";

export const ModelLeasingSection = () => {
  const { data: models } =
    reactClient.model.getThreeClosestImmunityEnds.useQuery();

  return (
    <motion.section
      {...fadeInAnimation}
      className="grid gap-8 lg:grid-cols-2 lg:gap-12"
    >
      {/* Left Column */}
      <motion.div
        className="space-y-6 lg:sticky lg:top-8 lg:pt-12"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Shield className="mx-auto h-12 w-12 rounded-full bg-[#142900]/10 p-3 text-[#142900] lg:mx-0 sm:h-14 sm:w-14" />

        <h2 className="text-center text-2xl font-semibold text-gray-900 lg:text-left sm:text-3xl">
          Model Leasing
        </h2>
        <p className="text-sm text-gray-600 sm:text-base md:text-lg">
          Lease and deploy any HuggingFace model with guaranteed availability
          through our immunity system.
        </p>

        <motion.div
          className="rounded-2xl border border-gray-100 bg-white/50 p-6 backdrop-blur-sm"
          {...fadeInAnimation}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-center font-medium text-gray-900 sm:text-left">
            Immunity System
          </h3>
          <ul className="space-y-3 pt-4 text-sm text-gray-600">
            <li className="flex gap-x-3">
              <span className="text-[#142900]">•</span>
              Your model is protected for a 7-day immunity period
            </li>
            <li className="flex gap-x-3">
              <span className="text-[#142900]">•</span>
              During immunity, your model cannot be replaced by others
            </li>
            <li className="flex gap-x-3">
              <span className="text-[#142900]">•</span>
              After immunity, your model will continue to be hosted until
              replaced
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Right Column */}
      <div className="relative lg:pt-12">
        <div className="absolute -inset-x-4 -bottom-16 top-0 rounded-3xl bg-gradient-to-br from-[#142900]/5 via-transparent to-transparent" />
        <div className="rounded-2xl border border-gray-100 bg-white/50 p-6 shadow-xl">
          <h3 className="text-center text-base font-semibold text-gray-900 sm:text-left sm:text-lg">
            Current Model Timeline
          </h3>
          <div className="space-y-3 pt-6">
            {models?.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  href={`/models/${encodeURIComponent(model.name!)}`}
                  className="relative z-10 block rounded-lg border border-gray-100 p-4 transition-all duration-200 hover:border-[#142900]/20 hover:bg-white/80"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium text-gray-900">
                        {model.name}
                      </div>
                      <div className="flex h-6 items-center gap-1 rounded-full py-0.5 pl-1.5 pr-2 text-[#16a34a]">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                        <span className="text-xs font-medium">Live</span>
                      </div>
                    </div>
                    {model.immunityEnds && (
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                        <span className="font-medium">
                          {new Date(model.immunityEnds) < new Date()
                            ? "Immunity Ended:"
                            : "Immunity Ends:"}
                        </span>
                        <span>
                          {new Date(model.immunityEnds).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="pt-6 text-center sm:text-left">
            <Link
              href="/infrastructure/immunity"
              className="group relative z-10 inline-flex items-center text-sm font-medium text-[#142900] hover:text-[#1e3b00]"
            >
              View full timeline
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
