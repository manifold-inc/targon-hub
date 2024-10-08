"use client";

import { useAuth } from "@/app/_components/providers";
import { reactClient } from "@/trpc/react";

export default function Page() {
  const auth = useAuth();

  const { data } = reactClient.model.getModels.useQuery();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Preferences</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">Notifications</h3>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Send me emails
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Alert notifications will be sent to {auth.user?.email || "your email"}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account</h2>
        <p className="mb-4">Manage your login credentials, security settings, or delete your account.</p>
        <button className="bg-blue-500 enable:hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300">Manage Account</button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Default Model</h2>
        <p className="mb-4">
          Apps will use this model by default, but they may override it if they choose to do so. 
          This model will also be used as your default fallback model.
        </p>
        <a href="/models" className="text-blue-500 hover:text-blue-600 transition duration-300">
          Click here&nbsp;
        </a>
 to browse available models and prices
          <select className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select a default model</option>
            {data?.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
      </section>
    </div>
  );
}
