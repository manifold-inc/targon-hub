"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  InfoIcon,
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
import { CREDIT_PER_DOLLAR, MIN_PURCHASE_IN_DOLLARS } from "@/constants";
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

// Add this interface before prepareChartData function
interface ChartDataItem {
  date: string;
  total: number;
  [key: string]: number | string; // For dynamic model names
}

export default function SettingsPage() {
  const auth = useAuth();
  const user = reactClient.account.getUserDashboard.useQuery();
  const activity = reactClient.account.getUserActivity.useQuery(); // paginate and optional limit
  const keys = reactClient.core.getApiKeys.useQuery(); // get key?

  const [showSS58Input, setShowSS58Input] = useState(false);
  const [ss58Address, setSS58Address] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  const { mutateAsync: createPortalSession, isLoading } =
    reactClient.subscriptions.createPortalSession.useMutation();

  const [showPurchaseInput, setShowPurchaseInput] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState<number | null>(null);
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

  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const getUniqueModels = () => {
    if (!activity.data) return [];
    const models = new Set<string>();
    activity.data.forEach((item) => {
      if (item.model) models.add(item.model);
    });
    return Array.from(models);
  };

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

  const prepareChartData = () => {
    if (!activity.data) return [];

    // Find date range
    const dates = activity.data.map((item) => item.createdAt);
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // Create array of all dates in range
    const allDates: Date[] = [];
    const currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      allDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create initial data structure with all dates
    const initialData = allDates.reduce(
      (acc: Record<string, ChartDataItem>, date) => {
        const dateStr = date.toISOString().split("T")[0]!;
        acc[dateStr] = {
          date: dateStr,
          total: 0,
        };
        return acc;
      },
      {},
    );

    // Fill in activity data
    activity.data.forEach((item) => {
      if (!item.model || !item.responseTokens) return;

      // Skip if model is not selected (when filters are active)
      if (selectedModels.length > 0 && !selectedModels.includes(item.model)) {
        return;
      }

      const date = item.createdAt.toISOString().split("T")[0]!;

      // Ensure the date exists in initialData (TypeScript safety)
      if (initialData[date]) {
        // Add model-specific tokens
        initialData[date][item.model] =
          ((initialData[date][item.model] as number) || 0) +
          item.responseTokens;
        initialData[date].total += item.responseTokens;
      }
    });

    // Convert to array and sort by date
    return Object.values(initialData).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  };

  if (auth.status === "UNAUTHED") {
    router.push("/sign-in");
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl lg:text-left">
        Dashboard
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Account Info Panel */}
        <div className="col-span-2 rounded-2xl border border-gray-200 bg-white bg-gradient-to-br from-[#142900]/5 via-transparent to-transparent p-6">
          <h3 className="mb-4 text-lg font-semibold">Account</h3>
          <div className="flex flex-col">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white shadow">
                <User className="w-13 h-13" />
              </div>
              <div className="text-sm text-black">{user.data?.email}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/sign-out"
                className="inline-flex h-8 items-center justify-center gap-1 rounded-full px-3 py-2 hover:bg-blue-50"
                prefetch={false}
              >
                <span className="text-sm font-semibold leading-tight text-[#1d4ed8]">
                  Change Email
                </span>
              </Link>
              <Link
                href="/sign-out"
                className="inline-flex h-8 items-center justify-center gap-1 rounded-full px-3 py-2 hover:bg-blue-50"
                prefetch={false}
              >
                <span className="text-sm font-semibold leading-tight text-[#1d4ed8]">
                  Change Password
                </span>
              </Link>
              <Link
                href="/sign-out"
                className="inline-flex h-8 items-center justify-center gap-1 rounded-full px-3 py-2 hover:bg-blue-50"
                prefetch={false}
              >
                <span className="text-sm font-semibold leading-tight text-[#1d4ed8]">
                  Logout
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* API Key Panel */}
        <div className="col-span-2 rounded-2xl border border-gray-200 bg-white bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent p-6 lg:col-span-1">
          <h3 className="mb-4 overflow-hidden whitespace-nowrap text-lg font-semibold">
            <Link href="/settings/keys">API Key</Link>
          </h3>
          <div
            className="mb-4 flex h-14 cursor-pointer items-center justify-between rounded-xl bg-gray-50 p-4 hover:bg-gray-100"
            onClick={() => {
              void copyToClipboard(keys.data?.[0]?.key ?? "");
              toast.success("Copied API Key to Clipboard");
            }}
          >
            <p className="truncate leading-7 text-black">
              {keys.data?.[0]?.key || "No API key"}
            </p>
            <Copy className="h-4 w-4 flex-shrink-0" />
          </div>
          <div className="inline-flex w-full justify-between">
            <Link
              href="/settings/keys"
              className="flex h-8 flex-shrink-0 items-center justify-center gap-1 rounded-full px-3 py-4 hover:bg-blue-50"
              prefetch={false}
            >
              <span className="text-sm font-semibold leading-tight text-[#1d4ed8]">
                View All
              </span>
            </Link>

            <div
              className="hidden h-8 cursor-pointer items-center justify-center gap-1 rounded-full px-3 py-4 text-sm text-gray-500 hover:bg-blue-50 xl:flex"
              onClick={() => {
                void copyToClipboard(`${env.NEXT_PUBLIC_HUB_API_ENDPOINT}/v1`);
                toast.success("Copied URL to Clipboard");
              }}
            >
              {env.NEXT_PUBLIC_HUB_API_ENDPOINT}/v1
            </div>
          </div>
        </div>

        {/* Credits Panel */}
        <div className="col-span-2 rounded-2xl border border-gray-200 bg-white bg-gradient-to-br from-[#142900]/5 via-transparent to-transparent p-6 pb-0 lg:col-span-1">
          <h3 className="pb-8 text-lg font-semibold">
            <Link href="/settings/credits">Credits</Link>
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-5xl font-medium text-black">
              $
              {formatLargeNumber((user.data?.credits ?? 0) / CREDIT_PER_DOLLAR)}
            </p>
            <button
              onClick={() => {
                setShowPurchaseInput(!showPurchaseInput);
              }}
              className="hover:bg-gray-10 mt-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-black"
            >
              {showPurchaseInput ? "Cancel" : "Add Credits"}
            </button>
          </div>

          <div
            className={`flex flex-col gap-4 pt-2 xl:flex-row ${showPurchaseInput ? "visible" : "invisible"}`}
          >
            <div className="flex items-center gap-2">
              <div className="relative w-full rounded-md shadow-sm">
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
                  className="w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">{"USD"}</span>
                </div>
              </div>
            </div>

            <div className="flex w-full items-center justify-end">
              <div className="group relative">
                <span className="pointer-events-none absolute left-1/2 m-4 mx-auto hidden w-max max-w-sm -translate-x-1/2 translate-y-1/4 text-wrap rounded-md bg-gray-800 p-1.5 text-center text-sm text-gray-100 opacity-0 transition-opacity group-hover:opacity-100">
                  {`$1 USD is ${formatLargeNumber(CREDIT_PER_DOLLAR)} Credits`}
                </span>
                <InfoIcon className="m-2 h-4 w-4 text-gray-500" />
              </div>
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
                className="mb-2 mt-2 whitespace-nowrap rounded-full border border-black bg-white px-3 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
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
            </div>
          </div>
        </div>

        {/* Activity Panel */}
        <div className="col-span-2 row-span-2 rounded-2xl border border-gray-200 bg-white bg-gradient-to-bl from-[#142900]/5 via-transparent to-transparent p-6">
          <div className="mb-4 flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold">
              <Link href="/settings/activity">Activity</Link>
            </h3>

            <div className="flex items-center gap-2">
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
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

                <MenuItems className="absolute right-0 top-full z-10 mt-1 w-96 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {getUniqueModels().map((model) => (
                    <MenuItem key={model}>
                      {({ active }) => (
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
                          className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 ${
                            active ? "bg-gray-100" : ""
                          }`}
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
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setSelectedModels([]);
                          }}
                          className={`w-full border-t border-gray-100 px-4 py-2 text-sm text-gray-500 ${
                            active ? "bg-gray-100" : ""
                          }`}
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
                <ComposedChart data={prepareChartData()}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date: string) => {
                      return new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    minTickGap={50}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value: number): string =>
                      typeof value === "number" ? value.toLocaleString() : "0"
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      padding: "0.75rem",
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === "total") return null;
                      return [`${value.toLocaleString()} tokens`, name];
                    }}
                    cursor={false}
                  />
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
                      />
                    ))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No activity yet
            </div>
          )}
        </div>
        {/* Links Panel */}
        <div className="col-span-2 flex items-center rounded-2xl border border-gray-200 bg-white bg-gradient-to-br from-[#142900]/5 via-transparent to-transparent p-6 lg:col-span-1">
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
                        className="block h-8 w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                        placeholder="Enter your SS58 address"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowSS58Input(false);
                          setSS58Address("");
                        }}
                        className="flex h-8 items-center rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm hover:bg-gray-50"
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
                        <span className="flex items-center gap-2 text-sm font-semibold leading-tight text-white">
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
