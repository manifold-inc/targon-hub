import clsx from "clsx";

interface ClientHubCardProps {
  name: string;
  provider: string;
  type: "chat" | "text-to-image" | "completions";
  description: string;
  className?: string;
}

export function ClientHubCard({
  name,
  provider,
  type,
  description,
  className,
}: ClientHubCardProps) {
  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      {/* Provider Tag */}
      <div className="mb-4 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
        {provider}
      </div>

      {/* Model Name */}
      <h3 className="text-xl font-semibold text-gray-900">{name}</h3>

      {/* Model Type Tags */}
      <div className="mt-2 flex gap-2">
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
          {type}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-gray-600">{description}</p>

      {/* Hover Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm">
          View Details
        </span>
      </div>
    </div>
  );
}
