"use client";

import { useState } from "react";
import { Popover, Switch } from "@headlessui/react";

import { useAuth } from "../_components/providers";

export default function Page() {
  const auth = useAuth();
  const [useCrypto, setUseCrypto] = useState(false);

  return (
    <div className="relative isolate px-6 pt-12 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="flex items-center justify-center text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl">
            Credits
            <Popover className="relative">
              <Popover.Button className="ml-2 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-gray-500">
                <span className="text-xs text-gray-500">i</span>
              </Popover.Button>
              <Popover.Panel className="absolute z-10 w-64 rounded-md bg-gray-200 p-4 text-xs text-gray-700 shadow-lg">
                <p>
                  You have a small usage allowance (&lt; $1) before you need to
                  pay.
                </p>
                <p className="mt-2">
                  Security: Payments are processed securely by Stripe. We do not
                  store your credit card information. Crypto payments support
                  any wallet type.
                </p>
                <p className="mt-2">
                  Pricing: See pricing per model and fees (5% + $0.35 for
                  Stripe).
                </p>
              </Popover.Panel>
            </Popover>
          </h1>
          <p className="mt-4 text-2xl">$ 0</p>
          <div className="mt-6 flex flex-col items-center space-y-4">
            <button className="rounded-full bg-indigo-500 px-6 py-2 text-white">
              Add Credits
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Use crypto</span>
              <Switch
                checked={useCrypto}
                onChange={setUseCrypto}
                className={`${useCrypto ? "bg-indigo-500" : "bg-gray-200"} 
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span
                  className={`${useCrypto ? "translate-x-6" : "translate-x-1"} 
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>
          <div className="mt-8 text-gray-600 dark:text-gray-200">
            <p className="text-sm text-gray-400">~ PAYMENT HISTORY ~</p>
            <div className="mt-2 flex justify-center rounded-lg px-1 py-1 shadow-sm">
              <button className="rounded-md bg-white px-2 py-1">{"<"}</button>
              <span className="px-2 py-1">1</span>
              <button className="rounded-md bg-white px-2 py-1">{">"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
