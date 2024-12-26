"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Shield } from "lucide-react";

import ModelStatusIndicator from "@/app/_components/ModelStatusIndicator";
import { reactClient } from "@/trpc/react";

export const ModelLeasingSection = () => {
  const { data: models } = reactClient.model.getImmunityTimeline.useQuery();

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
              <Shield className="h-6 w-6 text-[#142900] sm:h-7 sm:w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl">
                Model Leasing
              </h2>
              <p className="pt-4 text-sm leading-7 text-gray-600 sm:pt-6 sm:text-base md:text-lg">
                Lease and deploy any HuggingFace model with guaranteed
                availability through our immunity system.
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
                <h3 className="font-medium text-gray-900">Immunity System</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
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
            </div>
          </motion.div>
        </div>

        <div className="relative lg:pt-12">
          <div className="absolute -inset-x-4 -bottom-16 top-0 rounded-3xl bg-gradient-to-br from-[#142900]/5 via-transparent to-transparent" />
          <div className="relative space-y-6 sm:space-y-8">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white/50 shadow-xl">
              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Current Model Timeline
                </h3>
                <div className="mt-6 flex flex-col gap-3">
                  {models?.slice(-3).map((model, index) => (
                    <motion.div
                      key={model.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Link
                        href={`/models/${encodeURIComponent(model.name!)}`}
                        className="block rounded-lg border border-gray-100 transition-colors hover:border-[#142900]/20"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <div className="max-w-36 truncate text-sm font-medium text-gray-900 sm:max-w-none">
                              {model.name}
                            </div>
                            <ModelStatusIndicator
                              enabled={model.enabled ?? false}
                              showBorder={false}
                            />
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {model.immunityEnds ? (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-medium">
                                  Immunity Ends:
                                </span>
                                <span>
                                  {new Date(
                                    model.immunityEnds,
                                  ).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            ) : (
                              <span>No immunity period</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    href="/models/immunity"
                    className="group inline-flex items-center text-sm font-medium text-[#142900] hover:text-[#1e3b00]"
                  >
                    View full timeline
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
