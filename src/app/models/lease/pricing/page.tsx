"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { InfoIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { COST_PER_GPU, CREDIT_PER_DOLLAR } from "@/constants";
import { reactClient } from "@/trpc/react";

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const model = searchParams.get("model");

  const [purchaseAmount, setPurchaseAmount] = useState<string>("");

  const user = reactClient.account.getUser.useQuery();
  const dbRequiredGpus = reactClient.model.getRequiredGpus.useQuery(
    model ?? "",
    {
      enabled: !!model,
    },
  );
  const checkout = reactClient.credits.checkout.useMutation({
    onError: (e) => {
      toast.error(`Failed getting checkout session: ${e.message}`);
    },
    onSuccess: (url) => {
      router.push(url);
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
  const amountNeededUSD = totalCostUSD - userBalanceUSD;

  const handleExactAmountPurchase = () => {
    checkout.mutate({
      purchaseAmount: Number(amountNeededUSD.toFixed(2)),
      redirectTo: `/models/lease/pricing?model=${encodeURIComponent(model)}`,
    });
  };

  const handleCustomAmountPurchase = () => {
    checkout.mutate({
      purchaseAmount: Number(Number(purchaseAmount).toFixed(2)),
      redirectTo: `/models/lease/pricing?model=${encodeURIComponent(model)}`,
    });
  };

  const handleContinue = () => {
    if (amountNeededUSD > 0) {
      handleCustomAmountPurchase();
      return;
    }
    router.push(`/models/lease/confirm?model=${encodeURIComponent(model)}`);
  };

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Step 2: Review Pricing
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Review the resource requirements and costs for your model
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col items-start gap-2 border-b pb-4">
          <h3 className="text-sm font-medium text-gray-900">
            Model Cost Summary
          </h3>
          <p className="text-sm text-gray-500">{model}</p>
        </div>

        <dl className="mt-4 space-y-4">
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Required GPUs</dt>
            <dd className="text-sm font-medium text-gray-900">
              {requiredGPUS.toString()}
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
            {amountNeededUSD > 0 && (
              <div className="mt-2 flex justify-between text-red-600">
                <span className="text-sm font-medium">
                  Additional Amount Needed
                </span>
                <span className="text-sm font-medium">
                  ${amountNeededUSD.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Purchase Section */}
      {user.data && amountNeededUSD > 0 && requiredGPUS <= 8 && (
        <div className="mx-auto w-full max-w-md space-y-4">
          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="purchaseAmount" className="text-sm text-gray-700">
                Purchase Amount
              </label>
              <div className="group relative">
                <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                <div className="absolute right-0 top-6 z-10 hidden whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                  Minimum purchase amount is $5
                </div>
              </div>
            </div>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="purchaseAmount"
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                step="0.01"
                min="0"
                className="block w-full rounded-lg border-0 py-2.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 [appearance:textfield] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="0.00"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <button
            onClick={handleExactAmountPurchase}
            disabled={checkout.isLoading}
            className="w-full rounded-lg bg-[#101828] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#101828]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101828] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checkout.isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              `Purchase Exact Amount - $${amountNeededUSD.toFixed(2)}`
            )}
          </button>
        </div>
      )}

      {/* GPU Warning */}
      {requiredGPUS > 8 && (
        <p className="rounded-md bg-yellow-50 p-3 text-yellow-700">
          Warning: This model requires {requiredGPUS.toString()} GPUs, which
          exceeds our limit of 8 GPUs. We will not be able to run this model.
        </p>
      )}

      {/* Navigation Buttons */}
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
            disabled={
              requiredGPUS > 8 || (amountNeededUSD > 0 && !purchaseAmount)
            }
            className="rounded-full bg-mf-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mf-green disabled:cursor-not-allowed disabled:opacity-50"
          >
            {amountNeededUSD > 0
              ? `Buy $${Number(purchaseAmount || 0).toFixed(2)}`
              : "Continue to Confirmation"}
          </button>
        ) : (
          <Link
            href="/sign-in"
            className="inline-block rounded-full bg-mf-green px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mf-green"
          >
            Sign in to Continue
          </Link>
        )}
      </div>
    </div>
  );
}
