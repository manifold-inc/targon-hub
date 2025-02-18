import Link from "next/link";

import { CREDIT_PER_DOLLAR } from "@/constants";
import SearchBar from "./SearchBar";

export function HeroSection() {
  return (
    <div className="relative animate-slide-in">
      <div className="relative -top-20 flex flex-col items-start justify-center gap-6 px-4 pb-6 pt-20 sm:px-10 sm:pb-10 sm:pt-40 lg:flex-row">
        <div className="flex w-full flex-col gap-6 lg:w-1/2">
          <Link
            className="group relative flex flex-col 
              items-center gap-4 overflow-hidden rounded-lg border border-gray-300 bg-gray-200
              p-4 shadow-lg backdrop-blur-sm transition-all duration-300 
              hover:border-mf-green/50 hover:shadow-xl sm:p-8"
            href="/browse"
          >
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-center gap-2 text-center text-2xl font-light text-mf-green sm:gap-4 sm:text-4xl">
                <span className="font-semibold text-mf-green">The</span>
                <span className="font-semibold text-mf-green">
                  Decentralized
                </span>
                <span className="font-semibold text-mf-green">AI</span>
                <span className="font-semibold text-mf-green">Cloud</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2 sm:gap-4">
                <p className="text-center text-gray-600">
                  Run inference on AI Models lightning fast at low cost
                </p>
              </div>
            </div>
          </Link>

          <StatsCards />
          <div className="relative w-full pt-6 lg:hidden">
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCards() {
  const basePrice = ((100 * 1_000_000) / CREDIT_PER_DOLLAR).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center">
        <div className="grid w-full grid-cols-1 gap-4 text-center font-mono sm:grid-cols-2">
          <StatCard title="Greater Than" value="400" unit="Tokens/s" />
          <StatCard
            title="Currently"
            value={`$${basePrice}`}
            unit="per 1M Tokens"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  unit,
}: {
  title: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-gray-200 p-4 shadow-lg backdrop-blur-sm sm:p-8">
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center font-light">
        <p className="text-mf-green">{title}</p>
        <div className="relative inline-flex items-start justify-center">
          <p className="text-3xl text-mf-green">{value}</p>
        </div>
        <p className="text-mf-green">{unit}</p>
      </div>
    </div>
  );
}
