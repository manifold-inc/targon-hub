"use client";

import { useState } from "react";
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
  const [selectedPayment, setSelectedPayment] = useState<
    "onetime" | "subscription"
  >("subscription");

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
          Review lease details and choose your payment schedule
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

          {/* Payment Schedule Selection */}
          <div className="border-t border-gray-100 pt-4">
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-900">
                Choose Payment Schedule
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                Select how you would like to pay for this model lease
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setSelectedPayment("onetime")}
                className={`group relative w-full rounded-xl border-2 bg-white p-4 text-left transition-all hover:shadow-md ${
                  selectedPayment === "onetime"
                    ? "border-mf-green ring-1 ring-mf-green"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-base font-semibold text-gray-900">
                        One-time Payment
                      </h5>
                      <p className="mt-1 text-sm text-gray-600">
                        Pay once for a week-long lease
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${adjustedTotalCostUSD.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">total</div>
                    </div>
                  </div>
                  {selectedPayment === "onetime" && (
                    <div className="h-20 border-t border-gray-100 pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Lease End Date</span>
                          <span className="text-gray-900">
                            {immunityEndDate.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Your Balance</span>
                          <span className="text-gray-900">
                            ${userBalanceUSD.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-900">
                            Remaining Balance
                          </span>
                          <span className="text-gray-900">
                            ${remainingBalanceUSD.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedPayment("subscription")}
                className={`group relative w-full rounded-xl border-2 bg-white p-4 text-left transition-all hover:shadow-md ${
                  selectedPayment === "subscription"
                    ? "border-mf-green ring-1 ring-mf-green"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="absolute -top-2.5 right-4 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Recommended
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-base font-semibold text-gray-900">
                        Weekly Subscription
                      </h5>
                      <p className="mt-1 text-sm text-gray-600">
                        Auto-renew weekly to keep your model running
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${adjustedTotalCostUSD.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">per week</div>
                    </div>
                  </div>
                  {selectedPayment === "subscription" && (
                    <div className="h-20 border-t border-gray-100 pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            First Billing Date
                          </span>
                          <span className="text-gray-900">Today</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Next Billing Date
                          </span>
                          <span className="text-gray-900">
                            {immunityEndDate.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Your card will be charged weekly. Cancel anytime with
                          no penalties.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </dl>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pb-10">
        <Link
          href={`/models/lease/pricing?model=${encodeURIComponent(model)}`}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-mf-green focus:ring-offset-2"
        >
          Back
        </Link>
        <button
          onClick={() => {
            if (selectedPayment === "onetime") {
              leaseModelMutation.mutate({ model });
            } else {
              createSubscriptionMutation.mutate({
                modelName: model,
                gpuCount: Number(requiredGPUS),
              });
            }
          }}
          disabled={
            !selectedPayment ||
            leaseModelMutation.isLoading ||
            createSubscriptionMutation.isLoading
          }
          className="rounded-lg bg-mf-green px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-mf-green/90 focus:outline-none focus:ring-2 focus:ring-mf-green focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {leaseModelMutation.isLoading ||
          createSubscriptionMutation.isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : selectedPayment === "subscription" ? (
            "Start Subscription"
          ) : (
            "Confirm Lease"
          )}
        </button>
      </div>
    </div>
  );
}
