"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ModelStatusIndicator from "@/app/_components/ModelStatusIndicator";
import { CREDIT_PER_DOLLAR } from "@/constants";

interface AppCardProps {
  name: string;
  cpt: number;
  modality: string;
  requiredGPUs: number;
  enabled: boolean;
  supportedEndpoints: string[];
  description: string;
}

export const AppCard = ({
  name,
  cpt,
  modality,
  requiredGPUs,
  enabled,
  supportedEndpoints,
  description,
}: AppCardProps) => {
  const cost = (cpt * 1_000_000) / CREDIT_PER_DOLLAR;
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverSupported, setIsHoverSupported] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    const updateHoverability = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsHoverSupported(e.matches);
    };

    updateHoverability(mediaQuery);
    mediaQuery.addEventListener("change", updateHoverability);
    return () => mediaQuery.removeEventListener("change", updateHoverability);
  }, []);

  return (
    <Link href={`/models/${encodeURIComponent(name)}`}>
      <div
        className={`relative h-52 w-full overflow-hidden rounded-xl border bg-white p-5 transition-all duration-200 ${
          isHovered && isHoverSupported
            ? "border-mf-green shadow-lg"
            : "border-[#e4e7ec] shadow-sm"
        }`}
        onMouseEnter={() => isHoverSupported && setIsHovered(true)}
        onMouseLeave={() => isHoverSupported && setIsHovered(false)}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-2">
            <p className="text-lg font-medium text-[#667085]">{name}</p>

            <p className="line-clamp-2 text-sm font-light leading-snug text-[#667085]">
              {description}
            </p>
          </div>

          <div className="space-y-3 whitespace-nowrap">
            <div className="flex gap-2">
              <p className="text-xs leading-4 text-[#667085]">
                {requiredGPUs} GPU{requiredGPUs !== 1 ? "s" : ""}
              </p>
              <div className="h-5 w-px bg-[#e4e7ec]" />
              <p className="line-clamp-1 text-xs leading-4 text-[#667085]">
                {supportedEndpoints
                  .map((endpoint) =>
                    endpoint
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(" "),
                  )
                  .join(", ")}
              </p>
              <div className="h-5 w-px bg-[#e4e7ec]" />
              <p className="text-xs leading-4 text-[#667085]">
                {modality
                  .split("-")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() +
                      word.slice(1).toLowerCase(),
                  )
                  .join("-")}
              </p>
            </div>

            <div className="flex h-5 items-center justify-between whitespace-nowrap">
              <div className="flex items-center gap-2">
                <div className="text-sm leading-tight text-[#667085]">
                  ${cost} / M Tokens
                </div>
                <div className="h-5 w-px bg-[#e4e7ec]" />
                <ModelStatusIndicator enabled={enabled} showBorder={false} />
                <div
                  className={`flex items-center gap-2 transition-opacity duration-200 ${
                    isHovered && isHoverSupported ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="h-5 w-px bg-[#e4e7ec]" />
                  <p className="text-sm text-mf-green">View More →</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
