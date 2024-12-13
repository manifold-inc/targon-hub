import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { CREDIT_PER_DOLLAR } from "@/constants";

interface ModelPreviewCardProps {
  name: string;
  endpoints: string[];
  modality: string;
  description: string;
  cpt: number;
}

export const ModelPreviewCard = ({
  name,
  endpoints,
  modality,
  description,
  cpt,
}: ModelPreviewCardProps) => {
  // Get gradient based on modality
  const getGradient = () => {
    if (endpoints.includes("CHAT")) {
      return "from-[#DADFF7] to-[#A8AFEF]";
    } else if (endpoints.includes("COMPLETION")) {
      return "from-[#F896D8] to-[#CA7DF9]";
    } else if (endpoints.includes("GENERATION")) {
      return "from-[#2DD4BF] to-[#0EA5E9]";
    }
  };

  const cost = (cpt * 1_000_000) / CREDIT_PER_DOLLAR;

  return (
    <Link href={`/models/${encodeURIComponent(name)}`}>
      <div className="group relative overflow-hidden p-4 transition-all">
        {/* Background gradient bar - rounded by default, straight on hover */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b opacity-50 transition-all group-hover:opacity-100">
          <div
            className={`h-full w-full rounded-2xl bg-gradient-to-b transition-all group-hover:rounded-none ${getGradient()}`}
          />
        </div>

        <div className="ml-3 flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-900 transition-colors group-hover:text-gray-700">
                {name?.split("/")[1]}
              </h3>
              <p className="text-xs text-gray-500">{name?.split("/")[0]}</p>
            </div>
            <span className="whitespace-nowrap rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {modality === "text-generation" ? "Text Generation" : modality}
            </span>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-gray-600">{description}</p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="rounded-full bg-gray-100 px-2 py-0.5">
                {cost} / M Tokens
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};
