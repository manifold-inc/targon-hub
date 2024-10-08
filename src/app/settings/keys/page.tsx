"use client";

import { useAuth } from "@/app/_components/providers";

export default function Page() {
  const auth = useAuth();

  return (
    <div>
      {/* New API Keys Section */}
      <div className="max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          API Keys
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">
          Create a new API key to access all models from Targon
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Create Key
        </button>
      </div>
    </div>
  );
}
