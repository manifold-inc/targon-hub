"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Page() {
  return (
    <>
      <div className="max-h-5/6">
        <Image
          className="absolute inset-0 -z-10 h-full w-full animate-fadeIn rounded-2xl p-2"
          src="/gradientFigma.png"
          alt="background"
          width={1920}
          height={1080}
        />

        <div className="inline-flex h-1/2 flex-col items-start justify-center gap-6 pb-20 pl-10 pt-96">
          <div className="flex h-36 animate-slideIn flex-col items-start justify-start self-stretch">
            <div className="leading-18 self-stretch text-6xl font-light text-[#1c3836]">
              Decentralized LLMs
            </div>
            <div className="leading-18 animation-delay-[0.15s] animate-slideIn self-stretch text-6xl font-light text-[#1c3836]">
              at your fingertips
            </div>
          </div>
          <div className="animation-delay-[0.3s] animate-slideIn self-stretch leading-loose text-[#667085]">
            Cheaper, better, faster. Powered by Bittensor on subnet 4.
          </div>
          <div className="animation-delay-[0.45s] inline-flex animate-slideIn items-center justify-start gap-6">
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
    </>
  );
}
