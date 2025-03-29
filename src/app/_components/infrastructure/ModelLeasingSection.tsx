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
        <Shield className="mx-auto h-12 w-12 rounded-full p-3 text-mf-blue-700 sm:h-14 sm:w-14 lg:mx-0" />

        <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl lg:text-left">
          Model Hosting
        </h2>
        <p className="text-sm text-gray-600 sm:text-base md:text-lg">
          Experience worry-free model deployment with our flexible leasing
          system. Choose between one-time 7-day leases or automatic weekly
          renewals for continuous operation.
        </p>

        <motion.div
          className="rounded-2xl border border-mf-silver-700 bg-mf-milk-300/50 p-6 backdrop-blur-sm"
          {...fadeInAnimation}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-center font-medium text-gray-900 sm:text-left">
            Leasing Options
          </h3>
          <ul className="space-y-3 pt-4 text-sm text-gray-600">
            <li className="flex gap-x-3">
              <span className="text-mf-green-700">•</span>
              Choose between one-time 7-day leases or automatic weekly renewals
            </li>
            <li className="flex gap-x-3">
              <span className="text-mf-green-700">•</span>
              Your model is protected during the lease period and cannot be
              replaced
            </li>
            <li className="flex gap-x-3">
              <span className="text-mf-green-700">•</span>
              Keep your model running smoothly with hassle-free lease renewals
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Right Column */}
      <div className="relative lg:pt-12">
        <div className="absolute -inset-x-4 -bottom-16 top-0 rounded-3xl" />
        <div className="rounded-2xl border border-mf-silver-700 bg-mf-milk-300/50 p-6 shadow-xl">
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
                  className="relative z-10 block rounded-lg border border-mf-silver-700 p-4 transition-all duration-200 hover:border-mf-green-700/20 hover:bg-mf-milk-300/80"
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
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-mf-ash-500">
                      {model.immunityEnds && (
                        <span>
                          {new Date(model.immunityEnds) > new Date() ? (
                            <>
                              <span className="font-medium">
                                Immunity Ends:
                              </span>{" "}
                              {new Date(model.immunityEnds).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </>
                          ) : (
                            <span className="font-medium">
                              Active Until Replaced
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="pt-6 text-center sm:text-left">
            <Link
              href="/models/immunity"
              className="group relative z-10 inline-flex items-center text-sm font-medium text-mf-blue-700 hover:text-[#1e3b00]"
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
