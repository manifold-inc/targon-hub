"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChefHat, ChevronUp } from "lucide-react";

import { reactClient } from "@/trpc/react";
import {
  generateFakeStats,
  getTrendingModels,
  generateFakeAppShowcase,
  type ModelStats,
  type AppShowcaseStats,
} from "@/utils/utils";
import { useAuth } from "./_components/providers";
import Image from "next/image";

export default function Page() {
  const auth = useAuth();
  const models = reactClient.model.getModels.useQuery();

  // Extract unique categories from the models query
  const categories = [
    "All",
    ...new Set(models.data?.map((model) => model.category) ?? []),
  ];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [stats, setStats] = useState<ModelStats[]>([]);
  const [filteredStats, setFilteredStats] = useState<ModelStats[]>([]);

  useEffect(() => {
    // Generate fake stats for demonstration
    const fakeModels = models.data ?? [];
    const fakeStats = generateFakeStats(fakeModels);
    setStats(fakeStats);
  }, [models.data]);

  useEffect(() => {
    // Filter stats based on selected category
    const filtered =
      selectedCategory === "All"
        ? stats
        : stats.filter((model) => model.category === selectedCategory);
    setFilteredStats(filtered);
  }, [selectedCategory, stats]);

  const trendingModels = getTrendingModels(filteredStats, 3);

  const [showcaseStats, setShowcaseStats] = useState<AppShowcaseStats | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const fakeShowcase = generateFakeAppShowcase();
    setShowcaseStats(fakeShowcase);
  }, []);

  const selectedApps = showcaseStats ? showcaseStats[selectedPeriod] : [];

  return (
    <div>
      <div className="relative isolate pt-6 lg:pt-8">
        <div className="mx-auto max-w-2xl pt-16 pb-8 sm:pt-24 lg:pt-28">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-manifold-green dark:text-gray-50 sm:text-6xl">
              Decentralized LLMs at your fingertips
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-white">
              Powered by the bittensor ecosystem on subnet 4.
              <Link
                href="models"
                className="ml-1 font-semibold text-manifold-green underline decoration-2 underline-offset-2 transition-colors duration-200 hover:text-manifold-green/80 dark:text-manifold-pink dark:hover:text-gray-300"
              >
                Cheaper, better, faster.
              </Link>
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={auth.status === "AUTHED" ? "/models" : "/sign-in"}
                className="flex items-center justify-center  rounded-md bg-manifold-green px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-gray-700"
              >
                <span className="flex items-center gap-2 dark:text-manifold-pink">
                  Get started
                  <ChefHat className="dark:text-manifold-pink" />
                </span>
              </Link>
              <Link
                href="https://discord.gg/manifold"
                className="text-sm font-semibold leading-6 text-manifold-green dark:text-white"
              >
                Learn more about SN4<span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 p-10">
              ~{" "}
              <Link
                href="/rankings"
                className="mr-4 font-semibold text-manifold-green hover:text-gray-500 dark:text-manifold-pink"
              >
                Trending Models
              </Link>
              <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                <div className="relative">
                  <ListboxButton className="relative w-40 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md hover:bg-gray-50 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-gray-700 dark:text-manifold-pink dark:ring-gray-600 dark:hover:bg-gray-600 sm:text-sm">
                    <span className="block">{selectedCategory}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUp
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>
                  <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-40 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 dark:text-manifold-pink dark:ring-gray-600 sm:text-sm">
                    {categories.map((category) => (
                      <ListboxOption
                        key={category}
                        value={category}
                        className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {category}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>{" "}
              ~
            </div>
            <dl className={`mx-auto flex items-center justify-center ${trendingModels.length === 2 ? 'gap-8' : 'gap-2'}`}>
              {trendingModels.map((model) => (
                <div
                  key={model.modelId}
                  className="flex flex-col gap-y-3 border-x border-gray-200 dark:border-white/10 text-manifold-green dark:text-manifold-pink p-6 w-48 h-40"
                >
                  <Link href={`/models/${model.modelName}`} className="text-sm leading-6 truncate hover:underline">{model.modelName}</Link>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-manifold-green dark:text-manifold-pink">
                    {model.trendScore.toFixed(2)}
                  </dd>
                  <dd className="text-xs text-manifold-green dark:text-gray-400">
                    Daily Tokens: {model.dailyTokens.toLocaleString()}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="w-1/2 border-t border-gray-200 dark:border-white/10" />
          <span className="font-semibold text-manifold-green dark:text-manifold-pink">
            ~ App Showcase ~
          </span>
          <div className="p-2 w-full max-w-md bg-manifold-grey2 dark:bg-gray-800 rounded-lg">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPeriod('daily')}
                className={`flex-1 py-4 text-white transition-colors duration-200 rounded-lg ${
                  selectedPeriod === 'daily'
                    ? 'bg-manifold-green dark:bg-manifold-pink dark:text-manifold-grey1-800'
                    : 'bg-gray-400 dark:bg-gray-600 hover:bg-manifold-green/80 dark:hover:bg-manifold-pink/80'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedPeriod('weekly')}
                className={`flex-1 py-4 text-white transition-colors duration-200 rounded-lg ${
                  selectedPeriod === 'weekly'
                    ? 'bg-manifold-green dark:bg-manifold-pink dark:text-manifold-grey1-800'
                    : 'bg-gray-400 dark:bg-gray-600 hover:bg-manifold-green/80 dark:hover:bg-manifold-pink/80'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setSelectedPeriod('monthly')}
                className={`flex-1 py-4 text-white transition-colors duration-200 rounded-lg ${
                  selectedPeriod === 'monthly'
                    ? 'bg-manifold-green dark:bg-manifold-pink dark:text-manifold-grey1-800'
                    : 'bg-gray-400 dark:bg-gray-600 hover:bg-manifold-green/80 dark:hover:bg-manifold-pink/80'
                }`}
              >
                This Month
              </button>
            </div>
          </div>
          <div className="w-full max-w-2xl mt-4">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {selectedApps.map((app, index) => (
                <li key={index} className="py-4 flex items-center">
                  <div className="w-8 text-right mr-4">{index + 1}.</div>
                  <Image src={app.favicon} alt={`${app.name} favicon`} className="w-6 h-6 mr-4" width={24} height={24} unoptimized/>
                  <div className="flex-1 min-w-0">
                    <Link href={app.url} className="text-sm font-medium text-gray-900 dark:text-white truncate hover:underline">
                      {app.name}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {app.description}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                    {app.tokens.toLocaleString()} tokens
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
