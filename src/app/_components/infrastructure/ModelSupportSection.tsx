"use client";

import { motion } from "framer-motion";
import { Code } from "lucide-react";

export const ModelSupportSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="relative grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative order-2 lg:order-1 lg:pt-12">
          <div className="absolute -inset-x-4 -bottom-16 top-0 hidden rounded-3xl bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent sm:block" />
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white/50 shadow-xl">
              <div className="border-b border-gray-100 bg-white/80 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="text-sm font-medium text-gray-600">
                    OpenAI Compatibility
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto p-4 sm:p-6">
                <pre className="whitespace-pre-wrap break-all text-xs text-gray-800 sm:break-normal sm:text-sm">
                  <code>{`from openai import OpenAI

client = OpenAI(
    base_url="https://api.targon.com/v1",
    api_key="your-api-key"
)

response = await client.chat.completions.create(
    model="NousResearch/Meta-Llama-3.1-70B-Instruct",
    stream=True,
    messages=[
        {"role": "system", "content": "You are an assistant."},
        {"role": "user", "content": "Hello assitant!"},
    ],
)`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div className="relative order-1 lg:sticky lg:top-8 lg:order-2 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#142900]/10 sm:h-14 sm:w-14">
              <Code className="h-6 w-6 text-[#142900] sm:h-7 sm:w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl">
                Model Support
              </h2>
              <p className="pt-4 text-sm leading-7 text-gray-600 sm:pt-6 sm:text-base md:text-lg">
                Targon supports various large language models through a
                standardized OpenAI-compatible interface.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="rounded-2xl border border-gray-100 bg-white/50 p-4 backdrop-blur-sm sm:p-6"
              >
                <h3 className="font-medium text-gray-900">Supported Models</h3>
                <ul className="space-y-2 pt-4 text-sm leading-6 text-gray-600 sm:space-y-3">
                  <li className="flex gap-x-3">
                    <span className="shrink-0 text-[#142900]">•</span>
                    <span className="break-words">
                      nvidia/Llama-3.1-Nemotron-70B-Instruct-HF
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="shrink-0 text-[#142900]">•</span>
                    <span className="break-words">
                      NousResearch/Meta-Llama-3.1-70B-Instruct
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="shrink-0 text-[#142900]">•</span>
                    <span className="break-words">And Many More</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
