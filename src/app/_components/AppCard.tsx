import Link from "next/link";

interface AppCardProps {
  name: string;
  cpt: number;
  modality: string;
  requiredGPUs: number;
  enabled: boolean;
}

export const AppCard = ({
  name,
  cpt,
  modality,
  requiredGPUs,
  enabled,
}: AppCardProps) => {
  return (
    <Link
      href={`/models/${encodeURIComponent(name)}`}
      className="flex h-44 w-full flex-col items-start justify-between rounded-xl border border-[#e4e7ec] bg-white p-5 shadow sm:w-80"
    >
      <div className="flex flex-col justify-between h-full">
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
        </div>
        <div className="flex h-5 items-center gap-2">
          <div className="text-sm leading-tight text-[#667085]">
            {cpt} Credits Per Token
          </div>
          <div className="h-5 w-px bg-[#e4e7ec]" />
          <div className="inline-flex h-6 items-center justify-start gap-1.5 rounded-full py-0.5 pl-2 pr-2.5">
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                enabled ? "bg-[#16a34a]" : "bg-[#dc2626]"
              }`}
            />
            <span
              className={`text-center text-sm font-medium leading-tight ${enabled ? "text-[#16a34a]" : "text-[#dc2626]"}`}
            >
              {enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
