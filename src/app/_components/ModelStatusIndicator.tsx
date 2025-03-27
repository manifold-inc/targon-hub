"use client";

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
      className={`group relative flex h-6 items-center justify-start gap-1 rounded-full py-0.5 pl-1.5 pr-2 ${
        showBorder ? "border " : ""
      }${
        enabled
          ? "border-mf-blue-500 text-mf-blue-700"
          : "border-mf-red text-mf-red"
      }`}
    >
      <div
        className={`h-1.5 w-1.5 rounded-full ${
          enabled ? "bg-mf-blue-500" : "bg-mf-red"
        }`}
      />
      <span className="text-center text-xs font-medium leading-tight">
        {enabled ? "Live" : "Leasable"}
      </span>

      {!enabled && (
        <span className="pointer-events-none absolute left-1/2 m-4 mx-auto hidden w-max max-w-sm -translate-x-1/2 -translate-y-3/4 text-wrap rounded-md bg-gray-800 p-1.5 text-center text-sm text-gray-100 opacity-0 transition-opacity group-hover:opacity-100 sm:block">
          This model is available to lease. It is not currently live, but you
          can request access to it and will become live shortly if the immunity
          period of the other models is over.
        </span>
      )}
    </div>
  );
}
