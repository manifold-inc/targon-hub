"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import { ChevronRight } from "lucide-react";

import { reactClient } from "@/trpc/react";
import { AppCard } from "./_components/AppCard";
import SearchBar from "./_components/SearchBar";

export default function Page() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const models = reactClient.model.getModels.useQuery({ name: "" });

  const endpoints = models.data
    ? [
        "ALL",
        ...new Set(
          models.data
            .map((model) =>
              model.supportedEndpoints.map((endpoint) => endpoint),
            )
            .flat(),
        ),
      ]
    : ["ALL"];

  const filteredModels = models.data
    ? selectedIndex === 0
      ? models.data // Show all models when "All" is selected
      : models.data.filter((model) =>
          model.supportedEndpoints
            .map((e) => e.toLowerCase())
            .includes(endpoints[selectedIndex]!.toLowerCase()),
        )
    : [];

  return (
    <div className="relative pt-8">
      <div className="relative -top-20 h-4/5 overflow-hidden">
        <Image
          className="b absolute inset-0 h-full w-full animate-fade-in rounded-xl object-cover
        p-2"
          src="/gradientFigma.png"
          alt="background"
          width={1920}
          height={1080}
        />

        {/* Content with background */}
        <div className="relative flex h-full flex-col items-start justify-center gap-6 pb-12 pl-10 pr-10 pt-36 sm:pb-20 sm:pt-96">
          <div className="animation-delay-[0.5s] flex animate-slide-in flex-col items-start justify-between self-stretch sm:justify-start">
            <div className="leading-18 self-stretch text-3xl font-light text-[#1c3836] sm:text-6xl">
              Decentralized LLMs
            </div>
            <div className="leading-18 animate-slide-in self-stretch text-3xl font-light text-[#1c3836] delay-300 sm:text-6xl">
              at your fingertips
            </div>
          </div>
          <div className="animate-slide-in self-stretch leading-loose text-[#667085] delay-300">
            Cheaper, better, faster. Powered by Bittensor on subnet 4.
          </div>
          <div className="relative w-full max-w-80 pt-10 lg:hidden">
            <SearchBar />
          </div>
          <div className="flex w-full animate-slide-in flex-col items-center justify-start gap-6 pt-10 delay-700 sm:w-fit sm:flex-row lg:pt-20">
            <Link
              href="/models"
              className="group relative flex h-12 w-full items-center justify-center sm:w-44"
            >
              <div className="absolute box-border h-11 w-full rounded-full border-2 border-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:w-40" />
              <div className="box-border inline-flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-white group-hover:border-2">
                <span className="flex items-center gap-2 text-sm font-semibold leading-tight">
                  Browse Models
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </span>
              </div>
            </Link>
            <Link
              href="https://discord.gg/manifold"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#e4e7ec] bg-white px-3.5 py-2.5 text-[#344054] shadow-inner hover:border-[#d0d5dd]"
            >
              <span className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold leading-tight">
                Learn about SN4
                <Image
                  src="/DiscordIcon.svg"
                  alt="Discord"
                  width={20}
                  height={20}
                />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content without background */}
      <div className="-mt-10 px-4 sm:px-10">
        <div className="animate-slide-in-delay">
          <TabGroup>
            <TabList className="inline-flex w-full items-center justify-start gap-2 overflow-x-scroll rounded-full border border-[#e4e7ec] bg-white p-2">
              {endpoints.map((endpoint, index) => (
                <Tab
                  key={index}
                  className={`flex h-fit w-32 items-center justify-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold leading-tight ${
                    selectedIndex === index
                      ? "bg-[#f2f4f7] text-[#475467]"
                      : "text-[#475467] opacity-80 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  {endpoint}
                </Tab>
              ))}
            </TabList>
          </TabGroup>
        </div>

        <div className="animate-slide-in-delay py-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredModels.map((model) => (
              <AppCard
                key={model.id}
                name={model.name ?? ""}
                cpt={model.cpt}
                requiredGPUs={model.requiredGpus}
                modality={model.modality}
                enabled={model.enabled ?? false}
                supportedEndpoints={model.supportedEndpoints}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
