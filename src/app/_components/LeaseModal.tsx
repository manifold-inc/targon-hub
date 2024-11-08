import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { toast } from "sonner";

import { reactClient } from "@/trpc/react";

const steps = [
  { name: "Select Model", href: "#", status: "current" },
  { name: "Review Pricing", href: "#", status: "upcoming" },
  { name: "Complete", href: "#", status: "upcoming" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface LeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaseModal({ isOpen, onClose }: LeaseModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [modelUrl, setModelUrl] = useState("");

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

  const addModelMutation = reactClient.model.addModel.useMutation({
    onSuccess: () => {
      toast.success("Model added successfully");
      setCurrentStep(currentStep + 1);
    },
    onError: (error) => {
      toast.error("Failed to add model: " + error.message);
    },
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 0) {
        addModelMutation.mutate(modelUrl);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-3xl space-y-4 rounded-xl border bg-white p-8">
          <p className="text-center text-xl font-semibold">Lease a Model</p>
          <nav aria-label="Progress">
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
            <div className="mx-auto flex w-full max-w-xl flex-col items-center py-8">
              <form
                className="w-full space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="modelUrl"
                    className="text-sm font-medium text-gray-700"
                  >
                    HuggingFace Model{" "}
                    <span className="text-red-500">Required</span>
                  </label>
                  <p className="text-sm text-gray-500">
                    HuggingFace Model Repository (e.g.,
                    NousResearch/Hermes-3-Llama-3.1-8B).
                  </p>
                  <div className="flex w-full items-center rounded-lg border border-gray-300 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500">
                    <span className="pl-4 text-black">
                      https://huggingface.co/
                    </span>
                    <input
                      type="text"
                      id="modelUrl"
                      value={modelUrl}
                      onChange={(e) => setModelUrl(e.target.value)}
                      placeholder="organization/model-name"
                      className="w-full border-0 px-0 py-2 outline-none focus:ring-0"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="flex justify-center gap-4 py-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={classNames(
                "relative inline-flex h-10 w-36 items-center justify-center gap-1.5 rounded-full border-2 border-gray-100 px-4 py-2.5 text-sm font-semibold",
                currentStep === 0
                  ? "cursor-not-allowed border-transparent bg-gray-100 text-gray-400"
                  : "border-[#e4e7ec] bg-white text-[#344054] hover:border-gray-300",
              )}
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className={classNames(
                "relative inline-flex h-10 w-36 items-center justify-center gap-1.5 rounded-full border-2 px-4 py-2.5 text-sm font-semibold",
                currentStep === steps.length - 1
                  ? "cursor-not-allowed border-transparent bg-gray-100 text-gray-400"
                  : "border-white bg-[#101828] text-white hover:bg-[#101828]/90",
              )}
            >
              <span>Next</span>
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
