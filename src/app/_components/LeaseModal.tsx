import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InfoIcon,
  Loader2,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { COST_PER_GPU, CREDIT_PER_DOLLAR } from "@/constants";
import { reactClient } from "@/trpc/react";
import { formatLargeNumber } from "@/utils/utils";

const steps = [
  { name: "Select Model", status: "current" },
  { name: "Review Pricing", status: "upcoming" },
  { name: "Complete", status: "upcoming" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface LeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedModel: string | null;
  step: number | null;
}

export default function LeaseModal({
  isOpen,
  onClose,
  savedModel,
  step,
}: LeaseModalProps) {
  const [currentStep, setCurrentStep] = useState(step ?? 0);
  const [model, setModel] = useState(savedModel ?? "");
  const router = useRouter();

  // Update steps array with current status
  const updatedSteps = steps.map((step, index) => ({
    ...step,
    status:
      index === currentStep
        ? "current"
        : index < currentStep
          ? "complete"
          : "upcoming",
  }));

  const user = reactClient.account.getUser.useQuery();
  const utils = reactClient.useUtils();

  const addModelMutation = reactClient.model.addModel.useMutation({
    onSuccess: (gpus) => {
      if (gpus > 8) {
        toast.error(
          "This model requires more than 8 GPUs, which exceeds our limit of 8 GPUs. We will not be able to run this model.",
        );
        return;
      }
      if (gpus === -1) {
        toast.info("Model is already enabled and can be used immediately.");
        router.push(`/models/${encodeURIComponent(model)}`);
        return;
      }

      toast.success("Model added successfully");
      utils.model.getRequiredGpus.setData(model, gpus);
      setCurrentStep(currentStep + 1);
    },
    onError: (error) => {
      toast.error("Failed to add model: " + error.message);
    },
  });

  const checkout = reactClient.credits.checkout.useMutation({
    onError: (e) => {
      toast.error(`Failed getting checkout session: ${e.message}`);
    },
    onSuccess: (url) => {
      router.push(url);
    },
  });

  const leaseModelMutation = reactClient.credits.leaseModel.useMutation({
    onSuccess: () => {
      toast.success("Model leased successfully");
      router.push(`/models/${encodeURIComponent(model)}`);
    },
    onError: (e) => {
      toast.error(`Failed to lease model: ${e.message}`);
    },
  });

  const dbRequiredGpus = reactClient.model.getRequiredGpus.useQuery(
    model ?? "",
    {
      enabled: !!model && (currentStep === 1 || currentStep === 2),
    },
  );

  const handleNext = () => {
    switch (currentStep) {
      case 0:
        addModelMutation.mutate(model);
        break;
      case 1:
        if (!user.data) {
          router.push(
            `/sign-in?redirect=${encodeURIComponent(
              `/models?openLeaseModal=true&model=${encodeURIComponent(model)}&step=1`,
            )}`,
          );
          return;
        }
        if (BigInt(user.data.credits) < COST_PER_GPU * requiredGPUS) {
          checkout.mutate({
            purchaseAmount: 250 * Number(requiredGPUS),
            redirectTo: `/models?openLeaseModal=true&model=${encodeURIComponent(model)}&step=1`,
          });
          return;
        }
        setCurrentStep(currentStep + 1);
        break;
      case 2:
        leaseModelMutation.mutate({ model });
        break;
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      if (currentStep === 2) {
        // Reset any step 2 specific state if needed
      } else if (currentStep === 1) {
        // Reset model and purchase related state when going back to step 0
        router.push(`/models?openLeaseModal=true&step=0`);
        setModel("");
        setUseCredits(false);
        setPurchaseAmount(250 * Number(requiredGPUS));
      }
      setCurrentStep(currentStep - 1);
    }
  };

  // Add handler for modal close
  const handleClose = () => {
    // Reset states
    setCurrentStep(0);
    setModel("");
    setUseCredits(false);
    setPurchaseAmount(250 * Number(requiredGPUS));

    // New URL
    router.push("/models");

    // Call the provided onClose
    onClose();
  };

  const requiredGPUS = BigInt(dbRequiredGpus.data ?? 0);
  const totalCost = requiredGPUS * COST_PER_GPU;
  const amountNeeded = totalCost - BigInt(user.data?.credits ?? 0);

  // Add conversion helper
  const convertDollarsToCredits = (dollars: number) =>
    Number(BigInt(dollars) * BigInt(CREDIT_PER_DOLLAR));
  const convertCreditsToUsd = (credits: number) =>
    Number(BigInt(credits) / BigInt(CREDIT_PER_DOLLAR));

  // Update the purchase amount handling
  const [useCredits, setUseCredits] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(
    250 * Number(requiredGPUS),
  );

  // When switching between dollars and credits, convert the amount
  const handleCurrencyToggle = (useCreditsNew: boolean) => {
    setUseCredits(useCreditsNew);
    // Convert amount when switching
    setPurchaseAmount(
      useCreditsNew
        ? convertDollarsToCredits(purchaseAmount)
        : convertCreditsToUsd(purchaseAmount),
    );
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-3xl space-y-4 rounded-xl border bg-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1" /> {/* Spacer */}
            <p className="flex-1 whitespace-nowrap text-center text-xl font-semibold">
              Lease a Model
            </p>
            <div className="flex flex-1 justify-end">
              <button
                onClick={handleClose}
                className="p-2 text-gray-500 hover:text-gray-700 sm:hidden"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <nav aria-label="Progress" className="hidden sm:block">
            <ol role="list" className="flex items-center justify-center">
              {updatedSteps.map((step, stepIdx) => (
                <li
                  key={step.name}
                  className={classNames(
                    stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
                    "relative",
                  )}
                >
                  {step.status === "complete" ? (
                    <>
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center"
                      >
                        <div className="h-0.5 w-full bg-green-500" />
                      </div>
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                        <CheckIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-white"
                        />
                      </div>
                    </>
                  ) : step.status === "current" ? (
                    <div className="flex flex-row items-center">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center "
                      >
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <div
                        aria-current="step"
                        className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-500 bg-white"
                      >
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full bg-green-500"
                        />
                        <span className="whitespace-nowrap pt-16 text-sm font-semibold">
                          {step.name}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center"
                      >
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                        />
                        <span className="whitespace-nowrap pt-16 text-sm font-semibold">
                          {step.name}
                        </span>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Step Content */}
          {currentStep === 0 && (
            <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-8 sm:px-0">
              <form
                className="w-full space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="modelUrl"
                    className="text-center text-sm font-medium text-gray-700 sm:text-left"
                  >
                    HuggingFace Model{" "}
                    <span className="text-red-500">Required</span>
                  </label>
                  <p className="text-center text-sm text-gray-500 sm:text-left">
                    HuggingFace Model Repository (e.g.,
                    NousResearch/Hermes-3-Llama-3.1-8B).
                  </p>
                  <div className="flex w-full items-center rounded-lg border border-gray-300 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500">
                    <span className="hidden whitespace-nowrap pl-4 text-sm text-gray-500 sm:block sm:text-base">
                      https://huggingface.co/
                    </span>
                    <div className="relative sm:hidden">
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          toast.info("https://huggingface.co/", {
                            position: "bottom-center",
                            duration: 2000,
                          });
                        }}
                      >
                        <InfoIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      id="modelUrl"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="organization/model-name"
                      className="w-full border-0 px-0 py-2 text-sm outline-none focus:ring-0 sm:text-base"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 py-8">
              <div className="w-full rounded-lg border bg-gray-50 px-6 pt-6 shadow-md">
                <div className="flex flex-col items-center justify-center gap-2 border-b pb-4">
                  <h4 className="font-semibold">Model Cost Summary</h4>
                  <p className="text-sm text-gray-500">{model}</p>
                </div>

                <div className="flex flex-col gap-3 border-b py-4 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Required GPUs:</span>
                    <span>{formatLargeNumber(requiredGPUS)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Cost per GPU:</span>
                    <span>
                      {formatLargeNumber(COST_PER_GPU)} credits /{" "}
                      {(COST_PER_GPU / BigInt(CREDIT_PER_DOLLAR)).toString()} $
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-500">
                      Total Cost:
                    </span>
                    <span>
                      {formatLargeNumber(totalCost)} credits /{" "}
                      {(totalCost / BigInt(CREDIT_PER_DOLLAR)).toString()} $
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-2 py-4 text-sm">
                  <div className="flex flex-row justify-between">
                    <span className="whitespace-nowrap text-gray-500">
                      Your Balance:
                    </span>
                    <span className="whitespace-nowrap">
                      {formatLargeNumber(user.data?.credits ?? 0)} credits
                    </span>
                  </div>
                  {amountNeeded > 0 && (
                    <div className="flex flex-col text-red-600 sm:flex-row sm:justify-between">
                      <span className="font-medium">
                        Additional Credits Needed:
                      </span>
                      <span>{formatLargeNumber(amountNeeded)} Credits</span>
                    </div>
                  )}
                </div>
              </div>
              {!user.data ? null : amountNeeded > 0 && requiredGPUS <= 8 ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleCurrencyToggle(false)}
                      className={`rounded-lg px-4 py-2 text-sm ${!useCredits ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                    >
                      Dollars
                    </button>
                    <button
                      onClick={() => handleCurrencyToggle(true)}
                      className={`rounded-lg px-4 py-2 text-sm ${useCredits ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                    >
                      Credits
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="purchaseAmount"
                      className="text-sm text-gray-500"
                    >
                      Purchase Amount ({useCredits ? "Credits" : "USD"}):
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">
                          {useCredits ? "C" : "$"}
                        </span>
                      </div>
                      <input
                        id="purchaseAmount"
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
                        checkout.mutate({
                          purchaseAmount: Number(
                            (Number(amountNeeded) / CREDIT_PER_DOLLAR).toFixed(
                              2,
                            ),
                          ),
                          redirectTo: `/models?openLeaseModal=true&model=${encodeURIComponent(model)}&step=1`,
                        });
                      }}
                      disabled={checkout.isLoading}
                      className="relative inline-flex h-10 items-center justify-center gap-1.5 rounded-full border-2 border-white bg-[#101828] px-2 py-2 text-[11px] font-semibold text-white hover:bg-[#101828]/90 sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                      {checkout.isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        `Purchase Exact Amount - (${(Number(amountNeeded) / CREDIT_PER_DOLLAR).toFixed(2)} USD)`
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
              ) : null}
              {requiredGPUS > 8 && (
                <p className="rounded-md bg-yellow-50 p-3 text-yellow-700">
                  Warning: This model requires {formatLargeNumber(requiredGPUS)}{" "}
                  GPUs, which exceeds our limit of 8 GPUs. We will not be able
                  to run this model.
                </p>
              )}
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="mx-auto flex w-full max-w-xl flex-col items-center py-8">
              <div className="w-full rounded-lg border bg-gray-50 px-6 pt-6 shadow-md">
                <div className="flex flex-col items-center justify-center gap-2 border-b pb-4">
                  <h4 className="font-semibold">Model Lease Summary</h4>
                  <p className="text-sm text-gray-500">{model}</p>
                </div>

                <div className="flex flex-col gap-3 border-b py-4 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Required GPUs:</span>
                    <span>{formatLargeNumber(requiredGPUS)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Cost per GPU:</span>
                    <span>
                      {formatLargeNumber(COST_PER_GPU)} credits /{" "}
                      {(COST_PER_GPU / BigInt(CREDIT_PER_DOLLAR)).toString()} $
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-500">
                      Total Cost:
                    </span>
                    <span>
                      {formatLargeNumber(totalCost)} credits /{" "}
                      {(totalCost / BigInt(CREDIT_PER_DOLLAR)).toString()} $
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-2 py-4 text-sm">
                  <div className="flex flex-row justify-between">
                    <span className="whitespace-nowrap text-gray-500">
                      Your Balance:
                    </span>
                    <span className="whitespace-nowrap">
                      {formatLargeNumber(user.data?.credits ?? 0)} credits
                    </span>
                  </div>
                  <p className="flex justify-between font-medium">
                    <span className="whitespace-nowrap text-gray-500">
                      Remaining Balance:
                    </span>
                    <span className="whitespace-nowrap">
                      {formatLargeNumber(
                        user.data
                          ? BigInt(user.data.credits) -
                              COST_PER_GPU * requiredGPUS
                          : 0,
                      )}{" "}
                      credits
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={classNames(
                "relative inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border-2 border-gray-100 px-4 py-2.5 text-sm font-semibold sm:w-36",
                currentStep === 0
                  ? "cursor-not-allowed border-transparent bg-gray-100 text-gray-400"
                  : "border-[#e4e7ec] bg-white text-[#344054] hover:border-gray-300",
              )}
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span>Previous</span>
            </button>

            {currentStep === 1 ? (
              !user.data ? (
                <button
                  onClick={() =>
                    router.push(
                      `/sign-in?redirect=${encodeURIComponent(
                        `/models?openLeaseModal=true&model=${encodeURIComponent(model)}&step=1`,
                      )}`,
                    )
                  }
                  className="relative inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border-2 border-white bg-[#101828] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#101828]/90 sm:w-36"
                >
                  Sign In
                </button>
              ) : amountNeeded > 0 ? (
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <button
                    onClick={() =>
                      checkout.mutate({
                        purchaseAmount: useCredits
                          ? convertCreditsToUsd(purchaseAmount)
                          : purchaseAmount,
                        redirectTo: `/models?openLeaseModal=true&model=${encodeURIComponent(model)}&step=1`,
                      })
                    }
                    disabled={checkout.isLoading}
                    className="relative inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border-2 border-white bg-[#101828] px-2 py-2 text-[11px] font-semibold text-white hover:bg-[#101828]/90 sm:w-auto sm:px-4 sm:py-2.5 sm:text-sm"
                  >
                    {checkout.isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      `Purchase ${purchaseAmount === 0 ? (useCredits ? "Credits" : "Dollars") : useCredits ? formatLargeNumber(BigInt(purchaseAmount)) + " Credits" : "$" + purchaseAmount}`
                    )}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={leaseModelMutation.isLoading || requiredGPUS > 8}
                  className={`relative inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border-2 px-4 py-2.5 text-sm font-semibold sm:w-36 ${
                    requiredGPUS > 8
                      ? "cursor-not-allowed border-transparent bg-gray-100 text-gray-400"
                      : "border-white bg-[#101828] text-white hover:bg-[#101828]/90"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              )
            ) : currentStep === steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="relative inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border-2 border-white bg-[#101828] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#101828]/90 sm:w-36"
              >
                <span>Confirm</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  currentStep === steps.length - 1 || addModelMutation.isLoading
                }
                className={classNames(
                  "relative inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border-2 px-4 py-2.5 text-sm font-semibold sm:w-36",
                  currentStep === steps.length - 1
                    ? "cursor-not-allowed border-transparent bg-gray-100 text-gray-400"
                    : "border-white bg-[#101828] text-white hover:bg-[#101828]/90",
                )}
              >
                {addModelMutation.isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
