"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tab, TabGroup, TabList } from "@headlessui/react";

import { reactClient } from "@/trpc/react";
import { AppCard } from "./_components/AppCard";
import SearchBar from "./_components/SearchBar";

export default function Page() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const models = reactClient.model.getActiveModels.useQuery();

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
          className="absolute inset-0 h-full w-full animate-fade-in rounded-xl object-cover
        p-2"
          src="/gradientFigma.png"
          alt="background"
          width={1920}
          height={1080}
        />

        {/* Content with background */}
        <div className="relative flex h-full flex-col items-start justify-center gap-6 pb-6 px-4 sm:px-10 pt-20 sm:pb-10 sm:pt-60">
          <div className="flex flex-col items-center w-full gap-4">
            <div className="animate-slide-in flex flex-col items-center gap-4 
              backdrop-blur-2xl
              bg-gradient-to-br from-gray-900/20 to-gray-900/10
              rounded-2xl
              p-4 sm:p-8 
              shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
              border border-white/30 transition-colors">
              {/* First row */}
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 font-light text-2xl sm:text-4xl text-white text-center">
                <span className="text-stroke-mf-green drop-shadow-sm">The</span>
                <span className="text-stroke-mf-green drop-shadow-sm">Fastest</span>
                <span className="text-stroke-mf-green drop-shadow-sm">Decentralized</span>
              </div>
              {/* Second row */}
              <div className="flex items-center gap-2 sm:gap-4">
                <Image
                  src="/ManfioldMarkTransparentWhiteGreenSVG.svg"
                  alt="Targon"
                  width={80}
                  height={80}
                  className="drop-shadow-lg sm:w-[104px] sm:h-[104px]"
                />
                <span className="text-4xl sm:text-7xl font-bold text-white text-stroke-mf-green drop-shadow-lg">Inference</span>
              </div>
            </div>
          </div>

          <div className="relative w-full pt-6 lg:hidden">
            <SearchBar />
          </div>

          <div className="flex w-full animate-slide-in flex-col items-center justify-center gap-4 sm:gap-20 pt-4 delay-700 sm:flex-row lg:pt-8">
            <Link
              href="/browse"
              className="w-full sm:w-auto text-center rounded-xl backdrop-blur-2xl bg-gradient-to-br from-gray-900/20 to-gray-900/10 
                px-6 py-3 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/30 
                transition-all hover:bg-gray-900/30 text-white"
            >
              Visit our App →
            </Link>
            <Link
              href="/playground"
              className="w-full sm:w-auto text-center rounded-xl backdrop-blur-2xl bg-gradient-to-br from-gray-900/20 to-gray-900/10 
                px-6 py-3 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/30 
                transition-all hover:bg-gray-900/30 text-white"
            >
              Play With Targon →
            </Link>
          </div>

          <div className="animate-slide-in flex flex-col items-center w-full">
            <div className="flex flex-col items-center w-full">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-20 p-4 text-center font-mono max-w-xl">
                <div className="flex flex-col">
                  <div>
                    <p className="text-gray-900">Greater Than</p>
                    <div className="relative inline-flex items-start">
                      <p className="text-5xl font-semibold text-white text-stroke-mf-green drop-shadow-sm">400</p>
                    </div>
                    <p className="text-gray-900">Tokens/s</p>
                    <p className="text-sm text-gray-700">Llama 3.1 8b</p>
                  </div>
                  <Link 
                    href="https://manifold.inc/" 
                    className="hidden sm:block mt-auto p-4 text-center text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    Manifold Labs
                  </Link>
                </div>
                <div className="flex flex-col">
                  <div>
                    <p className="text-gray-900">Less Than</p>
                    <div className="relative inline-flex items-start">
                      <p className="text-5xl font-semibold text-white text-stroke-mf-green drop-shadow-sm">$0.00</p>
                      <sup className="absolute -right-3 top-0 text-gray-900">*</sup>
                    </div>
                    <p className="text-gray-900">/M Tokens</p>
                    <p className="text-sm text-gray-700">* currently</p>
                  </div>
                  <Link 
                    href="https://bittensor.com/" 
                    className="hidden sm:block mt-auto p-4 text-center text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    bittensor
                  </Link>
                </div>
              </div>
              
              {/* Links Section - Now separate and below */}
              <div className="flex justify-center gap-4 w-full max-w-xl pt-4 sm:hidden">
                <Link 
                  href="https://manifold.inc/" 
                  className="p-4 text-center text-gray-900 hover:text-gray-700 transition-colors"
                >
                  Manifold Labs
                </Link>
                <Link 
                  href="https://bittensor.com/" 
                  className="p-4 text-center text-gray-900 hover:text-gray-700 transition-colors"
                >
                  bittensor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content without background */}
      <div className="-mt-10 px-4 sm:px-10">
        <div className="animate-slide-in-delay">
          <div className="flex flex-col items-center justify-center pb-8 gap-6 text-center mx-auto">
            <h1 className="text-gray-900 text-4xl sm:text-5xl font-semibold leading-tight whitespace-no-wrap">
              Permissionlessly Unlock Affordable AI Inference
            </h1>
            <p className="text-gray-700 text-base sm:text-lg max-w-2xl">
              Experience the power of AI without the limits. As the only place on Bittensor offering model leasing, we make decentralized, affordable AI truly accessible.
            </p>
          </div>
            <TabGroup>
              <TabList className="inline-flex w-full items-center justify-start gap-1 sm:gap-2 overflow-x-scroll rounded-full border border-[#e4e7ec] bg-white p-1 sm:p-2">
              {endpoints.map((endpoint, index) => (
                <Tab
                  key={index}
                  className={`flex h-fit w-24 sm:w-32 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-semibold leading-tight ${selectedIndex === index
                      ? "bg-[#f2f4f7] text-[#475467]"
                      : "text-[#475467] opacity-80 hover:bg-gray-100"
                    }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  {endpoint}
                </Tab>
              ))}
              <div className="ml-auto">
                <Tab
                  className="flex h-fit w-24 sm:w-32 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-blue-500 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-semibold leading-tight text-white hover:bg-blue-600"
                >
                  <Link href="/playground">
                    Try Now
                  </Link>
                </Tab>
              </div>
            </TabList>
          </TabGroup>
        </div>

        <div className="animate-slide-in-delay py-4">
          {/* Browser chrome wrapper */}
          <div className="w-full rounded-xl border border-gray-200 bg-white overflow-hidden">
            {/* Browser chrome header */}
            <div className="flex items-center gap-2 border-b border-gray-200 p-2">
              <div className="flex gap-1.5 w-20">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="px-4 py-1 text-sm text-gray-600 bg-gray-100 rounded-full">
                  targon.com
                </span>
              </div>
              <div className="w-20"></div>
            </div>
            
            {/* Content area */}
            <div className="p-4 lg:max-h-[70vh] lg:overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredModels.map((model) => (
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
          </div>
        </div>

      </div>
    </div>
  );
}
