"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import { PlusIcon } from "lucide-react";

import { reactClient } from "@/trpc/react";
import { AppCard } from "./AppCard";

interface Model {
  id: number;
  name: string | null;
  requiredGpus: number;
  modality: "text-generation" | "text-to-image" | null;
  enabled: boolean | null;
  supportedEndpoints: string[];
  description: string | null;
  createdAt: Date;
  cpt: number;
}

export function ModelTabs() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const models = reactClient.model.getActiveModels.useQuery();

  const endpoints = models.data
    ? [
        "All",
        ...new Set(
          models.data
            .map((model) =>
              model.supportedEndpoints.map((endpoint) => endpoint),
            )
            .flat(),
        ),
      ]
    : ["All"];

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
    <div className="flex animate-slide-in-delay flex-col gap-8">
      <TabGroup>
        <TabList className="relative inline-flex h-10 w-full items-center justify-start gap-2 overflow-hidden overflow-x-scroll rounded-xl p-2 px-2">
          <div className="absolute inset-0 bg-gradient-to-tr from-mf-green-700/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-mf-silver-500" />
          <div className="relative z-10 flex w-full items-center gap-2">
            {endpoints.map((endpoint, index) => (
              <Tab
                key={index}
                className={`flex h-fit w-32 items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-semibold leading-tight focus:border-mf-milk-500 focus:outline-none  ${
                  selectedIndex === index
                    ? "bg-mf-milk-300"
                    : "hover:bg-mf-milk-100"
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                {endpoint.charAt(0).toUpperCase() +
                  endpoint.slice(1).toLowerCase()}
              </Tab>
            ))}
            <div className="ml-auto flex items-center">
              <Link
                href="/models/lease"
                className="inline-flex h-6 w-24 items-center gap-2 whitespace-nowrap rounded-lg bg-mf-blue-500 px-2 text-xs font-semibold text-black shadow-sm transition-all hover:opacity-80"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Model</span>
              </Link>
            </div>
          </div>
        </TabList>
      </TabGroup>

      <div className="relative mx-auto w-full overflow-hidden rounded-xl border border-mf-silver-700 bg-mf-milk-300">
        <div className="absolute inset-0 bg-gradient-to-tr from-mf-green-700/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-mf-milk-300" />

        <div className="relative h-96 overflow-auto sm:h-auto sm:overflow-visible">
          <div className="sticky top-0 z-10 flex items-center justify-between p-2 backdrop-blur-md sm:p-3">
            <div className="flex h-8 w-16 items-center gap-1.5 sm:w-20">
              <div className="h-2.5 w-2.5 rounded-full bg-mf-blue-700 sm:h-3 sm:w-3"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-mf-blue-500 sm:h-3 sm:w-3"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-mf-blue-300 sm:h-3 sm:w-3"></div>
            </div>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center">
                <Image
                  src="/TargonLogo.svg"
                  width={20}
                  height={20}
                  alt="Targon"
                  className="block"
                />
                <p className="px-2 text-2xl font-bold">TARGON</p>
              </div>
            </div>
            <div className="flex w-16 justify-end sm:w-20" />
          </div>

          <ModelGrid models={filteredModels} />
        </div>
      </div>
    </div>
  );
}

function ModelGrid({ models }: { models: Model[] }) {
  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {models.map((model) => (
          <AppCard
            key={model.id}
            name={model.name ?? ""}
            modality={model.modality}
            requiredGPUs={model.requiredGpus}
            enabled={model.enabled ?? false}
            supportedEndpoints={model.supportedEndpoints}
            description={model.description ?? ""}
            cpt={model.cpt}
          />
        ))}
      </div>
    </div>
  );
}
