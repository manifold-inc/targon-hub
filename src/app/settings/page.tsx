"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import type { Signer } from "@polkadot/types/types";
import { Copy, CreditCard, Loader2, User, Wallet } from "lucide-react";
import { toast } from "sonner";

import { CREDIT_PER_DOLLAR } from "@/constants";
import { reactClient } from "@/trpc/react";
import { copyToClipboard, formatDate, formatLargeNumber } from "@/utils/utils";

let web3FromAddress: (address: string) => Promise<{ signer: Signer }>;
let web3Enable: (appName: string) => Promise<InjectedExtension[]>;
let web3Accounts: () => Promise<InjectedAccountWithMeta[]>;

if (typeof window !== "undefined") {
  void import("@polkadot/extension-dapp")
    .then((ext) => {
      web3FromAddress = ext.web3FromAddress;
      web3Enable = ext.web3Enable;
      web3Accounts = ext.web3Accounts;
    })
    .catch((error) => {
      console.error("Failed to load Polkadot extension:", error);
    });
}

export default function SettingsPage() {
  const user = reactClient.account.getUserDashboard.useQuery();
  const activity = reactClient.account.getUserActivity.useQuery(); // paginate and optional limit
  const keys = reactClient.core.getApiKeys.useQuery(); // get key?

  const [showSS58Input, setShowSS58Input] = useState(false);
  const [ss58Address, setSS58Address] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  const { mutateAsync: createPortalSession, isLoading } =
    reactClient.subscriptions.createPortalSession.useMutation();

  const handleBittensorLink = async () => {
    setIsLinking(true);
    try {
      // Initialize Polkadot extension
      const extensions = await web3Enable("Targon");
      if (extensions.length === 0) {
        toast.error(
          "No extension found. Please install the Polkadot.js extension.",
        );
        setIsLinking(false);
        return;
      }

      // Get all accounts from the extension
      const accounts = await web3Accounts();

      // Check if the provided address exists in the available accounts
      const accountExists = accounts.some(
        (account) => account.address === ss58Address,
      );
      if (!accountExists) {
        toast.error(
          "Address not found in your Polkadot.js extension. Please make sure you've added this account to your wallet.",
        );
        setIsLinking(false);
        return;
      }

      // get the challenge
      const challengeResponse = await fetch(
        `/sign-in/bittensor?ss58=${ss58Address}&userId=${user.data?.id}`,
      );
      const challenge = (await challengeResponse.json()) as {
        message?: string;
        error?: string;
      };

      if (!challengeResponse.ok) {
        toast.error("Failed to get challenge: " + challenge.error);
        console.error("Challenge response error:", challenge);
        setIsLinking(false);
        return;
      }

      if (!challenge.message) {
        toast.error("Failed to get challenge: " + challenge.error);
        setIsLinking(false);
        return;
      }

      const injector = await web3FromAddress(ss58Address);
      const signRaw = injector?.signer?.signRaw;

      if (!signRaw) {
        toast.error("Failed to get signer. Is your wallet connected?");
        setIsLinking(false);
        return;
      }

      const { signature } = await signRaw({
        address: ss58Address,
        data: challenge.message,
        type: "bytes",
      });
      const verifyResponse = await fetch(
        `/sign-in/bittensor/callback?ss58=${ss58Address}&signature=${signature}`,
      );

      const verify = (await verifyResponse.json()) as {
        success?: boolean;
        error?: string;
      };
      if (!verify.success) {
        if (verify.error?.includes("already linked")) {
          toast.error(
            "This Bittensor address is already linked to another account. Please use a different address.",
          );
        } else {
          toast.error("Failed to verify signature: " + verify.error);
        }
        console.error("Verification failed:", verify);
        setIsLinking(false);
        return;
      }

      toast.success("Bittensor account linked!");
      setShowSS58Input(false);
      setSS58Address("");
    } catch (error) {
      toast.error(
        `Error: ${error instanceof Error ? error.message : "An unexpected error occurred"}`,
      );
    } finally {
      setIsLinking(false);
    }
  };

  const handleManageSubscriptions = async () => {
    try {
      const url = await createPortalSession();
      if (url) window.location.href = url;
    } catch (error) {
      toast.error("Failed to open subscription portal");
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl lg:text-left">
        Dashboard
      </h2>
      <div className="flex flex-col py-2 sm:py-4">
        <div className="flex h-12 items-center justify-between sm:h-14">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden h-14 w-14 items-center justify-center rounded-full border-2 border-white shadow sm:flex">
              <User className="w-13 h-13" />
            </div>
            <div className="inline-flex flex-col items-start justify-center gap-1 sm:gap-2">
              <div className="text-sm text-black sm:text-base">
                {user.data?.email}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/sign-out"
              className="inline-flex h-8 items-center justify-center gap-1 rounded-full px-3 py-2 hover:bg-blue-50 sm:h-9"
              prefetch={false}
            >
              <span className="text-sm font-semibold leading-tight text-[#1d4ed8]">
                Change Email
              </span>
            </Link>
            <Link
              href="/sign-out"
              className="inline-flex h-8 items-center justify-center gap-1 rounded-full px-3 py-2 hover:bg-blue-50 sm:h-9"
              prefetch={false}
            >
              <span className="text-sm font-semibold leading-tight text-[#1d4ed8]">
                Change Password
              </span>
            </Link>
            <Link
              href="/sign-out"
              className="inline-flex h-8 items-center justify-center gap-1 rounded-full px-3 py-2 hover:bg-blue-50 sm:h-9"
              prefetch={false}
            >
              <span className="text-sm font-semibold leading-tight text-[#1d4ed8]">
                Logout
              </span>
            </Link>
          </div>
        </div>
      </div>
      <h1 className="mb-6 pt-8 text-xl font-semibold text-black">
        <Link href="/settings/credits">Credits</Link>
      </h1>

      <div className="flex flex-col gap-3 overflow-y-auto pb-8 sm:flex-row sm:flex-wrap sm:gap-6 sm:overflow-visible">
        <Link
          href="/settings/credits"
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 p-4 text-center hover:bg-gray-100 sm:h-12 sm:w-12 sm:gap-4 sm:p-6"
        >
          <p className="whitespace-nowrap text-lg font-medium leading-7 text-black">
            ${formatLargeNumber((user.data?.credits ?? 0) / CREDIT_PER_DOLLAR)}
          </p>
        </Link>
      </div>

      <h1 className="mb-6 pt-8 text-xl font-semibold text-black">
        <Link href="/settings/activity">Activity</Link>
      </h1>

      <div className="w-full">
        {activity.data?.length ? (
          <div className="relative h-80 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full border-0 text-xs sm:text-sm">
              <thead>
                <tr className="h-8 border-b border-[#e4e7ec] bg-gray-50">
                  <th className="px-2 py-1 text-center font-semibold leading-tight text-[#101828]">
                    Timestamp
                  </th>
                  <th className="px-2 py-1 text-center font-semibold leading-tight text-[#101828]">
                    Model
                  </th>
                  <th className="px-2 py-1 text-center font-semibold leading-tight text-[#101828]">
                    Response Tokens
                  </th>
                  <th className="px-2 py-1 text-center font-semibold leading-tight text-[#101828]">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {activity.data?.map((activity) => (
                  <tr
                    key={activity.createdAt.getTime()}
                    className="h-8 border-b border-[#e4e7ec] bg-white"
                  >
                    <td className="px-2 py-1 text-center leading-tight text-[#101828]">
                      {window.innerWidth < 640
                        ? activity.createdAt.toLocaleDateString()
                        : formatDate(activity.createdAt)}
                    </td>
                    <td className="max-w-40 truncate px-2 py-1 text-center leading-tight text-[#101828]">
                      {activity.model}
                    </td>
                    <td className="px-2 py-1 text-center leading-tight text-[#101828]">
                      {activity.responseTokens}
                    </td>
                    <td className="whitespace-nowrap px-2 py-1 text-center leading-tight text-[#101828]">
                      {activity.creditsUsed >= 1_000_000
                        ? `${(activity.creditsUsed / 1_000_000).toFixed(1)}M`
                        : formatLargeNumber(activity.creditsUsed)}{" "}
                      / ${(activity.creditsUsed / CREDIT_PER_DOLLAR).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No activity yet
          </div>
        )}
      </div>

      <h1 className="mb-6 pt-8 text-xl font-semibold text-black">
        <Link href="/settings/keys">Latest API Key</Link>
      </h1>

      <div className="flex flex-col gap-3 overflow-y-auto pb-8 sm:flex-row sm:flex-wrap sm:gap-6 sm:overflow-visible">
        <div
          className="flex h-12 w-96 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-50 p-4 text-center hover:bg-gray-100 sm:gap-4 sm:p-6"
          onClick={() => {
            void copyToClipboard(keys.data?.[0]?.key || "");
            toast("Copied API Key to Clipboard");
          }}
        >
          <p className="whitespace-nowrap leading-7 text-black">
            {keys.data?.[0]?.key || "No API key"}
          </p>
          <Copy className="h-4 w-4" />
        </div>
      </div>

      <h1 className="mb-6 pt-8 text-xl font-semibold text-black">
        Subscription
      </h1>

      <button
        onClick={handleManageSubscriptions}
        disabled={isLoading}
        className="inline-flex h-24 w-full flex-col items-start justify-center gap-2 rounded-xl bg-gray-50 p-4 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:h-32 sm:w-32 sm:gap-4 sm:p-6"
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <CreditCard className="h-6 w-6" />
        )}
        <p className="whitespace-break text-left text-sm leading-tight text-black">
          Manage Subscriptions
        </p>
      </button>

      <h1 className="mb-6 pt-8 text-xl font-semibold text-black">
        Link Bittensor
      </h1>

      {!user.data?.ss58 ? (
        !showSS58Input ? (
          <button
            onClick={() => setShowSS58Input(true)}
            className="inline-flex h-24 w-full flex-col items-start justify-center gap-2 rounded-xl bg-gray-50 p-4 hover:bg-gray-100 sm:h-32 sm:w-32 sm:gap-4 sm:p-6"
          >
            <Wallet className="h-6 w-6 text-black" />
            <p className="whitespace-nowrap text-left text-sm leading-tight text-black">
              Link Bittensor
            </p>
          </button>
        ) : (
          <div className="flex w-3/4 flex-col gap-2">
            <div className="flex w-full items-center">
              <input
                type="text"
                value={ss58Address}
                onChange={(e) => setSS58Address(e.target.value)}
                className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                placeholder="Enter your SS58 address"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowSS58Input(false);
                  setSS58Address("");
                }}
                className="flex h-9 items-center rounded-full border-2 border-white bg-white px-3 py-4 shadow hover:bg-gray-50"
              >
                <span className="flex items-center gap-2 px-0.5 text-sm font-semibold leading-tight text-black">
                  Cancel
                </span>
              </button>
              <button
                onClick={handleBittensorLink}
                disabled={isLinking || !ss58Address}
                className="flex h-9 items-center rounded-full border-2 border-white bg-[#101828] px-3 py-4 shadow hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex items-center gap-2 px-0.5 text-sm font-semibold leading-tight text-white">
                  {isLinking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Linking...
                    </>
                  ) : (
                    "Link"
                  )}
                </span>
              </button>
            </div>
          </div>
        )
      ) : null}
    </div>
  );
}
