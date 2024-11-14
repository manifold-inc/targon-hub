import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { InfoIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CREDIT_PER_DOLLAR, MIN_PURCHASE_IN_DOLLARS } from "@/constants";
import { reactClient } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { formatDate, formatLargeNumber } from "@/utils/utils";
import { WatchForSuccess } from "./WatchForStripeSuccess";

type CreditsTabProps = {
  user: RouterOutputs["account"]["getUserDashboard"];
};

export default function CreditsTab({ user }: CreditsTabProps) {
  const [showPurchaseInput, setShowPurchaseInput] = useState(false);
  const [useCredits, setUseCredits] = useState(false);
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

  const paymentHistory = reactClient.account.getUserPaymentHistory.useQuery();

  return (
    <div className="max-h-full overflow-y-auto py-2 sm:py-2">
      <WatchForSuccess />
      <div className="flex flex-col items-center justify-start gap-6">
        <span className="py-1 text-6xl leading-[72px] text-black">
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
            <button
              disabled={true}
              className="rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-sm font-semibold text-white shadow shadow-inner disabled:cursor-not-allowed disabled:opacity-50"
            >
              Use Crypto
            </button>
          </div>

          {showPurchaseInput && (
            <div className="flex flex-col gap-4 pt-2">
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

              <div className="flex w-full items-center justify-center gap-2">
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
                  className="w-full rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-sm font-semibold text-white shadow shadow-inner disabled:cursor-not-allowed disabled:opacity-50"
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
                <InfoIcon
                  className="h-4 w-4 text-gray-500"
                  onMouseEnter={() =>
                    toast.info(
                      `1 USD = ${formatLargeNumber(CREDIT_PER_DOLLAR)} Credits`,
                    )
                  }
                  onMouseLeave={() => toast.dismiss()}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="py-4 text-sm font-semibold leading-tight text-[#101828]">
        Payment History
      </div>
      <div className="flex max-h-40 flex-col gap-1 overflow-y-auto whitespace-nowrap">
        {paymentHistory.data?.map((payment) => (
          <div
            key={payment.createdAt?.getTime()}
            className="inline-flex h-12 flex-wrap items-center justify-between bg-white py-3 sm:inline-flex sm:flex-nowrap"
          >
            <div className="w-16 text-xs leading-tight text-[#101828] sm:w-24 sm:text-sm">
              {formatDate(payment.createdAt!)}
            </div>
            <div className="w-16 text-right text-xs leading-tight text-[#101828] sm:w-20 sm:text-sm">
              {formatLargeNumber(payment.credits)} ($
              {Math.ceil(Number(payment.credits) / CREDIT_PER_DOLLAR)})
            </div>
            <div className="hidden w-24 text-right text-sm leading-tight text-[#101828] sm:block">
              via Stripe
            </div>
            <div className="flex h-6 items-center justify-end gap-1 sm:gap-3">
              <div className="relative flex h-5 w-8 items-center justify-center rounded border border-[#e4e7ec] bg-white p-1 sm:h-6 sm:w-10">
                {payment.cardBrand?.toLowerCase() === "amex" && (
                  <Image
                    src="/cards/Amex.svg"
                    alt="American Express"
                    width={28}
                    height={28}
                    className="sm:h-[36px] sm:w-[36px]"
                  />
                )}
                {payment.cardBrand?.toLowerCase() === "mastercard" && (
                  <Image
                    src="/cards/Mastercard.svg"
                    alt="Mastercard"
                    width={28}
                    height={28}
                    className="sm:h-[36px] sm:w-[36px]"
                  />
                )}
                {payment.cardBrand?.toLowerCase() === "visa" && (
                  <Image
                    src="/cards/Visa.svg"
                    alt="Visa"
                    width={28}
                    height={28}
                    className="sm:h-[36px] sm:w-[36px]"
                  />
                )}
                {payment.cardBrand?.toLowerCase() === "discover" && (
                  <Image
                    src="/cards/Discover.svg"
                    alt="Discover"
                    width={28}
                    height={28}
                    className="sm:h-[36px] sm:w-[36px]"
                  />
                )}
              </div>
              <div className="text-right text-xs leading-tight text-[#101828] sm:text-sm">
                *** {payment.cardLast4 ?? "N/A"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
