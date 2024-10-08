"use client";

import { useAuth } from "@/app/_components/providers";
import Link from "next/link";
import { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
} from "@headlessui/react";
import { Search, Check } from "lucide-react";
import { format, parseISO } from "date-fns";
import { reactClient } from "@/trpc/react";

export default function Page() {
  const auth = useAuth();
  const [selectedModel, setSelectedModel] = useState("");
  const [query, setQuery] = useState("");

  const models = reactClient.model.getModels.useQuery();

  const filteredModels =
    query === ""
      ? models.data || []
      : (models.data ?? []).filter((model) => {
          const modelName = model.name?.toLowerCase() || "";
          const uploadDate =
            model.uploadedAt instanceof Date
              ? model.uploadedAt
              : parseISO(model.uploadedAt);
          const formattedDate = format(uploadDate, "MMMM yyyy").toLowerCase();
          const searchQuery = query.toLowerCase();
          return (
            modelName.includes(searchQuery) ||
            formattedDate.includes(searchQuery)
          );
        });

  const groupedModels = filteredModels.reduce(
    (acc, model) => {
      const date =
        model.uploadedAt instanceof Date
          ? model.uploadedAt
          : parseISO(model.uploadedAt);
      const monthYear = format(date, "MMMM yyyy");
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(model);
      return acc;
    },
    {} as Record<string, typeof filteredModels>
  );

  const sortedMonthYears = Object.keys(groupedModels).sort(
    (a, b) => parseISO(b).getTime() - parseISO(a).getTime()
  );

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
          Click here to browse available models and prices.
        </a>
        <div className="mt-4">
          <Combobox
            value={selectedModel}
            onChange={(value: string | null) => setSelectedModel(value || "")}
          >
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <ComboboxInput
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Search models or dates (September 2024)"
                onChange={(event) => setQuery(event.target.value)}
              />
              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredModels.length === 0 ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  sortedMonthYears.map((monthYear) => (
                    <div key={monthYear}>
                      <div className="sticky top-0 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900">
                        {monthYear}
                      </div>
                      {groupedModels[monthYear]?.map((model) => (
                        <Combobox.Option
                          key={model.id}
                          value={model.name}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-blue-600 text-white' : 'text-gray-900'
                            }`
                          }
                        >
                          {({ selected, active }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {model.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? 'text-white' : 'text-blue-600'
                                  }`}
                                >
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </div>
                  ))
                )}
              </ComboboxOptions>
            </div>
          </Combobox>
        </div>
      </section>
    </div>
  );
}
