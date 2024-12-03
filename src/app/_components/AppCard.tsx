import Link from "next/link";
import { useState } from "react";
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

  return (
    <div
      className={`relative h-44 w-full overflow-hidden rounded-xl border bg-white shadow transition-all duration-200 md:w-80 ${
        isHovered ? 'border-blue-500 scale-[1.02]' : 'border-[#e4e7ec]'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full w-full">
        {!isHovered ? (
          // Default state
          <div className="flex h-full w-full flex-col justify-between p-5">
            <div className="flex gap-4">
              <p className="h-5 text-lg font-medium text-[#667085]">{name}</p>
            </div>
            <div className="flex gap-2 pt-4">
              <p className="text-xs leading-4 text-[#667085]">
                {modality === "text-generation" ? "Text Generation" : "Text to Image"}
              </p>
              <div className="h-5 w-px bg-[#e4e7ec]" />
              <p className="text-xs leading-4 text-[#667085]">
                {requiredGPUs} GPU{requiredGPUs !== 1 ? "s" : ""}
              </p>
              <div className="h-5 w-px bg-[#e4e7ec]" />
              <p className="text-xs leading-4 text-[#667085]">
                {supportedEndpoints
                  .map((endpoint) =>
                    endpoint
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(" ")
                  )
                  .join(", ")}
              </p>
            </div>
            <div className="flex h-5 items-center gap-2 whitespace-nowrap">
              <div className="text-sm leading-tight text-[#667085]">
                ${cost} / M Tokens
              </div>
              <div className="h-5 w-px bg-[#e4e7ec]" />
              <ModelStatusIndicator enabled={enabled} showBorder={false} />
            </div>
          </div>
        ) : (
          // Updated hover state with correct spacing
          <div 
            className={`absolute inset-0 flex h-full w-full flex-col bg-blue-500 transition-all ease-in-out duration-300 p-6 ${
              isHovered ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <div className="text-sm font-medium text-white uppercase tracking-wider">
              {modality === "text-generation" ? "TEXT" : "IMAGE"}
            </div>
            <div className="mt-auto space-y-4">
              <p className="text-sm text-white font-light leading-snug">
                {description.length > 60 ? description.substring(0, 60) + '...' : description}
              </p>
              <div className="flex justify-between items-center whitespace-nowrap">
                <div className="text-sm text-white font-medium">
                  {name.split('/')[0]}
                </div>
                <Link
                  href={`/models/${encodeURIComponent(name)}`}
                  className="text-white text-sm flex items-center gap-2 uppercase tracking-wider"
                >
                  View More <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
