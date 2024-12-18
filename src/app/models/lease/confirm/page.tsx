"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { COST_PER_GPU, CREDIT_PER_DOLLAR } from "@/constants";
import { reactClient } from "@/trpc/react";
import { formatLargeNumber } from "@/utils/utils";

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const model = searchParams.get("model");

  const user = reactClient.account.getUser.useQuery();
  const dbRequiredGpus = reactClient.model.getRequiredGpus.useQuery(
    model ?? "",
    {
      enabled: !!model,
    },
  );
  const enableModelMutation = reactClient.credits.leaseModel.useMutation({
    onSuccess: () => {
      toast.success("Model enabled successfully");
      router.push(`/models/${encodeURIComponent(model!)}`);
    },
    onError: (error) => {
      toast.error("Failed to enable model: " + error.message);
    },
  });

  if (!model) {
    router.replace("/models/lease/model");
    return null;
  }

  const requiredGPUS = BigInt(dbRequiredGpus.data ?? 0);
  const totalCost = requiredGPUS * COST_PER_GPU;
  const totalCostUSD = Number(totalCost) / CREDIT_PER_DOLLAR;
  const costPerGPUUSD = Number(COST_PER_GPU) / CREDIT_PER_DOLLAR;
  const userBalanceUSD = Number(user.data?.credits ?? 0) / CREDIT_PER_DOLLAR;
  const remainingBalanceUSD = userBalanceUSD - totalCostUSD;

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Step 3: Confirm Lease
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Review and confirm your model lease
        </p>
      </div>

      <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col items-start gap-2 border-b pb-4">
          <h3 className="text-sm font-medium text-gray-900">
            Model Lease Summary
          </h3>
          <p className="text-sm text-gray-500">{model}</p>
        </div>

        <dl className="mt-4 space-y-4">
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Required GPUs</dt>
            <dd className="text-sm font-medium text-gray-900">
              {formatLargeNumber(requiredGPUS)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Cost per GPU</dt>
            <dd className="text-sm font-medium text-gray-900">
              ${costPerGPUUSD.toFixed(2)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-4">
            <dt className="text-sm font-medium text-gray-900">Total Cost</dt>
            <dd className="text-sm font-medium text-gray-900">
              ${totalCostUSD.toFixed(2)}
            </dd>
          </div>
        </dl>

        {user.data && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Your Balance</span>
              <span className="text-sm font-medium text-gray-900">
                ${userBalanceUSD.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-sm font-medium text-gray-900">
                Remaining Balance
              </span>
              <span className="text-sm font-medium text-gray-900">
                ${remainingBalanceUSD.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Link
          href={`/models/lease/pricing?model=${encodeURIComponent(model)}`}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back
        </Link>
        <button
          onClick={() => enableModelMutation.mutate({ model })}
          disabled={enableModelMutation.isLoading}
          className="rounded-full bg-mf-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mf-green disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enableModelMutation.isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Enabling Model...</span>
            </div>
          ) : (
            "Enable Model"
          )}
        </button>
      </div>
    </div>
  );
}
