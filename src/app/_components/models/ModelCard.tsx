import Link from "next/link";
import { ArrowUpRight, Zap } from "lucide-react";

import { type MODALITIES } from "@/schema/schema";

interface ModelCardProps {
  name: string;
  modality: (typeof MODALITIES)[number];
  description: string;
  enabled: boolean;
  createdAt: Date | string | null;
  avgTPS?: number;
  weeklyPrice?: number;
}

export default function ModelCard({
  name,
  modality,
  description,
  enabled,
  createdAt: _createdAt,
  avgTPS,
  weeklyPrice,
}: ModelCardProps) {
  const org = name.split("/").at(0) ?? "Unknown";

  return (
    <Link
      href={`/models/${encodeURIComponent(name)}`}
      className="group relative flex items-start overflow-hidden rounded-xl border border-[#e4e7ec] bg-gradient-to-b from-white to-[#fcfcfd] p-3 transition-all duration-300 hover:border-opacity-20 hover:shadow-lg sm:p-4 md:p-5"
    >
      <div
        className={`absolute inset-x-0 top-0 h-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          enabled
            ? "bg-gradient-to-r from-emerald-500/40 via-emerald-500/80 to-emerald-500/40"
            : "bg-gradient-to-r from-blue-500/40 via-blue-500/80 to-blue-500/40"
        }`}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3 md:gap-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate pr-8 text-sm font-medium text-[#101828] sm:pr-24 sm:text-base md:pr-32">
              {name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[0.8125rem] text-[#475467] sm:gap-x-2 sm:text-xs">
              <span className="font-medium text-[#344054]">{org}</span>
              <span className="text-[#e4e7ec]">|</span>
              <span>
                {modality === "text-generation" ? "Text Gen" : "Text to Image"}
              </span>
              {avgTPS && (
                <>
                  <span className="text-[#e4e7ec]">|</span>
                  <span className="inline-flex items-center gap-1">
                    <Zap
                      className={`h-3 w-3 ${enabled ? "text-emerald-500" : "text-blue-500"}`}
                    />
                    {avgTPS.toFixed(1)} TPS
                  </span>
                </>
              )}
              {weeklyPrice && (
                <>
                  <span className="text-[#e4e7ec]">|</span>
                  <span>${weeklyPrice}/week</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-start gap-1.5 sm:gap-2">
            {enabled ? (
              <div className="flex min-w-16 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/10 sm:min-w-[72px] sm:gap-1.5 sm:px-2 sm:text-xs">
                <div className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                Live
              </div>
            ) : (
              <div className="flex min-w-16 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-600/10 sm:min-w-[72px] sm:gap-1.5 sm:px-2 sm:text-xs">
                <div className="h-1 w-1 animate-pulse rounded-full bg-blue-500" />
                Available
              </div>
            )}
            <ArrowUpRight
              className={`h-3.5 w-3.5 flex-shrink-0 text-[#98a1b2] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-4 sm:w-4 ${
                enabled
                  ? "group-hover:text-emerald-600"
                  : "group-hover:text-blue-600"
              }`}
            />
          </div>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-[#475467] group-hover:text-[#344054] sm:text-sm">
          {description}
        </p>
      </div>
    </Link>
  );
}
