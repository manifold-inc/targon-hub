import Link from "next/link";

import { type MODALITIES } from "@/schema/schema";

interface ModelCardProps {
  name: string;
  modality: (typeof MODALITIES)[number];
  description: string;
  enabled: boolean;
  createdAt: Date | string | null;
  avgTPS?: number;
}

export default function ModelCard({
  name,
  modality,
  description,
  enabled,
  createdAt,
  avgTPS,
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
    <div className="flex min-h-40 animate-slide-in items-center gap-4 bg-white px-4 py-3 sm:gap-10 sm:p-5">
      <div className="inline-flex w-full flex-col items-start justify-start gap-2 sm:gap-4">
        <div className="flex w-full flex-col justify-start gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-base font-medium leading-7 text-[#101828] sm:text-lg">
            <Link href={`/models/${encodeURIComponent(name)}`}>{name}</Link>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>Created: {formattedDate}</span>
            {avgTPS && <span>{avgTPS.toFixed(1)} TPS</span>}
            {enabled ? (
              <span className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-green-600">Live</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="text-blue-600">Available to Lease</span>
              </span>
            )}
          </div>
        </div>

        <div className="line-clamp-2 max-w-lg self-stretch text-xs leading-tight text-[#667085] sm:text-sm">
          {description}
        </div>

        <div className="flex w-full flex-col flex-wrap gap-2 whitespace-nowrap sm:flex-row sm:gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="text-xs leading-tight text-[#667085] sm:text-sm">
                {org}
              </div>
            </div>

            <div className="h-5 w-px bg-[#e4e7ec]" />

            <div className="text-xs leading-tight text-[#667085] sm:text-sm">
              {modality === "text-generation"
                ? "Text Generation"
                : "Text to Image"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
