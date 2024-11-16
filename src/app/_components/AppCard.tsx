import Link from "next/link";

import ModelStatusIndicator from "@/app/_components/ModelStatusIndicator";

interface AppCardProps {
  name: string;
  cpt: number;
  modality: string;
  requiredGPUs: number;
  enabled: boolean;
  supportedEndpoints: string[];
}

export const AppCard = ({
  name,
  cpt,
  modality,
  requiredGPUs,
  enabled,
  supportedEndpoints,
}: AppCardProps) => {
  return (
    <Link
      href={`/models/${encodeURIComponent(name)}`}
      className="flex h-44 w-full flex-col items-start justify-between rounded-xl border border-[#e4e7ec] bg-white p-5 shadow md:w-80"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex gap-4">
          <p className="h-5 text-lg font-medium text-[#667085]">{name}</p>
        </div>
        <div className="flex gap-2 pt-4">
          <p className="text-xs leading-4 text-[#667085]">
            {modality === "text-generation"
              ? "Text Generation"
              : "Text to Image"}
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
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() +
                      word.slice(1).toLowerCase(),
                  )
                  .join(" "),
              )
              .join(", ")}
          </p>
        </div>
        <div className="flex h-5 items-center gap-2 whitespace-nowrap">
          <div className="text-sm leading-tight text-[#667085]">
            {cpt} Credit{cpt !== 1 ? "s" : ""} Per Token
          </div>
          <div className="h-5 w-px bg-[#e4e7ec]" />
          <ModelStatusIndicator enabled={enabled} showBorder={false} />
        </div>
      </div>
    </Link>
  );
};
