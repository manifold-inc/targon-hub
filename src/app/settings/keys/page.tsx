"use client";

import { useState } from "react";
import { Copy, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { reactClient } from "@/trpc/react";
import { copyToClipboard, formatDate } from "@/utils/utils";

export default function KeysPage() {
  const [apiKeyName, setApiKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const utils = reactClient.useUtils();
  const keys = reactClient.core.getApiKeys.useQuery();
  const createApiKey = reactClient.core.createApiKey.useMutation({
    onSuccess: () => {
      void utils.core.getApiKeys.invalidate();
      setApiKeyName("");
      setIsCreating(false);
      toast.success("Key created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteApiKey = reactClient.core.deleteApiKey.useMutation({
    onSuccess: () => {
      void utils.core.getApiKeys.invalidate();
      toast.success("Key deleted", {
        style: { color: "red", background: "#fee2e2" },
      });
    },
    onError: () => {
      toast.error("Failed to delete key");
    },
  });

  const handleCopyClipboard = (copy: string) => {
    void copyToClipboard(copy);
    toast.success("Copied to clipboard!");
  };

  const handleCreate = () => {
    if (!isCreating) {
      setIsCreating(true);
    } else {
      createApiKey.mutate({ name: apiKeyName });
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">API Keys</h1>
      <div className="relative h-full py-2 sm:py-4">
        <div className="max-h-full overflow-auto whitespace-nowrap py-8">
          <div className="flex flex-col items-center justify-start gap-6">
            <div className="w-full">
              <div className="relative overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full border-separate border-spacing-0 text-xs sm:text-sm">
                  <thead>
                    <tr className="sticky top-0 h-8 w-full bg-gray-50">
                      <th className="sticky top-0 border-b border-t border-gray-200 px-2 py-1 text-left font-semibold leading-tight text-[#101828]">
                        Name
                      </th>
                      <th className="sticky top-0 border-b border-t border-gray-200 px-2 py-1 text-left font-semibold leading-tight text-[#101828]">
                        Key
                      </th>
                      <th className="sticky top-0 border-b border-t border-gray-200 px-2 py-1 text-left font-semibold leading-tight text-[#101828]">
                        Created
                      </th>
                      <th className="sticky top-0 border-b border-t border-gray-200 px-2 py-1 text-right font-semibold leading-tight text-[#101828]" />
                    </tr>
                  </thead>
                  <tbody className="w-full whitespace-nowrap">
                    {keys.data?.map((key, index) => (
                      <tr key={index} className="h-8 bg-white">
                        <td className="px-2 py-1 leading-tight text-[#101828]">
                          {key.name ?? "Default"}
                        </td>
                        <td className="px-2 py-1 text-left leading-tight text-[#101828]">
                          <span className="inline-flex items-center gap-2 font-mono">
                            {key.key.slice(0, 9) + "***"}
                            <button
                              className="cursor-pointer"
                              onClick={() => handleCopyClipboard(key.key)}
                            >
                              <Copy className="h-4 w-4 text-gray-300 hover:text-gray-500" />
                            </button>
                          </span>
                        </td>
                        <td className="px-2 py-1 text-left leading-tight text-[#101828]">
                          {key.createdAt ? formatDate(key.createdAt) : "-"}
                        </td>
                        <td className="px-2 py-1 text-right leading-tight text-[#101828]">
                          <button
                            type="button"
                            disabled={deleteApiKey.isLoading}
                            onClick={() =>
                              deleteApiKey.mutate({ apiKey: key.key })
                            }
                            className={`group rounded-full p-1.5 transition-colors ${
                              deleteApiKey.isLoading
                                ? "cursor-not-allowed bg-gray-100"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <XCircle
                              className={`h-6 w-6 ${
                                deleteApiKey.isLoading
                                  ? "text-gray-300"
                                  : "text-gray-300 group-hover:text-red-500"
                              } transition-colors`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            {isCreating && (
              <input
                type="text"
                value={apiKeyName}
                onChange={(e) => setApiKeyName(e.target.value)}
                className="block w-48 rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                placeholder="Enter key name"
              />
            )}
            <button
              className="hover:bg-gray-10 rounded-full border border-black bg-white px-3 py-2 text-sm font-semibold text-gray-500"
              onClick={handleCreate}
              disabled={createApiKey.isLoading}
            >
              <span className="flex items-center gap-2 px-0.5 text-sm font-semibold leading-tight text-black">
                {createApiKey.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : isCreating ? (
                  "Confirm"
                ) : (
                  "Create Key"
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
