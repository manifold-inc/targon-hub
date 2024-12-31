"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { COST_PER_GPU, CREDIT_PER_DOLLAR } from "@/constants";
import { reactClient } from "@/trpc/react";

type SummaryRowProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

function SummaryRow({ label, value, highlight }: SummaryRowProps) {
  const textClass = highlight
    ? "text-sm font-medium text-gray-900"
    : "text-sm text-gray-600";
  return (
    <div className="flex justify-between">
      <span className={textClass}>{label}</span>
      <span className={`${textClass} font-medium`}>{value}</span>
    </div>
  );
}

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const model = searchParams.get("model");
  const immunityWeeks = Number(searchParams.get("immunity") ?? 1);

  const user = reactClient.account.getUser.useQuery();
  const dbRequiredGpus = reactClient.model.getRequiredGpus.useQuery(
    model ?? "",
    {
      enabled: !!model,
    },
  );

  const leaseModelMutation = reactClient.credits.leaseModel.useMutation({
    onSuccess: () => {
      toast.success("Model leased successfully");
      router.push(`/models/${encodeURIComponent(model!)}`);
    },
    onError: (error) => {
      toast.error("Failed to lease model: " + error.message);
    },
  });

  if (!model) {
    router.replace("/models/lease");
    return null;
  }

  const requiredGPUS = BigInt(dbRequiredGpus.data ?? 0);
  const totalCost = requiredGPUS * COST_PER_GPU;
  const totalCostUSD = Number(totalCost) / CREDIT_PER_DOLLAR;
  const adjustedTotalCostUSD = totalCostUSD;
  const userBalanceUSD = Number(user.data?.credits ?? 0) / CREDIT_PER_DOLLAR;
  const remainingBalanceUSD = userBalanceUSD - adjustedTotalCostUSD;
  const immunityEndDate = new Date(
    Date.now() + immunityWeeks * 7 * 24 * 60 * 60 * 1000,
  );

  return (
    <div className="flex flex-col gap-4 py-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Step 3: Confirm Lease
        </h2>
        <p className="pt-1 text-sm text-gray-600">
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

        <dl className="space-y-4 pt-4">
          <SummaryRow label="Required GPUs" value={requiredGPUS.toString()} />
          <SummaryRow
            label="Immunity Period"
            value={immunityEndDate.toLocaleDateString()}
          />
          <div className="border-t border-gray-100 pt-4">
            <SummaryRow
              label="Total Cost"
              value={`$${adjustedTotalCostUSD.toFixed(2)}`}
              highlight
            />
          </div>
        </dl>

        {/* Balance Section */}
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          <SummaryRow
            label="Your Balance"
            value={`$${userBalanceUSD.toFixed(2)}`}
          />
          <SummaryRow
            label="Remaining Balance"
            value={`$${remainingBalanceUSD.toFixed(2)}`}
            highlight
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pb-10">
        <Link
          href={`/models/lease/pricing?model=${encodeURIComponent(model)}`}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back
        </Link>
        <button
          onClick={() => leaseModelMutation.mutate({ model })}
          disabled={leaseModelMutation.isLoading}
          className="rounded-full bg-mf-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mf-green disabled:cursor-not-allowed disabled:opacity-50"
        >
          {leaseModelMutation.isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Adding Model...</span>
            </div>
          ) : (
            "Add Model"
          )}
        </button>
      </div>
    </div>
  );
}
