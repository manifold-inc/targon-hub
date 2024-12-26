"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export const GetStartedSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative pb-12 sm:pb-24 lg:pb-32"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl">
          Ready to Get Started?
        </h2>
        <p className="pt-4 text-sm leading-7 text-gray-600 sm:pt-6 sm:text-base md:text-lg">
          Browse our available models or lease your own with our comprehensive
          guides.
        </p>
        <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:pt-10">
          <Link
            href="/models"
            className="group inline-flex w-full items-center justify-center rounded-full bg-[#142900] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#1e3b00] sm:w-auto"
          >
            Browse Models
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/models/lease"
            className="group inline-flex w-full items-center justify-center rounded-full border border-[#142900] px-6 py-2.5 text-sm font-medium text-[#142900] transition hover:bg-[#142900]/5 sm:w-auto"
          >
            Lease a Model
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
};
