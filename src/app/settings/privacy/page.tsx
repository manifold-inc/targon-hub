'use client'

import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { Popover } from '@headlessui/react';
import Link from 'next/link';

const PrivacyPage: React.FC = () => {
  const [loggingEnabled, setLoggingEnabled] = useState(false);
  const [modelTrainingEnabled, setModelTrainingEnabled] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Privacy</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Logging</h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Enable input/output logging</span>
          <Switch
            checked={loggingEnabled}
            onChange={setLoggingEnabled}
            className="relative inline-flex items-center h-6 rounded-full w-11"
          >
            <span className="sr-only">Enable input/output logging</span>
            <span
              className={`${
                loggingEnabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block w-4 h-4 transform bg-white rounded-full`}
            />
          </Switch>
        </div>
        <p className="text-sm text-gray-600 flex items-center">
          Store inputs & outputs with OpenRouter and get a 1% discount on all LLMs.
          <Popover className="relative">
            <Popover.Button className="ml-1 cursor-help">ⓘ</Popover.Button>
            <Popover.Panel className="absolute z-10 w-64 p-4 bg-white border border-gray-300 rounded shadow-lg">
              More information about logging
            </Popover.Panel>
          </Popover>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Model Training</h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Enable providers that may train on inputs</span>
          <Switch
            checked={modelTrainingEnabled}
            onChange={setModelTrainingEnabled}
            className="relative inline-flex items-center h-6 rounded-full w-11"
          >
            <span className="sr-only">Enable providers that may train on inputs</span>
            <span
              className={`${
                modelTrainingEnabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block w-4 h-4 transform bg-white rounded-full`}
            />
          </Switch>
        </div>
        <p className="text-sm text-gray-600 flex items-center">
          Control whether to enable providers that can anonymously use your data to improve their models.
          <Popover className="relative">
            <Popover.Button className="ml-1 cursor-help">ⓘ</Popover.Button>
            <Popover.Panel className="absolute z-10 w-64 p-4 bg-white border border-gray-300 rounded shadow-lg">
              More information about model training
            </Popover.Panel>
          </Popover>
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Chat History</h2>
        <p className="text-sm text-gray-600">
          Your chat history in the <Link href="/chatroom" className="text-blue-600 hover:underline">Chatroom</Link> is stored locally on your device. If logging is enabled, only LLM inputs and outputs are saved.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPage;