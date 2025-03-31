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
  modality,
  description,
  cpt,
}: ModelPreviewCardProps) => {
  return (
    <Link href={`/models/${encodeURIComponent(name)}`}>
      <div className="group relative overflow-hidden p-4 pl-0 transition-all">
        <div className="ml-3 flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-mf-ash-700 transition-colors group-hover:text-mf-ash-500">
                {name?.split("/")[1]}
              </h3>
              <p className="text-xs text-mf-ash-500">{name?.split("/")[0]}</p>
            </div>
            <span className="whitespace-nowrap rounded-full bg-mf-milk-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {modality === "text-generation" ? "Text Generation" : modality}
            </span>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-gray-600">{description}</p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-mf-ash-500">
              <span className="rounded-full bg-mf-milk-100 px-2 py-0.5">
                {cpt === 0
                  ? "Free"
                  : `$${((cpt * 1_000_000) / CREDIT_PER_DOLLAR).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}/ M tokens`}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};
