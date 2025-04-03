"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ModelStatusIndicator from "@/app/_components/ModelStatusIndicator";
import { CREDIT_PER_DOLLAR } from "@/constants";

interface AppCardProps {
  name: string;
  modality: string | null;
  requiredGPUs: number;
  enabled: boolean;
  supportedEndpoints: string[];
  description: string;
  cpt: number;
}

export const AppCard = ({
  name,
  modality,
  requiredGPUs,
  enabled,
  supportedEndpoints,
  description,
  cpt,
}: AppCardProps) => {
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
        className={`relative h-52 w-full overflow-hidden rounded-xl border bg-mf-milk-300 p-5 transition-all duration-200 hover:bg-mf-milk-100 ${
          isHovered && isHoverSupported
            ? "border-mf-blue-500"
            : "border-mf-silver-700"
        }`}
        onMouseEnter={() => isHoverSupported && setIsHovered(true)}
        onMouseLeave={() => isHoverSupported && setIsHovered(false)}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-mf-ash-500">{name}</p>

            <p className="line-clamp-2 text-sm font-light leading-snug text-mf-ash-500">
              {description}
            </p>
          </div>

          <div className="space-y-3 whitespace-nowrap">
            <div className="flex gap-1">
              <p className="text-xs font-medium leading-4 text-mf-ash-500">
                {requiredGPUs} GPU{requiredGPUs !== 1 ? "s" : ""}
              </p>
              <div className="h-5 w-px bg-mf-silver-700" />
              <p className="line-clamp-1 text-xs leading-4 text-mf-ash-500">
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
              <div className="h-5 w-px bg-mf-silver-700" />
              <p className="text-xs leading-4 text-mf-ash-500">
                {modality
                  ? modality
                      .split("-")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join("-")
                  : "Unknown"}
              </p>
            </div>

            <div className="flex h-5 items-center justify-between whitespace-nowrap text-xs">
              <div className="flex items-center gap-2">
                <div className="leading-tight text-mf-ash-500">
                  ${((cpt * 1_000_000) / CREDIT_PER_DOLLAR).toFixed(2)} / M
                  Tokens
                </div>
                <div className="h-5 w-px bg-mf-silver-700" />
                <ModelStatusIndicator enabled={enabled} showBorder={false} />
                <div
                  className={`flex items-center gap-2 transition-opacity duration-200 ${
                    isHovered && isHoverSupported ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="h-5 w-px bg-mf-silver-700" />
                  <p className="text-mf-blue-700">View More →</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
