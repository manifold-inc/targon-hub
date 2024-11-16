import Link from "next/link";
import { UserRoundIcon } from "lucide-react";

import { getModelGradient } from "@/utils/utils";

interface ModelCardProps {
  name: string;
  organization: string;
  modality: string;
  description: string;
  enabled: boolean;
  cpt: number;
}

export default function ModelCard({
  name,
  modality,
  organization,
  description,
  enabled,
  cpt,
}: ModelCardProps) {
  const gradient = getModelGradient(organization + "/" + name);

  return (
    <div className="flex min-h-40 animate-slide-in items-center gap-4 bg-white px-4 py-3 sm:gap-10 sm:p-5">
      <div className="hidden h-20 w-28 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-40 lg:block">
        <div className={`h-full w-full bg-gradient-to-br ${gradient}`} />
      </div>

      <div className="inline-flex w-full flex-col items-start justify-start gap-2 sm:gap-4">
        <div className="flex w-full flex-col justify-start gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-base font-medium leading-7 text-[#101828] sm:text-lg">
            <Link
              href={`/models/${encodeURIComponent(organization + "/" + name)}`}
            >
              {organization}/{name}
            </Link>
          </div>
          <div className="m:gap-4 flex flex-wrap items-center md:justify-normal">
            <div className="flex items-center justify-center gap-1.5 rounded-md md:px-3 md:py-1.5">
              <div className="hidden text-center text-sm font-semibold leading-tight text-[#667085]">
                1.62M tokens
              </div>
            </div>
            <div className="flex items-center justify-start gap-1.5 rounded-full border border-[#155dee] py-0.5 pl-2 pr-2.5 text-xs sm:text-sm">
              <div className="relative h-1.5 w-1.5 sm:h-2 sm:w-2">
                <div className="absolute left-px top-px h-1 w-1 rounded-full bg-[#155dee] sm:h-1.5 sm:w-1.5" />
              </div>
              <div className="whitespace-nowrap text-center font-medium leading-tight text-[#004eea]">
                {modality === "text-generation"
                  ? "Text Generation"
                  : "Text to Image"}
              </div>
            </div>
          </div>
        </div>

        <div className="line-clamp-2 self-stretch text-xs leading-tight text-[#667085] sm:text-sm">
          {description}
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <UserRoundIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <div className="text-xs leading-tight text-[#667085] sm:text-sm">
                {organization.charAt(0).toUpperCase() + organization.slice(1)}
              </div>
            </div>

            <div className="h-5 w-px bg-[#e4e7ec]" />

            <div className="text-xs leading-tight text-[#667085] sm:text-sm">
              {cpt} {cpt === 1 ? "Credit" : "Credits"} Per Token
            </div>
          </div>

          <div className="inline-flex h-5 items-center justify-start gap-1.5 rounded-full py-0.5 pl-2 pr-2.5 sm:h-6">
            <div
              className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${
                enabled ? "bg-[#16a34a]" : "bg-[#d97706]"
              }`}
            />
            <span
              className={`text-center text-xs font-medium leading-tight sm:text-sm ${enabled ? "text-[#16a34a]" : "text-[#d97706]"}`}
            >
              {enabled ? "Live" : "Available to Lease"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
