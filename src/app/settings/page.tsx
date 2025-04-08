"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import type {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import type { Signer } from "@polkadot/types/types";
import {
  ChevronDown,
  Copy,
  CreditCard,
  Loader2,
  User,
  Wallet,
} from "lucide-react";
import {
  Bar,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { useAuth } from "@/app/_components/providers";
import { CREDIT_PER_DOLLAR } from "@/constants";
import { env } from "@/env.mjs";
import { reactClient } from "@/trpc/react";
import { copyToClipboard, formatLargeNumber } from "@/utils/utils";

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

// Remove the hardcoded MODEL_COLORS and replace with a color generator
const COLORS = [
  "#2563eb", // blue
  "#16a34a", // green
  "#9333ea", // purple
  "#7c3aed", // violet
  "#6366f1", // indigo
  "#4f46e5", // darker indigo
  "#dc2626", // red
  "#ea580c", // orange
  "#0891b2", // cyan
  "#0d9488", // teal
];

// Create a Map to store model-to-color mappings
const modelColorMap = new Map<string, string>();
let colorIndex = 0;

const getModelColor = (model: string) => {
  if (!modelColorMap.has(model)) {
    modelColorMap.set(model, COLORS[colorIndex % COLORS.length]!);
    colorIndex++;
  }
  return modelColorMap.get(model) || "#000000";
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length || !label) {
    return null;
  }

  return (
    <div className="rounded-md border border-mf-silver-700 bg-mf-milk-300 p-2 text-xs shadow-sm">
      <p className="mb-1 font-medium text-gray-600">
        {new Date(label).toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
        })}
      </p>
      {payload.map(
        (entry, index) =>
          entry.value > 0 && (
            <div
              key={index}
              className="flex items-center justify-between gap-3"
            >
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-medium">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ),
      )}
    </div>
  );
};

export default function SettingsPage() {
  const auth = useAuth();
  const user = reactClient.account.getUserDashboard.useQuery();
  const activity = reactClient.account.getUserActivityMonthly.useQuery();
  const keys = reactClient.core.getApiKeys.useQuery();

  const [showSS58Input, setShowSS58Input] = useState(false);
  const [ss58Address, setSS58Address] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  const { mutateAsync: createPortalSession, isLoading } =
    reactClient.subscriptions.createPortalSession.useMutation();

  const router = useRouter();

  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const getUniqueModels = () => {
    if (!activity.data) return [];
    const models = new Set<string>();
    Object.keys(activity.data[0] || {}).forEach((key) => {
      if (key !== "date") models.add(key);
    });
    return Array.from(models);
  };

  const handleBittensorLink = useCallback(async () => {
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
  }, [ss58Address, user.data?.id]);

  const handleManageSubscriptions = async () => {
    try {
      const url = await createPortalSession();
      if (url) window.location.href = url;
    } catch (error) {
      toast.error("Failed to open subscription portal");
    }
  };

  if (auth.status === "UNAUTHED") {
    router.push("/sign-in");
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-semibold text-mf-ash-700 sm:text-3xl lg:text-left">
        Dashboard
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Account Info Panel */}
        <div className="col-span-2 rounded-2xl border border-mf-silver-700 bg-mf-milk-300 p-6">
          <h3 className="mb-4 text-lg font-semibold">Account</h3>
          <div className="flex flex-col">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mf-blue-500">
                <User className="w-13 h-13" />
              </div>
              <div className="text-sm text-black">{user.data?.email}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/sign-out"
                className="inline-flex items-center whitespace-nowrap rounded-full bg-mf-blue-500 px-4 py-2 text-sm font-semibold text-mf-ash-700 hover:bg-mf-blue-500/80"
              >
                <span className="text-sm font-semibold leading-tight">
                  Sign Out
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* API Key Panel */}
        <div className="col-span-2 rounded-2xl border border-mf-silver-700 bg-mf-milk-300 p-6 lg:col-span-1">
          <h3 className="mb-6 text-lg font-semibold">
            <Link href="/settings/keys">API Key</Link>
          </h3>
          <div
            className="group relative mb-6 cursor-pointer rounded-xl border border-mf-silver-700 bg-mf-milk-100 p-4 transition-all hover:border-mf-silver-700"
            onClick={() => {
              void copyToClipboard(keys.data?.[0]?.key ?? "");
              toast.success("Copied API Key to Clipboard");
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                {keys.data?.[0]?.key.slice(0, 6)}...
                {keys.data?.[0]?.key.slice(-6) || "No API key"}
              </p>
              <Copy className="h-4 w-4 flex-shrink-0 text-gray-400 transition-colors group-hover:text-gray-600" />
            </div>
          </div>
          <div className="border-t border-mf-silver-700 pt-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <Link
                href="/settings/keys"
                className="inline-flex items-center whitespace-nowrap rounded-full bg-mf-blue-500 px-4 py-2 text-sm font-semibold text-mf-ash-700 hover:bg-mf-blue-500/80"
                prefetch={false}
              >
                View All Keys
              </Link>

              <button
                className="hover:mf-milk-300 hidden w-fit items-center gap-2 rounded-full px-2.5 py-1 text-sm text-mf-ash-500 transition-colors xl:flex"
                onClick={() => {
                  void copyToClipboard(
                    `${env.NEXT_PUBLIC_HUB_API_ENDPOINT}/v1`,
                  );
                  toast.success("Copied URL to Clipboard");
                }}
              >
                <span className="">
                  Endpoint: {env.NEXT_PUBLIC_HUB_API_ENDPOINT}/v1
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Credits Panel */}
        <div className="col-span-2 rounded-2xl border border-mf-silver-700 bg-mf-milk-300 p-6 lg:col-span-1">
          <h3 className="pb-8 text-lg font-semibold">
            <Link href="/settings/credits">Credits</Link>
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-5xl font-medium text-black">
              $
              {formatLargeNumber((user.data?.credits ?? 0) / CREDIT_PER_DOLLAR)}
            </p>
            <Link
              className="inline-flex items-center whitespace-nowrap rounded-full bg-mf-blue-500 px-4 py-2 text-sm font-semibold text-mf-ash-700 hover:bg-mf-blue-500/80"
              href="/settings/credits"
            >
              Add Credits
            </Link>
          </div>
        </div>

        {/* Activity Panel */}
        <div className="col-span-2 row-span-2 h-[400px] rounded-2xl border border-mf-silver-700 bg-mf-milk-300 p-6">
          <div className="mb-4 flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold">
              <Link href="/settings/activity">Activity</Link>
            </h3>

            <div className="flex items-center gap-2">
              <Menu as="div" className="relative">
                <MenuButton className="hover:mf-milk-300 flex items-center gap-2 rounded-full border border-mf-silver-700 px-3 py-1 text-sm text-mf-ash-500">
                  {selectedModels.length === 0 ? (
                    <>
                      Models
                      <ChevronDown className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      {`${selectedModels.length} Selected`}
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </MenuButton>

                <MenuItems className="absolute right-0 top-full z-10 mt-1 w-96 rounded-lg border border-mf-silver-700 bg-mf-milk-300 py-1 shadow-lg">
                  {getUniqueModels().map((model) => (
                    <MenuItem key={model}>
                      {() => (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedModels((prev) => {
                              if (prev.includes(model)) {
                                return prev.filter((m) => m !== model);
                              } else {
                                return [...prev, model];
                              }
                            });
                          }}
                          className={`flex w-full items-center px-4 py-2 text-sm text-mf-ash-500`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: getModelColor(model) }}
                            />
                            <span>{model}</span>
                          </div>
                          {selectedModels.includes(model) && (
                            <span className="ml-auto">✓</span>
                          )}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                  {selectedModels.length > 0 && (
                    <MenuItem>
                      {() => (
                        <button
                          onClick={() => {
                            setSelectedModels([]);
                          }}
                          className={`w-full border-t border-mf-silver-700 px-4 py-2 text-sm text-mf-ash-500`}
                        >
                          Clear all
                        </button>
                      )}
                    </MenuItem>
                  )}
                </MenuItems>
              </Menu>
            </div>
          </div>

          {activity.data?.length ? (
            <div className="relative h-80 w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
                className="absolute inset-0"
              >
                <ComposedChart data={activity.data}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date: string) => {
                      return new Date(date).toLocaleDateString("en-US", {
                        month: "numeric",
                        day: "numeric",
                      });
                    }}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value: number): string =>
                      typeof value === "number" ? value.toLocaleString() : "0"
                    }
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  {getUniqueModels()
                    .filter(
                      (model) =>
                        selectedModels.length === 0 ||
                        selectedModels.includes(model),
                    )
                    .map((model) => (
                      <Bar
                        key={model}
                        dataKey={model}
                        stackId="a"
                        fill={getModelColor(model)}
                        barSize={20}
                      />
                    ))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-mf-ash-500">
              No activity yet
            </div>
          )}
        </div>
        {/* Links Panel */}
        <div className="col-span-2 flex items-center rounded-2xl border border-mf-silver-700 bg-mf-milk-300 p-6 lg:col-span-1">
          <div
            className={`grid grid-cols-1 ${!showSS58Input ? "sm:grid-cols-2" : ""} w-full gap-4`}
          >
            {!showSS58Input && (
              <button
                onClick={handleManageSubscriptions}
                disabled={isLoading}
                className="inline-flex h-24 w-full flex-col items-center justify-center gap-3 p-4"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
                <p className="text-sm leading-tight text-black">
                  Subscriptions
                </p>
              </button>
            )}
            {!user.data?.ss58 ? (
              !showSS58Input ? (
                <button
                  onClick={() => setShowSS58Input(true)}
                  className="inline-flex h-24 w-full flex-col items-center justify-center gap-3 p-4"
                >
                  <Wallet className="h-5 w-5 text-black" />
                  <p className="whitespace-nowrap text-sm leading-tight text-black">
                    Link Bittensor
                  </p>
                </button>
              ) : (
                <>
                  <h3 className="pb-6 font-semibold">Link Bittensor</h3>
                  <div className="flex-col-1 flex gap-2">
                    <div className="flex w-full items-center">
                      <input
                        type="text"
                        value={ss58Address}
                        onChange={(e) => setSS58Address(e.target.value)}
                        className="block h-8 w-full rounded-md border-0 px-3 py-1.5 text-mf-ash-700 ring-1 ring-inset ring-mf-silver-700 placeholder:text-xs placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                        placeholder="Enter SS58 address"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowSS58Input(false);
                          setSS58Address("");
                        }}
                        className="hover:mf-milk-300 flex h-8 items-center rounded-md border border-mf-silver-700 bg-mf-milk-300 px-3 py-2 shadow-sm"
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold leading-tight text-black">
                          Cancel
                        </span>
                      </button>
                      <button
                        onClick={handleBittensorLink}
                        disabled={isLinking || !ss58Address}
                        className="flex h-8 items-center rounded-md border border-gray-800 bg-[#101828] px-3 py-2 shadow-sm hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold leading-tight text-mf-milk-300">
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
                </>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
