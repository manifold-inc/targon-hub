"use client";

import { useState } from "react";
import Link from "next/link";
import { Combobox, ComboboxInput } from "@headlessui/react";
import { Search } from "lucide-react";

import ModelStatusIndicator from "@/app/_components/ModelStatusIndicator";
import { reactClient } from "@/trpc/react";

export default function ImmunityTimeline() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: models } = reactClient.model.getImmunityTimeline.useQuery();

  const filteredModels = models?.filter((model) => {
    if (searchQuery) {
      return model.name?.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  return (
    <div className="flex w-full justify-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(82,171,255,0.2),rgba(255,255,255,0))]" />
      </div>
      <div className="w-4/5 p-3 sm:p-8">
        <div className="inline-flex w-full animate-slide-in flex-wrap items-center justify-between p-3 sm:p-8">
          <div className="text-xl font-semibold leading-loose text-mf-ash-700 sm:text-2xl">
            Model Immunity Timeline
          </div>
          <div className="whitespace-nowrap text-xl font-semibold leading-loose text-mf-ash-300 sm:text-2xl">
            {models?.length} Live Models
          </div>
        </div>

        <div className="mb-8 animate-slide-in px-3 text-sm text-mf-ash-500 sm:px-8 sm:text-base">
          This timeline shows our currently active models and their immunity
          periods. Once a model&apos;s immunity period expires, it becomes
          eligible for replacement with a different model. During the immunity
          period, models are protected from being replaced.
        </div>

        <div className="flex animate-slide-in justify-center">
          <Combobox
            value={searchQuery}
            onChange={(value: string) => {
              setSearchQuery(value);
            }}
          >
            <div className="relative w-full max-w-xl">
              <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                <Search
                  aria-hidden="true"
                  className="h-5 w-5 text-mf-ash-500"
                />
              </div>
              <ComboboxInput
                className="text-md flex h-11 w-full items-center rounded-full border-0 bg-mf-milk-100 pb-2.5 pl-11 pr-8 pt-3 placeholder:text-mf-ash-500 focus:ring-mf-silver-700/30"
                placeholder="Search models"
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          </Combobox>
        </div>

        {/* Timeline */}
        <div className="relative animate-slide-in-delay pt-12">
          {/* Line - left on mobile, center on desktop */}
          <div className="absolute bottom-0 left-8 top-12 w-0.5 bg-mf-blue-300 sm:left-1/2 sm:-translate-x-1/2" />

          {filteredModels?.map((model, index) => (
            <div
              key={model.name}
              className={`relative mb-8 flex w-full justify-start ${
                index % 2 === 0 ? "sm:justify-end" : "sm:justify-start"
              }`}
            >
              <div
                className={`w-full pl-12 sm:w-5/12 ${
                  index % 2 === 0 ? "sm:pl-0 sm:pr-8" : "sm:pl-8"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 h-4 w-4 rounded-full border-2 border-blue-300 bg-mf-milk-300 sm:left-1/2 sm:-translate-x-1/2" />

                {/* Content card */}
                <Link
                  href={`/models/${encodeURIComponent(model.name ?? "")}`}
                  className="block rounded-lg border border-mf-silver-700 bg-mf-milk-300 p-3 shadow transition-shadow hover:shadow-md sm:p-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-sm font-semibold sm:text-lg">
                        {model.name}
                      </h3>
                      <div className="order-3 sm:order-none">
                        <ModelStatusIndicator
                          enabled={model.enabled ?? false}
                          showBorder={false}
                        />
                      </div>
                    </div>
                    <span className="order-2 block text-xs leading-tight text-mf-ash-500 sm:order-none sm:text-sm">
                      Immunity Period Ends:{" "}
                      {model.immunityEnds
                        ? new Date(model.immunityEnds).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
