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

  const [showAmounts, setShowAmounts] = useState<"credits" | "amounts">("amounts");
  const [showQR, setShowQR] = useState(false);

  const handleCopyAddress = () => {
    void copyToClipboard(env.NEXT_PUBLIC_DEPOSIT_ADDRESS);
    toast.success("Address copied to Clipboard");
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
                className="rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800"
              >
                Add Credits
              </button>
              <button
                onClick={() => {
                  if (!user.data?.ss58) {
                    router.push("/settings");
                    return;
                  }
                  setShowCryptoInput(!showCryptoInput);
                  setShowPurchaseInput(false);
                }}
                className="rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Use Crypto
              </button>
            </div>

            {showPurchaseInput && (
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">{"$"}</span>
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
                      className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="0"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">{"USD"}</span>
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
                    disabled={checkout.isLoading || !purchaseAmount}
                    className="w-full rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-50"
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
                    <InfoIcon className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
            )}

            {showCryptoInput && (
              <div className="flex flex-col gap-4 rounded-lg bg-gray-100 p-4">
                <p className="text-sm text-gray-700">
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
                      <p className="font-mono text-sm text-gray-700">
                        {env.NEXT_PUBLIC_DEPOSIT_ADDRESS.slice(0, 6)}...
                        {env.NEXT_PUBLIC_DEPOSIT_ADDRESS.slice(-4)}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <QrCode
                        onClick={() => setShowQR(!showQR)}
                        className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                        onMouseEnter={() => toast.info("Show/Hide QR Code")}
                        onMouseLeave={() => toast.dismiss()}
                      />
                      <CopyIcon
                        className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={handleCopyAddress}
                        onMouseEnter={() =>
                          toast.info("Copy Address to Clipboard")
                        }
                        onMouseLeave={() => toast.dismiss()}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4 text-gray-500" />
                  <p className="text-sm text-gray-700">
                    The funds will be credited to your account once they are
                    confirmed on the blockchain.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="text-sm font-semibold leading-tight text-[#101828]">
            Payment History
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAmounts("credits")}
              className={`rounded-lg px-3 py-1 text-xs ${showAmounts === "credits" ? "bg-black text-white" : "bg-gray-100"}`}
            >
              Credits
            </button>
            <button
              onClick={() => setShowAmounts("amounts")}
              className={`rounded-lg px-3 py-1 text-xs ${showAmounts === "amounts" ? "bg-black text-white" : "bg-gray-100"}`}
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
                  <td className="pr-4 text-xs text-[#101828] sm:text-sm">
                    <span className="hidden sm:inline">
                      {formatDate(payment.createdAt!)}
                    </span>
                    <span className="sm:hidden">
                      {payment.createdAt?.toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 text-right text-xs text-[#101828] sm:text-sm">
                    {showAmounts === "credits"
                      ? formatLargeNumber(payment.credits ?? 0)
                      : payment.type === "tao"
                        ? `${formatLargeNumber(payment.rao / 1e-9)} T`
                        : `$${formatLargeNumber(Math.ceil(Number(payment.credits ?? 0) / CREDIT_PER_DOLLAR))}`}
                  </td>
                  <td className="px-4 text-right text-xs text-[#101828] sm:text-sm">
                    <div>via {payment.type === "stripe" ? "Stripe" : "TAO"}</div>
                  </td>
                  <td className="px-4 text-center">
                    <div className="relative mx-auto flex h-5 w-8 items-center justify-center rounded border border-[#e4e7ec] bg-white p-1 sm:h-6 sm:w-10">
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
                          {payment.cardBrand?.toLowerCase() === "mastercard" && (
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