"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { fadeInAnimation } from "./ModelSupportSection";

const links = [
  {
    href: "/models",
    text: "Browse Models",
    primary: true,
  },
  {
    href: "/models/lease",
    text: "Lease a Model",
    primary: false,
  },
] as const;

export const GetStartedSection = () => {
  return (
    <motion.section {...fadeInAnimation} className="pb-12 sm:pb-24 lg:pb-32">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl">
          Ready to Get Started?
        </h2>
        <p className="pt-4 text-sm leading-7 text-gray-600 sm:pt-6 sm:text-base md:text-lg">
          Browse our available models or lease your own with our comprehensive
          guides.
        </p>
        <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:pt-10">
          {links.map(({ href, text, primary }) => (
            <Link
              key={href}
              href={href}
              className={`group inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition sm:w-auto
                ${
                  primary
                    ? "bg-mf-blue-900 text-mf-milk-300 hover:bg-[#1e3b00]"
                    : "border border-mf-blue-700 text-mf-blue-700 hover:bg-mf-blue-900/5"
                }`}
            >
              {text}
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
