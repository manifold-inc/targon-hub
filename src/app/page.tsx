"use client";

import Link from "next/link";

import { useAuth } from "./_components/providers";
import { ChefHat } from "lucide-react";

export default function Page() {
  const auth = useAuth();
  // Remove the unused 'models' variable if it's not needed

  return (
    <div>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-manifold-green dark:text-gray-50 sm:text-6xl">
              Decentralized LLMs at your fingertips
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-white">
              Powered by the bittensor ecosystem on subnet 4. 
              <Link 
                href="models" 
                className="ml-1 font-semibold text-manifold-green hover:text-manifold-green/80 dark:text-gray-400 dark:hover:text-gray-300 underline decoration-2 underline-offset-2 transition-colors duration-200"
              >
                Cheaper, better, faster.
              </Link>
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={auth.status === "AUTHED" ? "/models" : "/sign-in"}
                className="flex items-center justify-center  rounded-md bg-manifold-green px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 dark:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span className="flex items-center gap-2">
                  Get started
                  <ChefHat />
                </span>
              </Link>
              <Link
                href="https://discord.gg/manifold"
                className="text-sm font-semibold leading-6 text-manifold-green dark:text-white"
              >
                Learn more about SN4<span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="p-10">
            ~ <Link href="/rankings" className="text-manifold-green hover:text-gray-500 font-semibold"> Trending Models </Link> ~
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
