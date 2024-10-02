"use client";

import { useAuth } from "@/app/_components/providers";

export default function Page() {
  const auth = useAuth();

  return (
    <div>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl">
              Welcome {auth.user || ""} to activity
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-200">
              Powered by the bittensor ecosystem on subnet 4. Cheaper, better,
              faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
