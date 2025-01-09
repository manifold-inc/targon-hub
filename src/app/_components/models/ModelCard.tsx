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
  createdAt,
  avgTPS,
  weeklyPrice,
}: ModelCardProps) {
  const org = name.split("/").at(0) ?? "Unknown";

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <Link
      href={`/models/${encodeURIComponent(name)}`}
      className="group relative overflow-hidden rounded-xl border border-[#e4e7ec] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#142900]/20 hover:shadow-lg"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#142900]/[0.02] via-[#142900]/[0.01] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,transparent_25%,rgba(68,255,109,0.05)_50%,transparent_75%)] opacity-0 group-hover:animate-[shine_3s_ease-in-out_infinite] group-hover:opacity-100" />

      <div className="grid grid-cols-[1fr,auto] items-center gap-4 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#101828] transition-colors group-hover:text-[#142900]">
                {name}
              </span>
              <ArrowUpRight
                className="h-4 w-4 text-[#98a1b2] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#142900] group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>
            {enabled ? (
              <div className="flex items-center gap-2 rounded-full bg-[#ecfdf3] px-3 py-1 text-xs font-medium text-[#027948] shadow-sm transition-transform group-hover:scale-105">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#12b76a]" />
                Live
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-full bg-[#eff8ff] px-3 py-1 text-xs font-medium text-[#175cd3] shadow-sm transition-transform group-hover:scale-105">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2e90fa]" />
                Available to Lease
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#475467]">
            <span className="font-medium text-[#142900]/70">{org}</span>
            <div className="h-3 w-px bg-[#e4e7ec]" />
            <span>
              {modality === "text-generation"
                ? "Text Generation"
                : "Text to Image"}
            </span>
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-[#475467] transition-colors group-hover:text-[#344054]">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#344054] transition-colors group-hover:text-[#142900]">
              <span className="text-[#98a1b2] transition-colors group-hover:text-[#142900]/70">
                Created
              </span>
              {formattedDate}
            </div>

            {avgTPS && (
              <>
                <div className="h-3 w-px bg-[#e4e7ec]" />
                <div className="flex items-center gap-2 text-[#344054] transition-colors group-hover:text-[#142900]">
                  <Zap className="h-3 w-3 text-[#98a1b2] transition-colors group-hover:text-[#142900]/70" />
                  {avgTPS.toFixed(1)} TPS
                </div>
              </>
            )}

            {weeklyPrice && (
              <>
                <div className="h-3 w-px bg-[#e4e7ec]" />
                <div className="flex items-center gap-2 text-[#344054] transition-colors group-hover:text-[#142900]">
                  <span className="text-[#98a1b2] transition-colors group-hover:text-[#142900]/70">
                    Price
                  </span>
                  ${weeklyPrice}/week
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
