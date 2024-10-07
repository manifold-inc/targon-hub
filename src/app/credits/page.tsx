"use client";

import { useAuth } from "../_components/providers";
import { Switch } from '@headlessui/react';
import { useState } from 'react';
import { Popover } from '@headlessui/react';

export default function Page() {
  const auth = useAuth();
  const [useCrypto, setUseCrypto] = useState(false);

  return (
    <div className="relative isolate pt-12 px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl flex items-center justify-center">
            Credits
            <Popover className="relative">
              <Popover.Button className="ml-2 cursor-pointer inline-flex items-center justify-center w-5 h-5 border border-gray-500 rounded-full">
                <span className="text-xs text-gray-500">i</span>
              </Popover.Button>
              <Popover.Panel className="absolute z-10 w-64 p-4 bg-gray-200 text-gray-700 rounded-md shadow-lg text-xs">
                <p>You have a small usage allowance (&lt; $1) before you need to pay.</p>
                <p className="mt-2">Security: Payments are processed securely by Stripe. We do not store your credit card information. Crypto payments support any wallet type.</p>
                <p className="mt-2">Pricing: See pricing per model and fees (5% + $0.35 for Stripe).</p>
              </Popover.Panel>
            </Popover>
          </h1>
          <p className="text-2xl mt-4">$ 0</p>
          <div className="flex flex-col items-center mt-6 space-y-4">
            <button className="bg-indigo-500 text-white py-2 px-6 rounded-full">
              Add Credits
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Use crypto</span>
              <Switch
                checked={useCrypto}
                onChange={setUseCrypto}
                className={`${useCrypto ? 'bg-indigo-500' : 'bg-gray-200'} 
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span
                  className={`${useCrypto ? 'translate-x-6' : 'translate-x-1'} 
                    inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </div>
          </div>
          <div className="mt-8 text-gray-600 dark:text-gray-200">
            <p className="text-sm text-gray-400">~ PAYMENT HISTORY ~</p>
            <div className="flex justify-center mt-2 rounded-lg shadow-sm px-1 py-1">
              <button className="px-2 py-1 bg-white rounded-md">
                {"<"}
              </button>
              <span className="px-2 py-1">1</span>
              <button className="px-2 py-1 bg-white rounded-md">
                {">"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
