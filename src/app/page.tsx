"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
        setIsVisible(entry?.isIntersecting ?? false);
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
    <div className="relative pt-8 bg-[#fafafa]">
      <div className="relative -top-20 h-4/5 overflow-hidden">
        <div className="absolute inset-0 dot-pattern" />

        {/* Content with background */}
        <div className="relative flex h-full flex-col lg:flex-row items-start justify-center gap-6 pb-6 px-4 sm:px-10 pt-20 sm:pb-10 sm:pt-40">
          {/* Left Column - Glass morphic elements */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="animate-slide-in flex flex-col items-center gap-4 
              rounded-lg relative overflow-hidden bg-gray-200 border border-gray-300 backdrop-blur-sm
              shadow-lg p-4 sm:p-8 transition-all duration-300 
              hover:shadow-xl hover:border-mf-green/50 group">
              <div className="relative z-10">
                {/* First row */}
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 font-light text-2xl sm:text-4xl text-white text-center">
                  <span className="text-stroke-mf-green">The</span>
                  <span className="text-mf-green opacity-60 group-hover:opacity-100 transition-opacity duration-300">Fastest</span>
                  <span className="text-stroke-mf-green">Decentralized</span>
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
                  <span className="text-4xl sm:text-7xl font-bold text-white text-stroke-mf-green">Inference</span>
                </div>
              </div>
            </div>

            {/* Stats cards */}
            <div className="animate-slide-in flex flex-col items-center w-full">
              <div className="flex flex-col items-center w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 text-center font-mono w-full">
                  {/* First stat card */}
                  <div className="flex flex-col p-4 sm:p-8 rounded-lg relative overflow-hidden border border-gray-300 shadow-lg backdrop-blur-sm bg-gray-200">
                    <div className="relative z-10 flex flex-col h-full items-center text-center">
                      <p className="text-mf-green">Greater Than</p>
                      <div className="relative inline-flex items-start justify-center">
                        <p className="text-5xl font-semibold text-mf-green">400</p>
                      </div>
                      <p className="text-mf-green">Tokens/s</p>
                      <p className="text-sm text-mf-green">Llama 3.1 8b</p>
                      <Link 
                        href="https://manifold.inc/" 
                        className="mt-auto p-4 text-center text-mf-green hover:opacity-60 transition-colors"
                      >
                        Manifold Labs
                      </Link>
                    </div>
                  </div>

                  {/* Second stat card */}
                  <div className="flex flex-col p-4 sm:p-8 rounded-lg relative overflow-hidden border border-gray-300 shadow-lg backdrop-blur-sm bg-gray-200">
                    <div className="relative z-10 flex flex-col h-full items-center text-center">
                      <p className="text-mf-green">Less Than</p>
                      <div className="relative inline-flex items-start justify-center">
                        <p className="text-5xl font-semibold text-mf-green">$0.00</p>
                        <sup className="absolute -right-3 top-0 text-mf-green">*</sup>
                      </div>
                      <p className="text-mf-green">/M Tokens</p>
                      <p className="text-sm text-mf-green">* currently</p>
                      <Link 
                        href="https://bittensor.com/" 
                        className="mt-auto p-4 text-center text-mf-green hover:opacity-60 transition-colors"
                      >
                        bittensor
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Particle Collider simulation */}
          <div className="hidden lg:block lg:w-1/2 relative h-full">
            <div className="absolute inset-0 flex items-start pt-20">
              {/* Fast-moving particles with trails */}
              <div className="absolute right-0 top-32 w-2 h-2 bg-mf-green/80 rounded-full animate-particle-1">
                <div className="absolute right-0 w-12 h-full bg-gradient-to-r from-mf-green/50 to-transparent"></div>
              </div>
              <div className="absolute right-0 top-40 w-2 h-2 bg-mf-green/80 rounded-full animate-particle-2">
                <div className="absolute right-0 w-16 h-full bg-gradient-to-r from-mf-green/40 to-transparent"></div>
              </div>
              <div className="absolute right-0 top-48 w-2 h-2 bg-mf-green/80 rounded-full animate-particle-3">
                <div className="absolute right-0 w-20 h-full bg-gradient-to-r from-mf-green/30 to-transparent"></div>
              </div>
              
              {/* Collision point particles */}
              <div className="absolute right-1/2 top-40 w-1 h-1 bg-mf-green/40 rounded-full animate-pulse"></div>
              <div className="absolute right-1/2 top-40 w-3 h-3 bg-mf-green/20 rounded-full animate-ping"></div>
              
              {/* Background beam lines */}
              <div className="absolute inset-x-0 top-32 h-[1px] bg-gradient-to-r from-transparent via-mf-green/10 to-transparent"></div>
              <div className="absolute inset-x-0 top-40 h-[1px] bg-gradient-to-r from-transparent via-mf-green/10 to-transparent"></div>
              <div className="absolute inset-x-0 top-48 h-[1px] bg-gradient-to-r from-transparent via-mf-green/10 to-transparent"></div>
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
              <div className="group p-4 sm:p-8 rounded-lg bg-white relative overflow-hidden border border-gray-200 
                shadow-sm transition-all duration-300 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
                <div className="relative z-10 p-2 sm:p-4">
                  <h3 className="text-2xl sm:text-4xl font-light pb-4 sm:pb-8 text-gray-900">Fast</h3>
                  <div className="flex items-baseline gap-2 sm:gap-4 pb-2 sm:pb-4 text-[#142900] group-hover:text-mf-green group-hover:animate-pulse">
                    <span className="text-4xl sm:text-6xl font-light transition-colors">400</span>
                    <span className="text-xl sm:text-3xl font-light transition-colors">x</span>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Faster than other alternatives on the market today.</p>
                </div>
              </div>

              <div className="group p-4 sm:p-8 rounded-lg bg-white relative overflow-hidden border border-gray-200 
                shadow-sm transition-all duration-300 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
                <div className="relative z-10 p-2 sm:p-4">
                  <h3 className="text-2xl sm:text-4xl font-light pb-4 sm:pb-8 text-gray-900">Cost-Efficient</h3>
                  <div className="flex items-baseline gap-2 sm:gap-4 pb-2 sm:pb-4 text-[#142900] group-hover:text-mf-green group-hover:animate-pulse">
                    <span className="text-4xl sm:text-6xl font-light transition-colors">∞</span>
                    <span className="text-xl sm:text-3xl font-light transition-colors">x</span>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Lower cost than GPT-4 when using Llama-3 70b.</p>
                </div>
              </div>

              <div className="group p-4 sm:p-8 rounded-lg bg-white relative overflow-hidden border border-gray-200 
                shadow-sm transition-all duration-300 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
                <div className="relative z-10 p-2 sm:p-4">
                  <h3 className="text-2xl sm:text-4xl font-light pb-4 sm:pb-8 text-gray-900">Scalable</h3>
                  <div className="flex items-baseline gap-2 sm:gap-4 pb-2 sm:pb-4 text-[#142900] group-hover:text-mf-green group-hover:animate-pulse">
                    <span className="text-4xl sm:text-6xl font-light transition-colors">100</span>
                    <span className="text-xl sm:text-3xl font-light transition-colors">%</span>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Obsessed over system optimization and scaling.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add back the SearchBar section */}
      <div className="relative w-full pt-6 lg:hidden">
        <SearchBar />
      </div>
    </div>
  );
}
