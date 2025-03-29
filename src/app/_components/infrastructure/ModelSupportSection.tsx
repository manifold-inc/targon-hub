"use client";

import { motion } from "framer-motion";
import { Code } from "lucide-react";

export const fadeInAnimation = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const codeExample = `from openai import OpenAI

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
)`;

const supportedModels = [
  "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF",
  "NousResearch/Meta-Llama-3.1-70B-Instruct",
  "And Many More",
];

export const ModelSupportSection = () => {
  return (
    <motion.section
      {...fadeInAnimation}
      className="relative grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12"
    >
      {/* Code Example Column */}
      <div className="relative order-2 lg:order-1 lg:pt-12">
        <div className="absolute -inset-x-4 -bottom-16 top-0 hidden rounded-3xl bg-gradient-to-bl from-mf-green-700/5 via-transparent to-transparent sm:block" />
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-mf-milk-300/50 shadow-xl">
          <div className="border-b border-gray-100 bg-mf-milk-300/80 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-gray-600">
                OpenAI Compatibility
              </span>
            </div>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap break-all p-4 text-xs text-gray-800 sm:break-normal sm:p-6 sm:text-sm">
            <code>{codeExample}</code>
          </pre>
        </div>
      </div>

      {/* Content Column */}
      <motion.div
        className="relative order-1 space-y-6 sm:space-y-8 lg:sticky lg:top-8 lg:order-2 lg:pt-12"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Code className="mx-auto h-12 w-12 rounded-full bg-mf-blue-900/10 p-3 text-mf-green-700 sm:h-14 sm:w-14 lg:mx-0" />

        <div>
          <h2 className="text-center text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl lg:text-left">
            Model Support
          </h2>
          <p className="pt-4 text-sm leading-7 text-gray-600 sm:pt-6 sm:text-base md:text-lg">
            Targon supports various large language models through a standardized
            OpenAI-compatible interface.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-2xl border border-gray-100 bg-mf-milk-300/50 p-4 backdrop-blur-sm sm:p-6"
        >
          <h3 className="text-center font-medium text-gray-900 lg:text-left">
            Supported Models
          </h3>
          <ul className="space-y-2 pt-4 text-sm leading-6 text-gray-600 sm:space-y-3">
            {supportedModels.map((model, index) => (
              <li key={index} className="flex gap-x-3">
                <span className="shrink-0 text-mf-green-700">•</span>
                <span className="break-words">{model}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};
