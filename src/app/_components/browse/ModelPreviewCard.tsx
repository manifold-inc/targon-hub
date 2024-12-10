import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ModelPreviewCardProps {
  name: string;
  provider: string;
  type: "chat" | "completions";
  description: string;
}

export const ModelPreviewCard = ({ name, provider, type, description }: ModelPreviewCardProps) => {
  // Get gradient based on type
  const getGradient = () => {
    switch (type) {
      case "chat":
        return "from-[#DADFF7] to-[#A8AFEF]";
      case "completions":
        return "from-[#F896D8] to-[#CA7DF9]";
    }
  };

  return (
    <Link href={`/models/${encodeURIComponent(name)}`}>
      <div className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white p-4 transition-all hover:shadow-md">
        {/* Background gradient bar */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b opacity-50 transition-opacity group-hover:opacity-100">
          <div className={`h-full w-full bg-gradient-to-b ${getGradient()}`} />
        </div>

        <div className="ml-3 flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                {name}
              </h3>
              <p className="text-xs text-gray-500">{provider}</p>
            </div>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
              Text Generation
            </span>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-gray-600">{description}</p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="rounded-full bg-gray-100 px-2 py-0.5">
                Price
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};
