"use client";

import { useState, useEffect, useRef } from "react";
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

  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1 // Trigger when 10% of the element is visible
      }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
              rounded-lg bg-white relative overflow-hidden border border-gray-200 
              shadow-sm transition-shadow p-4 sm:p-8">
              {/* Add gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/20 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/20 via-transparent to-transparent" />
              
              {/* Content wrapper with relative positioning */}
              <div className="relative z-10">
                {/* First row */}
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 font-light text-2xl sm:text-4xl text-gray-900 text-center">
                  <span className="text-[#142900]">The</span>
                  <span className="text-[#142900]">Fastest</span>
                  <span className="text-[#142900]">Decentralized</span>
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
                  <span className="text-4xl sm:text-7xl font-bold text-[#142900]">Inference</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full pt-6 lg:hidden">
            <SearchBar />
          </div>

          <div className="flex w-full animate-slide-in flex-col items-center justify-center gap-4 sm:gap-20 pt-4 delay-700 sm:flex-row lg:pt-8">
            <Link
              href="/browse"
              className="w-full sm:w-auto text-center rounded-xl bg-white relative overflow-hidden
                px-6 py-3 border border-gray-200 shadow-sm hover:shadow-lg
                transition-all text-gray-900 hover:text-[#142900]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/20 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/20 via-transparent to-transparent" />
              <span className="relative z-10">Visit our App →</span>
            </Link>
            <Link
              href="/playground"
              className="w-full sm:w-auto text-center rounded-xl bg-white relative overflow-hidden
                px-6 py-3 border border-gray-200 shadow-sm hover:shadow-lg
                transition-all text-gray-900 hover:text-[#142900]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/20 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/20 via-transparent to-transparent" />
              <span className="relative z-10">Play With Targon →</span>
            </Link>
          </div>

          <div className="animate-slide-in flex flex-col items-center w-full">
            <div className="flex flex-col items-center w-full">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-20 p-4 text-center font-mono max-w-xl">
                {/* First stat card */}
                <div className="flex flex-col p-4 sm:p-8 rounded-lg bg-white relative overflow-hidden border border-gray-200 shadow-sm transition-shadow">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/20 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/20 via-transparent to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full items-center text-center">
                    <p className="text-gray-900">Greater Than</p>
                    <div className="relative inline-flex items-start justify-center">
                      <p className="text-5xl font-semibold text-[#142900]">400</p>
                    </div>
                    <p className="text-gray-900">Tokens/s</p>
                    <p className="text-sm text-gray-700">Llama 3.1 8b</p>
                    <Link 
                      href="https://manifold.inc/" 
                      className="mt-auto p-4 text-center text-gray-900 hover:opacity-60 transition-colors"
                    >
                      Manifold Labs
                    </Link>
                  </div>
                </div>

                {/* Second stat card */}
                <div className="flex flex-col p-4 sm:p-8 rounded-lg bg-white relative overflow-hidden border border-gray-200 shadow-sm transition-shadow">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/20 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/20 via-transparent to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full items-center text-center">
                    <p className="text-gray-900">Less Than</p>
                    <div className="relative inline-flex items-start justify-center">
                      <p className="text-5xl font-semibold text-[#142900]">$0.00</p>
                      <sup className="absolute -right-3 top-0 text-gray-900">*</sup>
                    </div>
                    <p className="text-gray-900">/M Tokens</p>
                    <p className="text-sm text-gray-700">* currently</p>
                    <Link 
                      href="https://bittensor.com/" 
                      className="mt-auto p-4 text-center text-gray-900 hover:opacity-60 transition-colors"
                    >
                      bittensor
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Links Section - Now separate and below */}
              <div className="flex justify-center gap-4 w-full max-w-xl pt-4 sm:hidden">
                <Link 
                  href="https://manifold.inc/" 
                  className="p-4 text-center rounded-lg bg-white relative overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/20 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/20 via-transparent to-transparent" />
                  <span className="relative z-10 text-gray-900 hover:text-[#142900]">Manifold Labs</span>
                </Link>
                <Link 
                  href="https://bittensor.com/" 
                  className="p-4 text-center rounded-lg bg-white relative overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/20 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/20 via-transparent to-transparent" />
                  <span className="relative z-10 text-gray-900 hover:text-[#142900]">bittensor</span>
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
            <h1 className="text-mf-green text-4xl sm:text-5xl font-semibold leading-tight whitespace-no-wrap">
              Permissionlessly Unlock Affordable AI Inference
            </h1>
            <p className="text-mf-green text-base sm:text-lg max-w-2xl">
              Experience the power of AI without the limits. As the <span className="font-semibold animate-pulse">only place on Bittensor</span> offering model leasing, we make decentralized, affordable AI truly accessible.
            </p>
          </div>
            <TabGroup>
              <TabList className="inline-flex w-full items-center justify-start gap-1 sm:gap-2 overflow-x-scroll rounded-full border border-[#e4e7ec] bg-white p-1 sm:p-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
                <div className="relative z-10 flex w-full items-center gap-1 sm:gap-2">
                  {endpoints.map((endpoint, index) => (
                    <Tab
                      key={index}
                      className={`flex h-fit w-24 sm:w-32 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-semibold leading-tight focus:outline-none focus:ring-2 focus:ring-[#142900]/20 focus:ring-offset-2 ${selectedIndex === index
                          ? "bg-[#142900]/10 text-[#142900]"
                          : "text-[#475467] opacity-80 hover:bg-[#142900]/5"
                        }`}
                      onClick={() => setSelectedIndex(index)}
                    >
                      {endpoint}
                    </Tab>
                  ))}
                  <div className="ml-auto">
                    <Tab
                      className="flex h-fit w-24 sm:w-32 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-semibold leading-tight focus:outline-none focus:ring-2 focus:ring-[#142900]/20 focus:ring-offset-2 bg-mf-green text-white hover:opacity-80 transition-colors"
                    >
                      <Link href="/playground">
                        Try Now
                      </Link>
                    </Tab>
                  </div>
                </div>
              </TabList>
            </TabGroup>
        </div>

        <div className="animate-slide-in-delay py-4">
          {/* Browser chrome wrapper */}
          <div className="w-full rounded-xl border border-gray-200 bg-white relative overflow-hidden">
            {/* Add the same gradients */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
            
            {/* Make content relative to show above gradient */}
            <div className="relative z-10">
              {/* Browser chrome header */}
              <div className="flex items-center gap-2 border-b border-gray-200 p-2">
                <div className="flex gap-1.5 w-20">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="px-4 py-1 text-sm text-gray-600 bg-white relative overflow-hidden rounded-full inline-block">
                    <span className="">targon.com</span>
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
          
                 {/* Metrics Section */}
            <div className="py-8 sm:py-16">
              <div ref={textRef} className="text-center">
                {"Generative AI at its best.".split('').map((char, index) => (
                  <span
                    key={index}
                    className={`text-3xl sm:text-6xl font-light sm:pb-16 pb-8 text-mf-green inline-block ${
                      isVisible ? 'animate-slide-in' : 'opacity-0'
                    }`}
                    style={{
                      animationDelay: isVisible ? `${index * 0.05}s` : undefined
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 px-4 sm:px-8 max-w-screen-xl mx-auto">
              <div className="p-4 sm:p-8 rounded-lg bg-white relative overflow-hidden border border-gray-200 shadow-sm transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
                <div className="relative z-10 p-2 sm:p-4">
                  <h3 className="text-2xl sm:text-4xl font-light pb-4 sm:pb-8 text-gray-900">Fast</h3>
                  <div className="flex items-baseline gap-2 sm:gap-4 pb-2 sm:pb-4 text-[#142900] animate-pulse">
                    <span className="text-4xl sm:text-6xl font-light">400</span>
                    <span className="text-xl sm:text-3xl font-light">x</span>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Faster than other alternatives on the market today.</p>
                </div>
              </div>

              <div className="p-4 sm:p-8 rounded-lg bg-white relative overflow-hidden border border-gray-200 shadow-sm transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
                <div className="relative z-10 p-2 sm:p-4">
                  <h3 className="text-2xl sm:text-4xl font-light pb-4 sm:pb-8 text-gray-900">Cost-Efficient</h3>
                  <div className="flex items-baseline gap-2 sm:gap-4 pb-2 sm:pb-4 text-[#142900] animate-pulse">
                    <span className="text-4xl sm:text-6xl font-light">∞</span>
                    <span className="text-xl sm:text-3xl font-light">x</span>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Lower cost than GPT-4 when using Llama-3 70b.</p>
                </div>
              </div>

              <div className="p-4 sm:p-8 rounded-lg bg-white relative overflow-hidden border border-gray-200 shadow-sm transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
                <div className="relative z-10 p-2 sm:p-4">
                  <h3 className="text-2xl sm:text-4xl font-light pb-4 sm:pb-8 text-gray-900">Scalable</h3>
                  <div className="flex items-baseline gap-2 sm:gap-4 pb-2 sm:pb-4 text-[#142900] animate-pulse">
                    <span className="text-4xl sm:text-6xl font-light">100</span>
                    <span className="text-xl sm:text-3xl font-light">%</span>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Obsessed over system optimization and scaling.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
