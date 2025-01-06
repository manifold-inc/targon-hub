"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { InfoIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { COST_PER_GPU, CREDIT_PER_DOLLAR } from "@/constants";
import { reactClient } from "@/trpc/react";

type PurchaseButtonProps = {
  isLoading: boolean;
  onClick: () => void;
  amount: number;
  label?: string;
  className?: string;
};

function PurchaseButton({
  isLoading,
  onClick,
  amount,
  label = "Purchase Credits",
  className = "",
}: PurchaseButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full rounded-lg bg-[#101828] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#101828]/90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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

function SummaryCard({
  model,
  requiredGPUS,
  totalCostUSD,
  paymentType,
  userBalanceUSD,
}: {
  model: string;
  requiredGPUS: bigint;
  totalCostUSD: number;
  paymentType: "onetime" | "subscription";
  userBalanceUSD: number;
}) {
  const immunityEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const remainingBalanceUSD = userBalanceUSD - totalCostUSD;
  const hasEnoughCredits = remainingBalanceUSD >= 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-sm font-medium text-gray-900">Payment Summary</h3>
        <p className="pt-1 text-sm text-gray-500">{model}</p>
      </div>

      <div className="space-y-4 px-6 py-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Required GPUs</span>
          <span className="font-medium text-gray-900">
            {requiredGPUS.toString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Payment Type</span>
          <span className="font-medium text-gray-900">
            {paymentType === "subscription"
              ? "Weekly Subscription"
              : "One-time Payment"}
          </span>
        </div>

        {paymentType === "onetime" && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Lease End Date</span>
            <span className="font-medium text-gray-900">
              {immunityEndDate.toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {paymentType === "subscription" ? "Weekly Cost" : "Total Cost"}
          </span>
          <span className="font-medium text-gray-900">
            $
            {paymentType === "subscription"
              ? (totalCostUSD * 0.9).toFixed(2)
              : totalCostUSD.toFixed(2)}
          </span>
        </div>

        {paymentType === "subscription" ? (
          <p className="text-xs text-gray-500">
            Your card will be charged weekly. Cancel anytime with no penalties.
          </p>
        ) : (
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available Balance</span>
              <span className="font-medium text-gray-900">
                ${userBalanceUSD.toFixed(2)}
              </span>
            </div>
            {hasEnoughCredits ? (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining Balance</span>
                <span className="font-medium text-gray-900">
                  ${remainingBalanceUSD.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="font-medium text-red-600">
                  Additional Amount Needed
                </span>
                <span className="font-medium text-red-600">
                  ${Math.abs(remainingBalanceUSD).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const model = searchParams.get("model");
  const paymentType = searchParams.get("payment") as "onetime" | "subscription";
  const [purchaseAmount, setPurchaseAmount] = useState("");

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

  const createSubscriptionMutation =
    reactClient.subscriptions.createSubscription.useMutation({
      onSuccess: (url) => {
        toast.success("Subscription created successfully");
        router.push(url);
      },
      onError: (error) => {
        toast.error("Failed to create subscription: " + error.message);
      },
    });

  const checkout = reactClient.credits.checkout.useMutation({
    onError: (e) =>
      toast.error(`Failed getting checkout session: ${e.message}`),
    onSuccess: (url) => router.push(url),
  });

  if (!model || !paymentType) {
    router.replace("/models/lease");
    return null;
  }

  const requiredGPUS = BigInt(dbRequiredGpus.data ?? 0);
  const totalCost = requiredGPUS * COST_PER_GPU;
  const totalCostUSD = Number(totalCost) / CREDIT_PER_DOLLAR;
  const userBalanceUSD = Number(user.data?.credits ?? 0) / CREDIT_PER_DOLLAR;

  const handlePurchaseCredits = () => {
    const amount = Number(purchaseAmount);
    if (amount < 5) {
      toast.error("Minimum purchase amount is $5");
      return;
    }
    checkout.mutate({
      purchaseAmount: amount,
      redirectTo: `/models/lease/confirm?model=${encodeURIComponent(model)}&payment=${paymentType}`,
    });
  };

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Step 3: Complete Payment
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {paymentType === "subscription"
            ? "Set up your weekly subscription"
            : "Complete your one-time payment"}
        </p>
      </div>

      <SummaryCard
        model={model}
        requiredGPUS={requiredGPUS}
        totalCostUSD={totalCostUSD}
        paymentType={paymentType}
        userBalanceUSD={userBalanceUSD}
      />

      {paymentType === "onetime" && userBalanceUSD < totalCostUSD && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <PurchaseButton
            isLoading={checkout.isLoading}
            onClick={() => {
              const roundedAmount = Math.ceil(totalCostUSD);
              checkout.mutate({
                purchaseAmount: roundedAmount,
                redirectTo: `/models/lease/confirm?model=${encodeURIComponent(model)}&payment=${paymentType}`,
              });
            }}
            amount={Math.ceil(totalCostUSD)}
            label="Purchase Exact Amount"
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">
                or enter custom amount
              </span>
            </div>
          </div>

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
              className="block w-full rounded-lg border border-gray-300 py-2.5 pl-7 pr-12 text-gray-900 shadow-sm focus:border-mf-green focus:outline-none focus:ring-1 focus:ring-mf-green sm:text-sm"
              placeholder="0.00"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>

          <PurchaseButton
            isLoading={checkout.isLoading}
            onClick={handlePurchaseCredits}
            amount={Math.max(5, Number(purchaseAmount))}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Link
          href={`/models/lease/pricing?model=${encodeURIComponent(model)}`}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back
        </Link>
        <button
          onClick={() => {
            if (paymentType === "subscription") {
              createSubscriptionMutation.mutate({
                modelName: model,
                gpuCount: Number(requiredGPUS),
              });
            } else {
              leaseModelMutation.mutate({ model });
            }
          }}
          disabled={
            leaseModelMutation.isLoading ||
            createSubscriptionMutation.isLoading ||
            (paymentType === "onetime" && userBalanceUSD < totalCostUSD)
          }
          className="rounded-full bg-mf-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {leaseModelMutation.isLoading ||
          createSubscriptionMutation.isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : paymentType === "subscription" ? (
            "Set Up Subscription"
          ) : (
            "Complete Lease"
          )}
        </button>
      </div>
    </div>
  );
}
