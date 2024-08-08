"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, RotateCw } from "lucide-react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/constants";
import { reactClient } from "@/trpc/react";
import { copyToClipboard } from "@/utils/utils";

export const ApiSection = () => {
  const apiKeys = reactClient.core.getApiKeys.useQuery();
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div>
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Endpoint
        </label>
        <div className="font-mono">{API_BASE_URL}</div>
      </div>
      {apiKeys.data?.length ? (
        <ApiKey apiKey={apiKeys.data[0]!.key} />
      ) : (
        <div className="mt-auto flex h-6 w-72 animate-pulse items-center gap-2 bg-neutral-200 px-2 py-0.5 text-gray-800 dark:bg-neutral-700 dark:text-gray-300" />
      )}
    </div>
  );
};

export const ApiKey = ({ apiKey }: { apiKey: string }) => {
  const [key, setKey] = useState(apiKey);
  const [visable, setVisable] = useState(false);
  const rollApiKey = reactClient.core.rollApiKey.useMutation({
    onSuccess: (k) => {
      toast.success("Rolled Api Key");
      setKey(k);
    },
  });
  let apiString = key;
  if (!visable) {
    apiString = key.slice(0, 4) + "*".repeat(28);
  }
  return (
    <div>
      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
        API Key
      </label>
      <div className="overflow-x-scroll pb-4">
        <div className="flex w-fit items-center gap-2 bg-neutral-200 px-2 py-0.5 text-gray-800 dark:bg-neutral-700 dark:text-gray-300">
          <button
            disabled={visable}
            onClick={() => {
              void copyToClipboard(key);
              toast("Copied API key to Clipboard");
            }}
            className="font-mono text-sm tracking-wide disabled:cursor-text disabled:select-text"
          >
            {apiString}
          </button>
          <button
            title="View Token"
            onClick={() => setVisable((v) => !v)}
            className=""
          >
            {visable ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </button>
          <button
            className="group"
            disabled={rollApiKey.isLoading}
            onClick={() => rollApiKey.mutate({ apiKey: key })}
            title="Roll token"
          >
            <RotateCw className="h-3 w-3 group-disabled:animate-spin" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const WatchForSuccess = () => {
  const params = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    if (params.get("success")) {
      router.push("/dashboard");
      setTimeout(() => toast.success("Successfully purchased more tokens"));
    }
    if (params.get("canceled")) {
      router.push("/dashboard");
      setTimeout(() => toast.info("Canceled transaction"));
    }
  }, [params, router]);
  return null;
};
