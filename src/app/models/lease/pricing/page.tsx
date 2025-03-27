"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { InfoIcon } from "lucide-react";

import { reactClient } from "@/trpc/react";

const COST_PER_GPU_PER_WEEK = 250;

function CostSummaryCard({
  model,
  requiredGPUS,
  totalCostUSD,
  selectedPayment,
  setSelectedPayment,
}: {
  model: string;
  requiredGPUS: bigint;
  totalCostUSD: number;
  selectedPayment: "onetime" | "subscription";
  setSelectedPayment: (type: "onetime" | "subscription") => void;
}) {
  return (
    <div className="rounded-xl border border-mf-silver-700 bg-mf-milk-500">
      <div className="border-b border-mf-silver-700 px-6 py-4">
        <h3 className="text-sm font-medium text-gray-900">
          Model Cost Summary
        </h3>
        <p className="pt-1 text-sm text-gray-500">{model}</p>
      </div>

      <div className="border-b border-mf-silver-700 px-6 py-4">
        <h4 className="text-sm font-medium text-gray-900">Payment Schedule</h4>
        <div className="mt-3 space-y-3">
          <button
            onClick={() => setSelectedPayment("onetime")}
            className={`group relative w-full rounded-lg border bg-mf-milk-500 p-3 text-left transition-all hover:shadow-sm ${
              selectedPayment === "onetime"
                ? "border-mf-blue-500 ring-1 ring-mf-blue-500"
                : "border-mf-silver-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  One-time Payment
                </p>
                <p className="text-xs text-gray-500">
                  Pay once for a week-long lease
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  $
                  {totalCostUSD % 1 === 0
                    ? Math.floor(totalCostUSD)
                    : totalCostUSD.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">total</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedPayment("subscription")}
            className={`group relative w-full rounded-lg border bg-mf-milk-500 p-3 text-left transition-all hover:shadow-sm ${
              selectedPayment === "subscription"
                ? "border-mf-blue-500 ring-1 ring-mf-blue-500"
                : "border-mf-silver-700 hover:border-gray-300"
            }`}
          >
            <div className="absolute -top-2 right-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              Recommended
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Weekly Subscription
                </p>
                <p className="text-xs text-gray-500">
                  Auto-renew weekly and save 10%
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  $
                  {totalCostUSD % 1 === 0
                    ? Math.floor(totalCostUSD * 0.9)
                    : (totalCostUSD * 0.9).toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">per week</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-1 px-6 py-4">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2">
          <dt className="flex items-center gap-1 text-sm text-gray-500">
            Required GPUs
            <div className="group relative">
              <InfoIcon className="h-4 w-4 text-gray-400" />
              <div className="absolute left-full top-full hidden pl-1 pt-1 group-hover:block">
                <div className="w-64 rounded-md bg-gray-900 px-3 py-2 text-xs text-mf-milk-300">
                  Required GPUs are calculated based on the model&apos;s maximum
                  memory usage utilizing Accelerate&apos;s estimate
                  functionality.
                </div>
              </div>
            </div>
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            {requiredGPUS.toString()}
          </dd>
        </div>
      </div>

      <div className="border-t border-mf-silver-700 px-6 py-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Cost Breakdown</h4>
          <p className="mt-1 text-sm text-gray-600">
            {selectedPayment === "subscription"
              ? `$${COST_PER_GPU_PER_WEEK * 0.9} per GPU per week`
              : `$${COST_PER_GPU_PER_WEEK} per GPU`}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <dt className="text-base font-medium text-gray-900">
              {selectedPayment === "subscription"
                ? "Weekly Cost"
                : "Total Cost"}
            </dt>
            <dd className="text-base font-medium text-gray-900">
              $
              {selectedPayment === "subscription"
                ? (totalCostUSD * 0.9) % 1 === 0
                  ? Math.floor(totalCostUSD * 0.9)
                  : (totalCostUSD * 0.9).toFixed(2)
                : totalCostUSD % 1 === 0
                  ? Math.floor(totalCostUSD)
                  : totalCostUSD.toFixed(2)}
              {selectedPayment === "subscription" && " per week"}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
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

  const [selectedPayment, setSelectedPayment] = useState<
    "onetime" | "subscription"
  >("subscription");

  if (!model) {
    router.replace("/models/lease");
    return null;
  }

  const requiredGPUS = BigInt(dbRequiredGpus.data ?? 0);
  const weeklyGPUCost = COST_PER_GPU_PER_WEEK * Number(requiredGPUS);
  const totalCostUSD = weeklyGPUCost;

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Step 2: Review Pricing
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Review the resource requirements and costs for your model
        </p>
      </div>

      <CostSummaryCard
        model={model}
        requiredGPUS={requiredGPUS}
        totalCostUSD={totalCostUSD}
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
      />

      {requiredGPUS > 8 && (
        <p className="rounded-md bg-yellow-50 p-3 text-yellow-700">
          Warning: This model requires {requiredGPUS.toString()} GPUs, which
          exceeds our limit of 8 GPUs. We will not be able to run this model.
        </p>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Link
          href="/models/lease"
          className="rounded-full border border-gray-300 bg-mf-milk-500 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back
        </Link>
        {user.data ? (
          <Link
            href={`/models/lease/confirm?model=${encodeURIComponent(model)}&payment=${selectedPayment}`}
            className={`rounded-full bg-mf-blue-500 px-4 py-2 text-sm font-semibold text-mf-milk-300 shadow-sm hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Continue to Payment
          </Link>
        ) : (
          <Link
            href={`/sign-in?redirect=${encodeURIComponent(
              `/models/lease/pricing?model=${encodeURIComponent(model)}`,
            )}`}
            className="inline-block rounded-full bg-mf-blue-500 px-4 py-2 text-center text-sm font-semibold text-mf-milk-300 shadow-sm hover:bg-opacity-90"
          >
            Sign in to Continue
          </Link>
        )}
      </div>
    </div>
  );
}
