"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { CopyIcon, InfoIcon, Loader2, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

import { CREDIT_PER_DOLLAR, MIN_PURCHASE_IN_DOLLARS } from "@/constants";
import { env } from "@/env.mjs";
import { reactClient } from "@/trpc/react";
import { copyToClipboard, formatDate, formatLargeNumber } from "@/utils/utils";
import { WatchForSuccess } from "../../_components/WatchForStripeSuccess";

type TaoConversion = {
  taoAmount: number;
  usdAmount: number;
  creditAmount: number;
};

export default function CreditsPage() {
  const [showPurchaseInput, setShowPurchaseInput] = useState(false);
  const [showCryptoInput, setShowCryptoInput] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState<number | null>(null);
  const pathName = usePathname();
  const router = useRouter();
  const user = reactClient.account.getUserDashboard.useQuery();
  const checkout = reactClient.credits.checkout.useMutation({
    onError: (e) => {
      toast.error(`Failed getting checkout session: ${e.message}`);
    },
    onSuccess: (url) => {
      router.push(url);
    },
  });

  const paymentHistory = reactClient.account.getUserPaymentHistory.useQuery();

  const [showAmounts, setShowAmounts] = useState<"credits" | "amounts">(
    "amounts",
  );
  const [showQR, setShowQR] = useState(false);

  const [taoConversion, setTaoConversion] = useState<TaoConversion>({
    taoAmount: 0,
    usdAmount: 0,
    creditAmount: 0,
  });

  const taoPrice = reactClient.account.getTaoPrice.useQuery(undefined, {
    enabled: showCryptoInput,
    refetchInterval: 60000, // Refetch every minute
  });

  const handleCopyAddress = () => {
    void copyToClipboard(env.NEXT_PUBLIC_DEPOSIT_ADDRESS);
    toast.success("Address copied to Clipboard");
  };

  const handleTaoAmountChange = (amount: string) => {
    const taoAmount = parseFloat(amount) || 0;
    const usdAmount = taoAmount * (taoPrice.data ?? 0);
    const creditAmount = usdAmount * CREDIT_PER_DOLLAR;

    setTaoConversion({
      taoAmount,
      usdAmount,
      creditAmount,
    });
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">Credits</h1>
      <div className="max-h-full overflow-y-auto py-2 sm:py-2">
        <WatchForSuccess />
        <div className="flex flex-col items-center justify-start gap-6">
          <span className="py-1 text-6xl leading-[72px] text-black">
            ${formatLargeNumber((user.data?.credits ?? 0) / CREDIT_PER_DOLLAR)}
          </span>

          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-6">
              <button
                onClick={() => {
                  setShowPurchaseInput(!showPurchaseInput);
                  setShowCryptoInput(false);
                }}
                className="rounded-full border border-black bg-mf-milk-300 px-3 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
                disabled={true}
              >
                Add Credits
              </button>
              <button
                onClick={() => {
                  if (!user.data?.ss58) {
                    toast.error("Please link your Bittensor account first");
                    router.push("/settings");
                    return;
                  }
                  setShowCryptoInput(!showCryptoInput);
                  setShowPurchaseInput(false);
                }}
                className="rounded-full border border-black bg-mf-milk-300 px-3 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
                disabled={true}
              >
                Use Crypto
              </button>
            </div>

            {showPurchaseInput && (
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-mf-ash-500 sm:text-sm">{"$"}</span>
                    </div>
                    <input
                      type="text"
                      value={purchaseAmount ?? ""}
                      onChange={(e) =>
                        setPurchaseAmount(
                          e.target.value.length === 0
                            ? null
                            : Number(e.target.value.replace(/[^0-9]/g, "")),
                        )
                      }
                      className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-mf-ash-700 ring-1 ring-inset ring-mf-silver-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder="0"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-mf-ash-500 sm:text-sm">
                        {"USD"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex w-full items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      if (!purchaseAmount) {
                        return;
                      }
                      if (purchaseAmount < MIN_PURCHASE_IN_DOLLARS) {
                        toast.error(
                          `Must purchase a minimum of $${MIN_PURCHASE_IN_DOLLARS} or ${formatLargeNumber(MIN_PURCHASE_IN_DOLLARS * CREDIT_PER_DOLLAR)} credits`,
                        );
                        return;
                      }

                      checkout.mutate({
                        purchaseAmount,
                        redirectTo: pathName,
                      });
                    }}
                    disabled={/*checkout.isLoading || !purchaseAmount*/ true}
                    className="w-full rounded-full border border-gray-800 bg-[#101828] px-4 py-2.5 text-sm font-semibold text-mf-milk-300 shadow-sm transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {checkout.isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        Purchase{" "}
                        {!purchaseAmount ? "Credits" : `$${purchaseAmount}`}
                      </>
                    )}
                  </button>
                  <div className="group relative">
                    <span className="pointer-events-none absolute left-1/2 m-4 mx-auto hidden w-max max-w-sm -translate-x-1/2 translate-y-1/4 text-wrap rounded-md bg-gray-800 p-1.5 text-center text-sm text-gray-100 opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                      {`$1 USD is ${formatLargeNumber(CREDIT_PER_DOLLAR)} Credits`}
                    </span>
                    <InfoIcon className="h-4 w-4 text-mf-ash-500" />
                  </div>
                </div>
              </div>
            )}

            {showCryptoInput && (
              <>
                <div className="flex flex-col gap-4 rounded-lg bg-mf-milk-100 p-4">
                  <p className="text-sm text-mf-ash-500">
                    Please send your payment to the following address:
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex w-full items-center justify-between rounded bg-gray-200 p-3">
                      {showQR ? (
                        <QRCodeSVG
                          value={env.NEXT_PUBLIC_DEPOSIT_ADDRESS}
                          size={120}
                          bgColor="#f3f4f6"
                          fgColor="#101828"
                          level="L"
                          className="mx-auto"
                        />
                      ) : (
                        <p className=" text-sm text-mf-ash-500">
                          {env.NEXT_PUBLIC_DEPOSIT_ADDRESS.slice(0, 6)}...
                          {env.NEXT_PUBLIC_DEPOSIT_ADDRESS.slice(-6)}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="group relative">
                          <QrCode
                            onClick={() => setShowQR(!showQR)}
                            className="h-4 w-4 cursor-pointer text-mf-ash-500 hover:text-mf-ash-500"
                          />
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-mf-milk-300 opacity-0 transition before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-800 before:content-[''] group-hover:opacity-100">
                            Show/Hide QR Code
                          </span>
                        </div>

                        <div className="group relative">
                          <CopyIcon
                            className="h-4 w-4 cursor-pointer text-mf-ash-500 hover:text-mf-ash-500"
                            onClick={handleCopyAddress}
                          />
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-mf-milk-300 opacity-0 transition before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-800 before:content-[''] group-hover:opacity-100">
                            Copy Address to Clipboard
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <InfoIcon className="h-4 w-4 text-mf-ash-500" />
                    <p className="text-sm text-mf-ash-500">
                      The funds will be credited to your account once they are
                      confirmed on the blockchain.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 rounded-lg bg-mf-milk-100 p-4">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
                    <h3 className="text-sm font-medium text-mf-ash-700">
                      TAO Payment Calculator
                    </h3>
                    <div className="flex items-center gap-2 self-start rounded-full bg-gray-200 px-3 py-1 sm:self-auto">
                      <span className="text-xs font-medium text-gray-600">
                        Current Price:
                      </span>
                      <span className="text-sm font-semibold text-black">
                        ${(taoPrice.data ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={taoConversion.taoAmount || ""}
                          onChange={(e) =>
                            handleTaoAmountChange(e.target.value)
                          }
                          placeholder="Enter TAO amount"
                          className="block w-full rounded-md border-0 px-4 py-2.5 text-mf-ash-700 ring-1 ring-inset ring-mf-silver-700 [appearance:textfield] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-mf-ash-500">
                          TAO
                        </span>
                      </div>
                    </div>

                    <div className="rounded bg-gray-200 p-3">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-mf-ash-500">
                            USD Value
                          </span>
                          <span className="text-lg font-semibold text-black">
                            $
                            {taoConversion.usdAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-mf-ash-500">
                            Credits
                          </span>
                          <span className="text-lg font-semibold text-black">
                            {Math.floor(
                              taoConversion.creditAmount,
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-mf-ash-500">
                    <InfoIcon className="h-4 w-4" />
                    <span>
                      Price updates on each calculation. Actual conversion rate
                      may vary slightly at time of transaction.
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="text-sm font-semibold leading-tight text-mf-ash-700">
            Payment History
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAmounts("credits")}
              className={`rounded-lg px-3 py-1 text-xs ${showAmounts === "credits" ? "bg-black text-mf-milk-300" : "bg-mf-milk-100"}`}
            >
              Credits
            </button>
            <button
              onClick={() => setShowAmounts("amounts")}
              className={`rounded-lg px-3 py-1 text-xs ${showAmounts === "amounts" ? "bg-black text-mf-milk-300" : "bg-mf-milk-100"}`}
            >
              USD/TAO
            </button>
          </div>
        </div>

        <div className="max-h-40 overflow-y-auto">
          <table className="w-full whitespace-nowrap">
            <tbody>
              {paymentHistory.data?.map((payment) => (
                <tr key={payment.createdAt?.getTime()} className="h-12">
                  <td className="pr-4 text-xs text-mf-ash-700 sm:text-sm">
                    <span className="hidden sm:inline">
                      {formatDate(payment.createdAt!)}
                    </span>
                    <span className="sm:hidden">
                      {payment.createdAt?.toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 text-right text-xs text-mf-ash-700 sm:text-sm">
                    {showAmounts === "credits"
                      ? formatLargeNumber(payment.credits ?? 0)
                      : payment.type === "tao"
                        ? `${formatLargeNumber(payment.rao / 1e-9)} T`
                        : `$${formatLargeNumber(Math.ceil(Number(payment.credits ?? 0) / CREDIT_PER_DOLLAR))}`}
                  </td>
                  <td className="px-4 text-right text-xs text-mf-ash-700 sm:text-sm">
                    <div>
                      via {payment.type === "stripe" ? "Stripe" : "TAO"}
                    </div>
                  </td>
                  <td className="px-4 text-center">
                    <div className="relative mx-auto flex h-5 w-8 items-center justify-center rounded border border-mf-silver-700 bg-mf-milk-300 p-1 sm:h-6 sm:w-10">
                      {payment.type === "stripe" ? (
                        <>
                          {payment.cardBrand?.toLowerCase() === "amex" && (
                            <Image
                              src="/cards/Amex.svg"
                              alt="American Express"
                              width={24}
                              height={24}
                              className="h-3 w-4 sm:h-4 sm:w-6"
                            />
                          )}
                          {payment.cardBrand?.toLowerCase() === "visa" && (
                            <Image
                              src="/cards/Visa.svg"
                              alt="Visa"
                              width={24}
                              height={24}
                              className="h-3 w-4 sm:h-4 sm:w-6"
                            />
                          )}
                          {payment.cardBrand?.toLowerCase() ===
                            "mastercard" && (
                            <Image
                              src="/cards/Mastercard.svg"
                              alt="Mastercard"
                              width={24}
                              height={24}
                              className="h-3 w-4 sm:h-4 sm:w-6"
                            />
                          )}
                        </>
                      ) : (
                        <Image
                          src="/cards/Tao.svg"
                          alt="TAO"
                          width={24}
                          height={24}
                          className="h-3 w-4 sm:h-4 sm:w-6"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
