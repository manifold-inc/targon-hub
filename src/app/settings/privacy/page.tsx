"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Popover, Switch } from "@headlessui/react";

const PrivacyPage: React.FC = () => {
  const [loggingEnabled, setLoggingEnabled] = useState(false);
  const [modelTrainingEnabled, setModelTrainingEnabled] = useState(false);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-8 text-3xl font-bold">Privacy</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Logging</h2>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-gray-700">Enable input/output logging</span>
          <Switch
            checked={loggingEnabled}
            onChange={setLoggingEnabled}
            className="relative inline-flex h-6 w-11 items-center rounded-full"
          >
            <span className="sr-only">Enable input/output logging</span>
            <span
              className={`${
                loggingEnabled ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        </div>
        <p className="flex items-center text-sm text-gray-600">
          Store inputs & outputs with OpenRouter and get a 1% discount on all
          LLMs.
          <Popover className="relative">
            <Popover.Button className="ml-1 cursor-help">ⓘ</Popover.Button>
            <Popover.Panel className="absolute z-10 w-64 rounded border border-gray-300 bg-white p-4 shadow-lg">
              More information about logging
            </Popover.Panel>
          </Popover>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Model Training</h2>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-gray-700">
            Enable providers that may train on inputs
          </span>
          <Switch
            checked={modelTrainingEnabled}
            onChange={setModelTrainingEnabled}
            className="relative inline-flex h-6 w-11 items-center rounded-full"
          >
            <span className="sr-only">
              Enable providers that may train on inputs
            </span>
            <span
              className={`${
                modelTrainingEnabled ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        </div>
        <p className="flex items-center text-sm text-gray-600">
          Control whether to enable providers that can anonymously use your data
          to improve their models.
          <Popover className="relative">
            <Popover.Button className="ml-1 cursor-help">ⓘ</Popover.Button>
            <Popover.Panel className="absolute z-10 w-64 rounded border border-gray-300 bg-white p-4 shadow-lg">
              More information about model training
            </Popover.Panel>
          </Popover>
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Chat History</h2>
        <p className="text-sm text-gray-600">
          Your chat history in the{" "}
          <Link href="/chatroom" className="text-blue-600 hover:underline">
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
