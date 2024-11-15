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
    <div className="flex min-h-40 animate-slide-in items-center gap-10 bg-white py-5 sm:p-5">
      <div className="hidden h-28 w-40 shrink-0 overflow-hidden rounded-lg lg:block">
        <div className={`h-full w-full bg-gradient-to-br ${gradient}`} />
      </div>

      {/* Second column - content structure */}
      <div className="inline-flex w-full flex-col items-start justify-start gap-4">
        {/* Top row with name, tokens, and category */}
        <div className="flex w-full flex-col justify-start md:flex-row md:items-center md:justify-between">
          <div className="text-lg font-medium leading-7 text-[#101828]">
            <Link
              className="sm:whitespace-nowrap"
              href={`/models/${encodeURIComponent(organization + "/" + name)}`}
            >
              {organization}/{name}
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 md:justify-normal">
            <div className="flex items-center justify-center gap-1.5 rounded-md md:px-3 md:py-1.5">
              <div className="hidden text-center text-sm font-semibold leading-tight text-[#667085]">
                1.62M tokens
              </div>
            </div>
            <div className="flex items-center justify-start gap-1.5 rounded-full border border-[#155dee] py-0.5 pl-2 pr-2.5">
              <div className="relative h-2 w-2">
                <div className="absolute left-px top-px h-1.5 w-1.5 rounded-full bg-[#155dee]" />
              </div>
              <div className="whitespace-nowrap text-center text-sm font-medium leading-tight text-[#004eea]">
                {modality === "text-generation"
                  ? "Text Generation"
                  : "Text to Image"}
              </div>
            </div>
          </div>
        </div>

        {/* Description row */}
        <div className="line-clamp-2 self-stretch text-sm leading-tight text-[#667085]">
          {description}
        </div>

        {/* Bottom row with metadata */}
        <div className="flex h-5 w-full  items-center gap-2 whitespace-nowrap text-sm sm:text-base">
          <div className="flex items-center gap-3">
            <UserRoundIcon className="h-4 w-4" />
            <div className="text-sm leading-tight text-[#667085]">
              {organization.charAt(0).toUpperCase() + organization.slice(1)}
            </div>
          </div>
          <div className="h-5 w-px bg-[#e4e7ec]" />
          <div className="text-sm leading-tight text-[#667085]">
            {cpt} {cpt === 1 ? "Credit" : "Credits"} Per Token
          </div>
          <div className="h-5 w-px bg-[#e4e7ec]" />
          <div className="inline-flex h-6 items-center justify-start gap-1.5 rounded-full py-0.5 pl-2 pr-2.5">
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                enabled ? "bg-[#16a34a]" : "bg-[#d97706]"
              }`}
            />
            <span
              className={`text-center text-sm font-medium leading-tight ${enabled ? "text-[#16a34a]" : "text-[#d97706]"}`}
            >
              {enabled ? "Live" : "Available to Lease"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
