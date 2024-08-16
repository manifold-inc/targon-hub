"use client";

import Link from "next/link";

import { useAuth } from "./_components/providers";

export default function Page() {
  const auth = useAuth();

  return (
    <div>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl">
              Decentralized LLMs at your fingertips
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-200">
              Powered by the bittensor ecosystem on subnet 4. Cheaper, better,
              faster.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={auth.status === "AUTHED" ? "/dashboard" : "/sign-in"}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <a
                href="https://discord.gg/manifold"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50"
              >
                Learn more about SN4<span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
