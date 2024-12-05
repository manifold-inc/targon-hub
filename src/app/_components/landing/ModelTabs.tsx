"use client";

import { Tab, TabGroup, TabList } from "@headlessui/react";
import Link from "next/link";
import { useState } from "react";
import { AppCard } from "./AppCard";
import { reactClient } from "@/trpc/react";

interface Model {
  id: number;
  name: string | null;
  cpt: number;
  requiredGpus: number;
  modality: "text-generation" | "text-to-image";
  enabled: boolean | null;
  supportedEndpoints: string[];
  description: string | null;
  createdAt: Date;
}

export function ModelTabs() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const models = reactClient.model.getActiveModels.useQuery();

  const endpoints = models.data
    ? [
        "ALL",
        ...new Set(
          models.data
            .map((model) => model.supportedEndpoints.map((endpoint) => endpoint))
            .flat(),
        ),
      ]
    : ["ALL"];

  const filteredModels = models.data
    ? selectedIndex === 0
      ? models.data
      : models.data.filter((model) =>
          model.supportedEndpoints
            .map((e) => e.toLowerCase())
            .includes(endpoints[selectedIndex]!.toLowerCase()),
        )
    : [];

  return (
    <div className="animate-slide-in-delay flex flex-col gap-4">
      <TabGroup>
        <TabList className="relative inline-flex w-full items-center justify-start gap-1 overflow-hidden overflow-x-scroll rounded-full border border-[#e4e7ec] bg-white p-1 sm:gap-2 sm:p-2">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
          <div className="relative z-10 flex w-full items-center gap-1 sm:gap-2">
            {endpoints.map((endpoint, index) => (
              <Tab
                key={index}
                className={`flex h-fit w-24 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold leading-tight focus:outline-none focus:ring-2 focus:ring-[#142900]/20 focus:ring-offset-2 sm:w-32 sm:px-3 sm:py-2 sm:text-sm ${
                  selectedIndex === index
                    ? "bg-[#142900]/10 text-[#142900]"
                    : "text-[#475467] opacity-80 hover:bg-[#142900]/5"
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                {endpoint}
              </Tab>
            ))}
            <Link href="/playground" className="ml-auto">
              <Tab className="flex h-fit w-24 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-mf-green px-2 py-1 text-xs font-semibold leading-tight text-white transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#142900]/20 focus:ring-offset-2 sm:w-32 sm:px-3 sm:py-2 sm:text-sm">
                Try Now
              </Tab>
            </Link>
          </div>
        </TabList>
      </TabGroup>

      <div className="relative mx-auto w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />

        <div className="flex items-center gap-2 border-b border-gray-200 p-2 sm:p-3">
          <div className="flex w-16 gap-1.5 sm:w-20">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400 sm:h-3 sm:w-3"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 sm:h-3 sm:w-3"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-green-400 sm:h-3 sm:w-3"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="relative inline-block overflow-hidden rounded-full bg-white px-3 py-1 text-xs text-gray-600 sm:px-4 sm:text-sm">
              <span className="">targon.com</span>
            </span>
          </div>
          <div className="w-16 sm:w-20"></div>
        </div>

        <ModelGrid models={filteredModels} />
      </div>
    </div>
  );
}

function ModelGrid({ models }: { models: Model[] }) {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:max-h-[70vh] lg:overflow-y-auto">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {models.map((model) => (
          <AppCard
            key={model.id}
            name={model.name ?? ""}
            cpt={model.cpt}
            requiredGPUs={model.requiredGpus}
            modality={model.modality}
            enabled={model.enabled ?? false}
            supportedEndpoints={model.supportedEndpoints}
            description={model.description ?? ""}
          />
        ))}
      </div>
    </div>
  );
} 