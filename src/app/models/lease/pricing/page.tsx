"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { InfoIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CREDIT_PER_DOLLAR } from "@/constants";
import { reactClient } from "@/trpc/react";

const COST_PER_GPU_PER_WEEK = 250;

type PurchaseButtonProps = {
  isLoading: boolean;
  onClick: () => void;
  amount: number;
  label?: string;
  className?: string;
  variant?: "primary" | "secondary";
};

function PurchaseButton({
  isLoading,
  onClick,
  amount,
  label = "Purchase Exact Amount",
  className = "",
  variant = "primary",
}: PurchaseButtonProps) {
  const baseStyles =
    "rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50";
  const variantStyles =
    variant === "primary"
      ? "bg-[#101828] text-white hover:bg-[#101828]/90 w-full"
      : "bg-mf-green text-white hover:bg-opacity-90 rounded-full";

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        `${label} - $${amount.toFixed(2)}`
      )}
    </button>
  );
}

function CostSummaryCard({
  model,
  requiredGPUS,
  totalCostUSD,
  userBalanceUSD,
  amountNeededUSD,
}: {
  model: string;
  requiredGPUS: bigint;
  totalCostUSD: number;
  userBalanceUSD: number;
  amountNeededUSD: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-sm font-medium text-gray-900">
          Model Cost Summary
        </h3>
        <p className="pt-1 text-sm text-gray-500">{model}</p>
      </div>

      <div className="border-b border-gray-200 px-6 py-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Immunity Period</h4>
          <p className="mt-1 text-sm text-gray-600">
            Standard 1-week immunity period
          </p>
          <p className="mt-1 text-xs text-gray-500">
            ${COST_PER_GPU_PER_WEEK} per GPU per week
          </p>
        </div>
      </div>

      <div className="space-y-1 px-6 py-4">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2">
          <dt className="text-sm text-gray-600">Required GPUs</dt>
          <dd className="text-sm font-medium text-gray-900">
            {requiredGPUS.toString()}
          </dd>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <dt className="text-base font-medium text-gray-900">Total Cost</dt>
          <dd className="text-base font-medium text-gray-900">
            ${totalCostUSD.toFixed(2)}
          </dd>
        </div>
      </div>

      {/* Balance Info */}
      <div className="rounded-b-xl border-t border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Your Balance</span>
          <span className="text-sm font-medium text-gray-900">
            ${userBalanceUSD.toFixed(2)}
          </span>
        </div>
        {amountNeededUSD > 0 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-red-600">
              Additional Amount Needed
            </span>
            <span className="text-sm font-medium text-red-600">
              ${amountNeededUSD.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const model = searchParams.get("model");
  const [purchaseAmount, setPurchaseAmount] = useState("");

  const user = reactClient.account.getUser.useQuery();
  const dbRequiredGpus = reactClient.model.getRequiredGpus.useQuery(
    model ?? "",
    {
      enabled: !!model,
    },
  );
  const checkout = reactClient.credits.checkout.useMutation({
    onError: (e) =>
      toast.error(`Failed getting checkout session: ${e.message}`),
    onSuccess: (url) => router.push(url),
  });

  if (!model) {
    router.replace("/models/lease/model");
    return null;
  }

  const requiredGPUS = BigInt(dbRequiredGpus.data ?? 0);
  const userBalanceUSD = Number(user.data?.credits ?? 0) / CREDIT_PER_DOLLAR;
  const immunityWeeks = 1;
  const weeklyGPUCost = COST_PER_GPU_PER_WEEK * Number(requiredGPUS);
  const totalCostUSD = weeklyGPUCost * immunityWeeks;
  const amountNeededUSD = Math.max(0, totalCostUSD - userBalanceUSD);

  const handlePurchaseExactAmount = () => {
    if (amountNeededUSD <= 0) return;
    const roundedAmount = Math.ceil(amountNeededUSD);
    checkout.mutate({
      purchaseAmount: roundedAmount,
      redirectTo: `/models/lease/pricing?model=${encodeURIComponent(model)}`,
    });
  };

  const handleCustomPurchase = () => {
    const amount = Number(purchaseAmount);
    if (amount < 5) {
      toast.error("Minimum purchase amount is $5");
      return;
    }
    checkout.mutate({
      purchaseAmount: amount,
      redirectTo: `/models/lease/pricing?model=${encodeURIComponent(model)}`,
    });
  };

  const handleContinue = () => {
    if (amountNeededUSD > 0) {
      const amount = Number(purchaseAmount);
      if (amount < 5) {
        toast.error("Minimum purchase amount is $5");
        return;
      }
      handleCustomPurchase();
      return;
    }
    router.push(
      `/models/lease/confirm?model=${encodeURIComponent(model)}&immunity=${immunityWeeks}`,
    );
  };

  const canContinue = !!(
    user.data &&
    requiredGPUS <= 8 &&
    (userBalanceUSD >= totalCostUSD ||
      (amountNeededUSD > 0 && Number(purchaseAmount) >= 5))
  );

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
        userBalanceUSD={userBalanceUSD}
        amountNeededUSD={amountNeededUSD}
      />

      {/* Purchase Section */}
      {user.data && amountNeededUSD > 0 && requiredGPUS <= 8 && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <label
              htmlFor="purchaseAmount"
              className="text-sm font-medium text-gray-900"
            >
              Purchase Amount
            </label>
            <div className="group relative">
              <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-500" />
              <div className="absolute right-0 top-6 z-10 hidden whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                Minimum purchase amount is $5
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              id="purchaseAmount"
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              min="0"
              className="block w-full rounded-lg border border-gray-300 py-2.5 pl-7 pr-12 text-gray-900 shadow-sm [appearance:textfield] focus:border-mf-green focus:outline-none focus:ring-1 focus:ring-mf-green sm:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="0.00"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>

          <PurchaseButton
            isLoading={checkout.isLoading}
            onClick={handlePurchaseExactAmount}
            amount={Math.ceil(amountNeededUSD)}
          />
        </div>
      )}

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
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back
        </Link>
        {user.data ? (
          <button
            onClick={handleContinue}
            disabled={!canContinue || checkout.isLoading}
            className="rounded-full bg-mf-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mf-green disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checkout.isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : amountNeededUSD > 0 ? (
              `Buy $${Number(purchaseAmount || 0).toFixed(2)}`
            ) : (
              "Continue to Confirmation"
            )}
          </button>
        ) : (
          <Link
            href={`/sign-in?redirect=${encodeURIComponent(
              `/models/lease/pricing?model=${encodeURIComponent(model)}`,
            )}`}
            className="inline-block rounded-full bg-mf-green px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mf-green"
          >
            Sign in to Continue
          </Link>
        )}
      </div>
    </div>
  );
}
