"use client";

import { useEffect, useRef, useState } from "react";
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
        setIsVisible(entry?.isIntersecting ?? false);
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      },
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-[#fafafa] pt-8">
      <div className="relative -top-20 h-4/5 overflow-hidden">
        <div className="dot-pattern absolute inset-0" />

        {/* Content with background */}
        <div className="relative flex h-full flex-col items-start justify-center gap-6 px-4 pb-6 pt-20 sm:px-10 sm:pb-10 sm:pt-40 lg:flex-row">
          {/* Left Column - Glass morphic elements */}
          <div className="flex w-full flex-col gap-6 lg:w-1/2">
            <div
              className="group relative flex animate-slide-in flex-col 
              items-center gap-4 overflow-hidden rounded-lg border border-gray-300 bg-gray-200
              p-4 shadow-lg backdrop-blur-sm transition-all duration-300 
              hover:border-mf-green/50 hover:shadow-xl sm:p-8"
            >
              <div className="relative z-10">
                {/* First row */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-center text-2xl font-light text-mf-green sm:gap-4 sm:text-4xl">
                  <span className="font-semibold text-mf-green">The</span>
                  <span className="font-semibold text-mf-green">
                    Decentralized
                  </span>
                  <span className="font-semibold text-mf-green">AI</span>
                  <span className="font-semibold text-mf-green">Cloud</span>
                </div>
                {/* Second row */}
                <div className="flex items-center justify-center gap-2 p-2 sm:gap-4">
                  <p className="text-center text-gray-600">
                    Run inference on AI Models lightning fast at low cost
                  </p>
                </div>
              </div>
            </div>

            {/* Stats cards */}
            <div className="flex w-full animate-slide-in flex-col items-center">
              <div className="flex w-full flex-col items-center">
                <div className="grid w-full grid-cols-1 gap-4 p-4 text-center font-mono sm:grid-cols-2">
                  {/* First stat card */}
                  <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-gray-200 p-4 shadow-lg backdrop-blur-sm sm:p-8">
                    <div className="relative z-10 flex h-full flex-col items-center text-center font-light">
                      <p className="text-mf-green">Greater Than</p>
                      <div className="relative inline-flex items-start justify-center">
                        <p className="text-5xl text-mf-green">400</p>
                      </div>
                      <p className="text-mf-green">Tokens/s</p>
                      <p className="text-sm text-mf-green">Llama 3.1 8b</p>
                    </div>
                  </div>

                  {/* Second stat card */}
                  <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-gray-200 p-4 shadow-lg backdrop-blur-sm sm:p-8">
                    <div className="relative z-10 flex h-full flex-col items-center text-center font-light">
                      <p className="text-mf-green">Currently</p>
                      <div className="relative inline-flex items-start justify-center">
                        <p className="text-5xl text-mf-green">$0.04</p>
                        <sup className="absolute -right-3 top-0 text-mf-green">
                          *
                        </sup>
                      </div>
                      <p className="text-mf-green">/M Tokens</p>
                      <p className="text-sm text-mf-green">* currently</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full pt-6 lg:hidden">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Content without background */}
      <div className="-mt-10 px-4 sm:px-10">
        <div className="animate-slide-in-delay">
          <div className="mx-auto flex flex-col items-center justify-center gap-6 pb-8 text-center">
            <h1 className="whitespace-no-wrap text-4xl font-semibold leading-tight text-mf-green sm:text-5xl">
              Permissionlessly Unlock Affordable AI Inference
            </h1>
            <p className="max-w-2xl text-base text-mf-green sm:text-lg">
              Experience the power of AI without the limits. As the{" "}
              <span className="animate-pulse font-semibold">
                only place on Bittensor
              </span>{" "}
              offering model leasing, we make decentralized, affordable AI truly
              accessible.
            </p>
          </div>
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
                <div className="ml-auto">
                  <Tab className="flex h-fit w-24 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-mf-green px-2 py-1 text-xs font-semibold leading-tight text-white transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#142900]/20 focus:ring-offset-2 sm:w-32 sm:px-3 sm:py-2 sm:text-sm">
                    <Link href="/playground">Try Now</Link>
                  </Tab>
                </div>
              </div>
            </TabList>
          </TabGroup>
        </div>

        <div className="animate-slide-in-delay py-4">
          {/* Browser chrome wrapper */}
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
            {/* Add the same gradients */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />

            {/* Make content relative to show above gradient */}
            <div className="relative z-10">
              {/* Browser chrome header */}
              <div className="flex items-center gap-2 border-b border-gray-200 p-2">
                <div className="flex w-20 gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="relative inline-block overflow-hidden rounded-full bg-white px-4 py-1 text-sm text-gray-600">
                    <span className="">targon.com</span>
                  </span>
                </div>
                <div className="w-20"></div>
              </div>

              {/* Content area */}
              <div className="p-4 lg:max-h-[70vh] lg:overflow-y-auto">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              {"Generative AI you can rely on".split("").map((char, index) => (
                <span
                  key={index}
                  className={`inline-block pb-8 text-3xl font-light text-mf-green sm:pb-16 sm:text-6xl ${
                    isVisible ? "animate-slide-in" : "opacity-0"
                  }`}
                  style={{
                    animationDelay: isVisible ? `${index * 0.025}s` : undefined,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
            <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-4 px-4 sm:gap-8 sm:px-8 md:grid-cols-3">
              <div
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm 
                transition-all duration-300 hover:shadow-lg sm:p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
                <div className="relative z-10 p-2 sm:p-4">
                  <h3 className="pb-4 text-2xl font-light text-gray-900 sm:pb-8 sm:text-4xl">
                    Fast
                  </h3>
                  <div className="flex items-baseline gap-2 pb-2 text-[#142900] group-hover:animate-pulse group-hover:text-mf-green sm:gap-4 sm:pb-4">
                    <span className="text-4xl font-light transition-colors sm:text-6xl">
                      4
                    </span>
                    <span className="text-xl font-light transition-colors sm:text-3xl">
                      x
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 sm:text-base">
                    Speed relative to competitors on the market.
                  </p>
                </div>
              </div>

              <div
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm 
                transition-all duration-300 hover:shadow-lg sm:p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
                <div className="relative z-10 p-2 sm:p-4">
                  <h3 className="pb-4 text-2xl font-light text-gray-900 sm:pb-8 sm:text-4xl">
                    Precise
                  </h3>
                  <div className="flex items-baseline gap-2 pb-2 text-[#142900] group-hover:animate-pulse group-hover:text-mf-green sm:gap-4 sm:pb-4">
                    <span className="text-4xl font-light transition-colors sm:text-6xl">
                      400
                    </span>
                    <span className="text-xl font-light transition-colors sm:text-3xl">
                      TOKENS/SEC
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 sm:text-base">
                    Higher throughput than competitors on the market.
                  </p>
                </div>
              </div>

              <div
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm 
                transition-all duration-300 hover:shadow-lg sm:p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#142900]/5 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent" />
                <div className="relative z-10 p-2 sm:p-4">
                  <h3 className="pb-4 text-2xl font-light text-gray-900 sm:pb-8 sm:text-4xl">
                    Cost-Efficient
                  </h3>
                  <div className="flex items-baseline gap-2 pb-2 text-[#142900] group-hover:animate-pulse group-hover:text-mf-green sm:gap-4 sm:pb-4">
                    <span className="text-4xl font-light transition-colors sm:text-6xl">
                      ∞
                    </span>
                    <span className="text-xl font-light transition-colors sm:text-3xl">
                      x
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 sm:text-base">
                    Lower cost than GPT-4 when using Llama-3 70b.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trusted By Section */}
          <div className="">
            <div className="flex flex-col gap-4 pb-4 text-center">
              <p className="text-center text-2xl text-gray-600 sm:text-4xl">
                Trusted By
              </p>
              <p className="text-center text-gray-600">
                Leading companies building on Targon
              </p>
            </div>

            {/* Logo slider */}
            <div className="relative w-full overflow-hidden py-10">
              {/* Gradient masks for smooth fade effect */}
              <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent" />
              <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent" />

              {/* Scrolling track */}
              <div className="flex animate-scroll-horizontal">
                {[1, 2, 3, 4].map((set) => (
                  <div
                    key={set}
                    className="flex shrink-0 items-center gap-16 px-8"
                  >
                    {[
                      { src: "/companies/Dippy.svg", alt: "Dippy" },
                      { src: "/companies/sybil.png", alt: "Sybil" },
                      { src: "/companies/taobot.png", alt: "Taobot" },
                    ].map((logo, i) => (
                      <div
                        key={`${set}-${i}`}
                        className="group flex h-24 w-60 items-center justify-center rounded-lg 
                                 border border-gray-200 bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-md"
                      >
                        <div className="relative h-full w-full">
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            fill
                            className="object-contain opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
