"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

const PrivacyPage: React.FC = () => {
  const [loggingEnabled, setLoggingEnabled] = useState(false);
  const [modelTrainingEnabled, setModelTrainingEnabled] = useState(false);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-8 text-3xl font-bold">Privacy</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Logging</h2>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Enable input/output logging</span>
          <button
            onClick={() => setLoggingEnabled(!loggingEnabled)}
            className={`w-14 h-7 flex items-center rounded-full p-1 ${
              loggingEnabled ? "bg-manifold-pink2" : "bg-gray-700 dark:bg-gray-600"
            }`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${
              loggingEnabled ? "translate-x-7" : ""
            }`} />
          </button>
        </div>
        <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          Store inputs & outputs with OpenRouter and get a 1% discount on all
          LLMs.
          <Popover className="relative">
            <PopoverButton className="ml-1 cursor-help">ⓘ</PopoverButton>
            <PopoverPanel className="absolute z-10 w-64 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg">
              More information about logging
            </PopoverPanel>
          </Popover>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Model Training</h2>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            Enable providers that may train on inputs
          </span>
          <button
            onClick={() => setModelTrainingEnabled(!modelTrainingEnabled)}
            className={`w-14 h-7 flex items-center rounded-full p-1 ${
              modelTrainingEnabled ? "bg-manifold-pink2" : "bg-gray-700 dark:bg-gray-600"
            }`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${
              modelTrainingEnabled ? "translate-x-7" : ""
            }`} />
          </button>
        </div>
        <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          Control whether to enable providers that can anonymously use your data
          to improve their models.
          <Popover className="relative">
            <PopoverButton className="ml-1 cursor-help">ⓘ</PopoverButton>
            <PopoverPanel className="absolute z-10 w-64 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg">
              More information about model training
            </PopoverPanel>
          </Popover>
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Chat History</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your chat history in the{" "}
          <Link href="/chatroom" className="text-blue-600 dark:text-blue-400 hover:underline">
            Chatroom
          </Link>{" "}
          is stored locally on your device. If logging is enabled, only LLM
          inputs and outputs are saved.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPage;
