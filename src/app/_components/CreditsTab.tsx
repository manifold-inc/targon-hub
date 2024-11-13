import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CREDIT_PER_DOLLAR, MIN_PURCHASE_IN_DOLLARS } from "@/constants";
import { reactClient } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { formatLargeNumber } from "@/utils/utils";
import { WatchForSuccess } from "./WatchForStripeSuccess";

type CreditsTabProps = {
  user: RouterOutputs["account"]["getUserDashboard"];
};

export default function CreditsTab({ user }: CreditsTabProps) {
  const [showPurchaseInput, setShowPurchaseInput] = useState(false);
  const [useCredits, setUseCredits] = useState(true);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const pathName = usePathname();
  const router = useRouter();
  const checkout = reactClient.credits.checkout.useMutation({
    onError: (e) => {
      toast.error(`Failed getting checkout session: ${e.message}`);
    },
    onSuccess: (url) => {
      router.push(url);
    },
  });

  return (
    <div className="py-2 sm:py-4">
      <WatchForSuccess />
      <div className="flex flex-col items-center justify-start gap-6">
        <span className="py-6 text-6xl leading-[72px] text-black">
          {formatLargeNumber(user?.credits ?? 0)}
        </span>

        <div className="flex flex-col gap-4">
          <div className="flex gap-6">
            <button
              onClick={() => setShowPurchaseInput(!showPurchaseInput)}
              className="rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-sm font-semibold text-white shadow shadow-inner"
            >
              Add Credits
            </button>
            <button disabled={true} className="disabled:cursor-not-allowed disabled:opacity-50 rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-sm font-semibold text-white shadow shadow-inner">
              Use Crypto
            </button>
          </div>

          {showPurchaseInput && (
            <div className="mt-2 flex flex-col gap-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setUseCredits(false)}
                  className={`rounded-lg px-4 py-2 text-sm ${!useCredits ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                >
                  Dollars
                </button>
                <button
                  onClick={() => setUseCredits(true)}
                  className={`rounded-lg px-4 py-2 text-sm ${useCredits ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                >
                  Credits
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">
                      {useCredits ? "C" : "$"}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={purchaseAmount}
                    onChange={(e) =>
                      setPurchaseAmount(
                        Number(e.target.value.replace(/[^0-9]/g, "")),
                      )
                    }
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="0"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">
                      {useCredits ? "Credits" : "USD"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const dollarAmount = useCredits
                    ? Math.ceil(purchaseAmount / CREDIT_PER_DOLLAR)
                    : purchaseAmount;

                  if (dollarAmount < MIN_PURCHASE_IN_DOLLARS) {
                    toast.error(
                      `Must purchase a minimum of $${MIN_PURCHASE_IN_DOLLARS} or ${formatLargeNumber(MIN_PURCHASE_IN_DOLLARS * CREDIT_PER_DOLLAR)} credits`,
                    );
                    return;
                  }

                  checkout.mutate({
                    purchaseAmount: dollarAmount,
                    redirectTo: pathName + "?settings=true&tab=credits",
                  });
                }}
                disabled={checkout.isLoading}
                className="rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-sm font-semibold text-white shadow shadow-inner disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkout.isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    Purchase{" "}
                    {purchaseAmount === 0
                      ? useCredits
                        ? "Credits"
                        : "Dollars"
                      : useCredits
                        ? `${formatLargeNumber(BigInt(purchaseAmount))} Credits`
                        : `$${purchaseAmount}`}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
