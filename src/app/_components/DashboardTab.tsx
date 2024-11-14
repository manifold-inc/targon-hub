import Link from "next/link";
import { Key, LineChart, Loader2, User, Wallet } from "lucide-react";
import { useState } from "react";
import { web3Enable, web3FromAddress } from "@polkadot/extension-dapp";

import { type RouterOutputs } from "@/trpc/shared";
import { formatLargeNumber } from "@/utils/utils";
import { toast } from "sonner";

type DashboardTabProps = {
  user: RouterOutputs["account"]["getUserDashboard"];
  onTabChange: (tab: "dashboard" | "credits" | "activity" | "keys") => void;
};

export default function DashboardTab({ user, onTabChange }: DashboardTabProps) {
  const [showSS58Input, setShowSS58Input] = useState(false);
  const [ss58Address, setSS58Address] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  const handleBittensorLink = async () => {
    setIsLinking(true);
    try {
      // Initialize Polkadot extension
      const extensions = await web3Enable('Targon');
      if (extensions.length === 0) {
        toast.error("No extension found. Please install the Polkadot.js extension.");
        setIsLinking(false);
        return;
      }

      // Get all accounts from the extension
      const { web3Accounts } = await import('@polkadot/extension-dapp');
      const accounts = await web3Accounts();
      
      // Check if the provided address exists in the available accounts
      const accountExists = accounts.some(account => account.address === ss58Address);
      if (!accountExists) {
        toast.error("Address not found in your Polkadot.js extension. Please make sure you've added this account to your wallet.");
        setIsLinking(false);
        return;
      }

      // get the challenge
      const challengeResponse = await fetch(
        `/sign-in/bittensor?ss58=${ss58Address}&userId=${user?.id}`,
      );
      const challenge = await challengeResponse.json() as { message?: string; error?: string };

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

      const verify = await verifyResponse.json() as { success?: boolean; error?: string };
      if (!verify.success) {
        if (verify.error?.includes("already linked")) {
          toast.error("This Bittensor address is already linked to another account. Please use a different address.");
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
      toast.error(`Error: ${error instanceof Error ? error.message : "An unexpected error occurred"}`);
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="py-2 sm:py-4 h-full flex flex-col">
      <div className="flex h-12 items-center justify-between sm:h-14">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden h-14 w-14 items-center justify-center rounded-full border-2 border-white shadow sm:flex">
            <User className="w-13 h-13" />
          </div>
          <div className="inline-flex flex-col items-start justify-center gap-1 sm:gap-2">
            <div className="text-sm text-black sm:text-base">{user?.email}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex hidden h-8 items-center justify-center gap-1 rounded-full px-3 py-2 hover:bg-blue-50 sm:h-9">
            <span className="text-sm font-semibold leading-tight text-[#004eea]">
              Manage
            </span>
          </button>
          <Link
            href="/sign-out"
            className="inline-flex h-8 items-center justify-center gap-1 rounded-full px-3 py-2 hover:bg-blue-50 sm:h-9"
            prefetch={false}
          >
            <span className="text-sm font-semibold leading-tight text-[#004eea]">
              Logout
            </span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 py-4 overflow-y-auto sm:overflow-visible sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
        <button
          onClick={() => onTabChange("credits")}
          className="inline-flex h-24 w-full flex-col items-start justify-center gap-2 rounded-xl bg-gray-50 p-4 hover:bg-gray-100 sm:h-32 sm:w-32 sm:gap-4 sm:p-6"
        >
          <p className="whitespace-nowrap text-lg font-medium leading-7 text-black">
            {formatLargeNumber(user?.credits ?? 0)}
          </p>
          <p className="text-sm leading-tight text-black">Credits</p>
        </button>
        <button
          onClick={() => onTabChange("activity")}
          className="inline-flex h-24 w-full flex-col items-start justify-center gap-2 rounded-xl bg-gray-50 p-4 hover:bg-gray-100 sm:h-32 sm:w-32 sm:gap-4 sm:p-6"
        >
          <LineChart className="h-6 w-6" />
          <p className="text-sm leading-tight text-black">Live Activity</p>
        </button>
        <button
          onClick={() => onTabChange("keys")}
          className="inline-flex h-24 w-full flex-col items-start justify-center gap-2 rounded-xl bg-gray-50 p-4 hover:bg-gray-100 sm:h-32 sm:w-32 sm:gap-4 sm:p-6"
        >
          <Key className="h-6 w-6" />
          <p className="text-sm leading-tight text-black">
            {user?.apiKeyCount} Keys
          </p>
        </button>
        {!user?.ss58 ? (
          !showSS58Input ? (
            <button
              onClick={() => setShowSS58Input(true)}
              className="inline-flex h-24 w-full flex-col items-start justify-center gap-2 rounded-xl bg-gray-50 p-4 hover:bg-gray-100 sm:h-32 sm:w-32 sm:gap-4 sm:p-6"
            >
              <Wallet className="h-6 w-6 text-black" />
              <p className="text-sm leading-tight text-black text-left whitespace-nowrap">
                Link Bittensor
              </p>
            </button>
          ) : (
            <div className="flex flex-col gap-2 w-3/4">
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={ss58Address}
                  onChange={(e) => setSS58Address(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  placeholder="Enter your SS58 address"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBittensorLink}
                  disabled={isLinking}
                  className="flex-1 rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLinking ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Linking...</span>
                    </div>
                  ) : (
                    "Confirm"
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowSS58Input(false);
                    setSS58Address("");
                  }}
                  disabled={isLinking}
                  className="flex-1 rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="inline-flex h-24 w-full flex-col items-start justify-center gap-2 rounded-xl bg-gray-50 p-4 sm:h-32 sm:w-32 sm:gap-4 sm:p-6">
            <Wallet className="h-6 w-6 text-black" />
            <div className="flex flex-col">
              <p className="text-sm leading-tight text-black whitespace-nowrap">Bittensor</p>
              <p className="text-xs font-mono text-gray-600 truncate max-w-full">
                {user.ss58.substring(0, 6)}...{user.ss58.substring(user.ss58.length - 4)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}