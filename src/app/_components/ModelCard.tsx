import Link from "next/link";
import { UserRoundIcon } from "lucide-react";

import ModelStatusIndicator from "@/app/_components/ModelStatusIndicator";
import { CREDIT_PER_DOLLAR } from "@/constants";
import { type MODALITIES } from "@/schema/schema";
import { getModelGradient } from "@/utils/utils";

export default function ModelCard({
  name,
  modality,
  description,
  enabled,
  cpt,
}: {
  name: string;
  modality: (typeof MODALITIES)[number];
  description: string;
  enabled: boolean;
  cpt: number;
}) {
  const gradient = getModelGradient(name);

  const org = name.split("/").at(0) ?? "Unknown";
  const cost = (cpt * 1_000_000) / CREDIT_PER_DOLLAR;
  return (
    <div className="flex min-h-40 animate-slide-in items-center gap-4 bg-white px-4 py-3 sm:gap-10 sm:p-5">
      <div className="hidden h-20 w-28 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-40 lg:block">
        <div className={`h-full w-full bg-gradient-to-br ${gradient}`} />
      </div>

      <div className="inline-flex w-full flex-col items-start justify-start gap-2 sm:gap-4">
        <div className="flex w-full flex-col justify-start gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-base font-medium leading-7 text-[#101828] sm:text-lg">
            <Link href={`/models/${encodeURIComponent(name)}`}>{name}</Link>
          </div>
          <div className="flex flex-wrap items-center md:justify-normal md:gap-4">
            <div className="flex items-center justify-center gap-1.5 rounded-md md:px-3 md:py-1.5">
              <div className="hidden text-center text-sm font-semibold leading-tight text-[#667085]">
                1.62M tokens
              </div>
            </div>
          </div>
        </div>

        <div className="line-clamp-2 max-w-lg self-stretch text-xs leading-tight text-[#667085] sm:text-sm">
          {description}
        </div>

        <div className="flex w-full flex-col flex-wrap gap-2 whitespace-nowrap sm:flex-row sm:gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <UserRoundIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <div className="text-xs leading-tight text-[#667085] sm:text-sm">
                {org.charAt(0).toUpperCase() + org.slice(1)}
              </div>
            </div>

            <div className="h-5 w-px bg-[#e4e7ec]" />

            <div className="text-xs leading-tight text-[#667085] sm:text-sm">
              ${cost} / M Tokens
            </div>
            <div className="h-5 w-px bg-[#e4e7ec]" />
            <div className="text-xs leading-tight text-[#667085] sm:text-sm">
              {modality === "text-generation"
                ? "Text Generation"
                : "Text to Image"}
            </div>
          </div>

          <ModelStatusIndicator enabled={enabled} showBorder={false} />
        </div>
      </div>
    </div>
  );
}
