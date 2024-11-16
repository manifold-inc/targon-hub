"use client";

import { toast } from "sonner";

type Props = {
  enabled: boolean;
  showBorder?: boolean;
};

export default function ModelStatusIndicator({
  enabled,
  showBorder = true,
}: Props) {
  return (
    <div
      className={`inline-flex h-6 items-center justify-start gap-1 rounded-full py-0.5 pl-1.5 pr-2 ${
        showBorder ? "border " : ""
      }${
        enabled
          ? "border-[#16a34a] text-[#16a34a]"
          : "border-[#d97706] text-[#d97706]"
      }`}
      onMouseEnter={() => {
        if (!enabled) {
          toast.info(
            "This model is available to lease. It is not currently live, but you can request access to it and will become live shortly if the immunity period of the other models is over.",
          );
        }
      }}
    >
      <div
        className={`h-1.5 w-1.5 rounded-full ${
          enabled ? "bg-[#16a34a]" : "bg-[#d97706]"
        }`}
      />
      <span className="text-center text-xs font-medium leading-tight">
        {enabled ? "Live" : "Leasable"}
      </span>
    </div>
  );
}
