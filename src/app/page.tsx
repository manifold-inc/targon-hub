"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import { useState } from "react";
import { AppCard } from "./_components/AppCard";


export interface App {
  id: number;
  title: string;
  description: string;
  tokens: string;
  rating: string;
  category: string;
}

const apps: App[] = [
  {
    id: 1,
    title: "ChatMaster",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In efficitur sollicitudin orci in luctus. Vivamus aliquet ligula et volutpat faucibus.",
    tokens: "50 tokens",
    rating: "4.5",
    category: "Trending",
  },
  {
    id: 2,
    title: "FitnessPro",
    description: "Track your workouts and stay fit.",
    tokens: "30 tokens",
    rating: "4.0",
    category: "Health",
  },
  {
    id: 3,
    title: "PhotoSnap",
    description: "Capture and edit your photos with ease.",
    tokens: "40 tokens",
    rating: "4.2",
    category: "Photography",
  },
  {
    id: 4,
    title: "TaskTrack",
    description: "Manage your tasks and increase productivity.",
    tokens: "20 tokens",
    rating: "4.8",
    category: "Productivity",
  },
  {
    id: 5,
    title: "TravelBuddy",
    description: "Plan your trips and explore new places.",
    tokens: "35 tokens",
    rating: "4.3",
    category: "Travel",
  },
  {
    id: 6,
    title: "MusicFlow",
    description: "Stream and organize your favorite music.",
    tokens: "25 tokens",
    rating: "4.6",
    category: "Entertainment",
  },
  {
    id: 7,
    title: "EduLearn",
    description: "Enhance your learning with interactive courses.",
    tokens: "45 tokens",
    rating: "4.7",
    category: "Education",
  },
  {
    id: 8,
    title: "FinanceGuru",
    description: "Manage your finances and investments.",
    tokens: "55 tokens",
    rating: "4.4",
    category: "Finance",
  },
];

export default function Page() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const tabs = ["Trending", "All Apps", "Health", "Photography", "Productivity", "Travel", "Entertainment", "Education", "Finance"];
  const selectedCategory = tabs[selectedIndex];

    // Filter apps based on selected category
    const filteredApps: App[] =
    selectedCategory === "All Apps"
      ? apps
      : apps.filter((app) => app.category === selectedCategory);

  return (
    <div className="relative">
    <div className="relative h-4/5 overflow-hidden -top-20">
      <Image
        className="absolute inset-0 w-full h-full object-cover animate-fadeIn p-2 rounded-xl
        b"
        src="/gradientFigma.png"
        alt="background"
        width={1920}
        height={1080}
      />
      
      {/* Content with background */}
      <div className="relative flex flex-col items-start justify-center gap-6 h-full pb-20 pl-10 pt-96">
        <div className="flex h-36 animate-slideIn animation-delay-[0.5s] flex-col items-start justify-start self-stretch">
          <div className="leading-18 self-stretch text-6xl font-light text-[#1c3836]">
            Decentralized LLMs
          </div>
          <div className="leading-18 delay-300 animate-slideIn self-stretch text-6xl font-light text-[#1c3836]">
            at your fingertips
          </div>
        </div>
        <div className="delay-300 animate-slideIn self-stretch leading-loose text-[#667085]">
          Cheaper, better, faster. Powered by Bittensor on subnet 4.
        </div>
        <div className="delay-700 inline-flex animate-slideIn items-center justify-start gap-6">
          <Link
            href="/models"
            className="group relative flex h-12 w-44 items-center justify-center"
          >
            <div className="absolute h-11 w-40 rounded-full border-2 border-black opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-white group-hover:border-0">
              <span className="flex items-center gap-2 text-sm font-semibold leading-tight">
                Browse Models
                <ChevronRight className="h-4 w-4 opacity-50" />
              </span>
            </div>
          </Link>
          <Link
            href="https://discord.gg/manifold"
            className="flex items-center justify-center gap-2 rounded-full border border-[#e4e7ec] bg-white px-3.5 py-2.5 text-[#344054] shadow shadow-inner hover:border-[#d0d5dd]"
          >
            <span className="flex items-center gap-2 text-sm font-semibold leading-tight">
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
    <div className="px-10 -mt-10">
      <div className="animate-slideIn delay-1000">
        <TabGroup>
          <TabList className="h-12 w-full p-2 bg-white rounded-full border border-[#e4e7ec] justify-start items-center gap-2 inline-flex">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                className={`h-9 px-3 py-2 rounded-full flex justify-center items-center gap-1 text-sm font-semibold leading-tight ${
                  selectedIndex === index
                    ? "bg-[#f2f4f7] text-[#475467]"
                    : "opacity-80 text-[#475467] hover:bg-gray-100"
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                {tab}
              </Tab>
            ))}
          </TabList>
        </TabGroup>
      </div>
  
      <div className="py-4 animate-slideIn delay-1000">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredApps.map((app) => (
            <AppCard key={app.id} {...app} />
          ))}
        </div>
      </div>
    </div>
  </div>
  
  );
}
