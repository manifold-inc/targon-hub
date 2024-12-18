"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, FileCode, MailWarning } from "lucide-react";
import { toast } from "sonner";

import { reactClient } from "@/trpc/react";

export default function ModelPage() {
  const router = useRouter();
  const [model, setModel] = useState("");

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
      router.push(`/models/lease/pricing?model=${encodeURIComponent(model)}`);
    },
    onError: (error) => {
      toast.error("Failed to add model: " + error.message);
    },
  });

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Step 1: Enter Model Name
        </h2>
        <p className="pt-1 text-sm text-gray-600">
          Enter the HuggingFace model you&apos;d like to lease
        </p>
      </div>

      <div>
        <label
          htmlFor="modelUrl"
          className="block text-sm/6 font-semibold text-gray-900"
        >
          HuggingFace Model <span className="text-red-500">*</span>
        </label>
        <div className="pt-2">
          <div className="flex w-full items-center rounded-lg border border-gray-300 bg-white focus-within:border-mf-green focus-within:ring-2 focus-within:ring-mf-green">
            <span className="flex-shrink-0 pl-4 text-sm text-gray-500">
              https://huggingface.com/
            </span>
            <input
              type="text"
              id="modelUrl"
              value={model}
              onChange={(e) => {
                setModel(e.target.value.trim());
              }}
              className="w-full border-0 bg-transparent py-2 pl-0 pr-4 text-sm text-gray-900 placeholder:text-gray-700 focus:bg-transparent focus:ring-0"
              placeholder="NousResearch/Hermes-3-Llama-3.1-8B"
            />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-4">
        {/* Compatible Models */}
        <div className="flex items-start gap-3">
          <FileCode className="h-5 w-5 flex-shrink-0 pt-1 text-gray-800" />
          <div>
            <h3 className="font-medium text-gray-900">Compatible Models</h3>
            <ul className="space-y-1 pt-2 text-sm text-gray-600">
              <li>• Transformer Models (BERT, GPT)</li>
              <li>• Standard Architectures</li>
              <li>• Public HuggingFace Models</li>
            </ul>
          </div>
        </div>

        {/* Incompatible Models */}
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 pt-1 text-gray-800" />
          <div>
            <h3 className="font-medium text-gray-900">Incompatible Models</h3>
            <ul className="space-y-1 pt-2 text-sm text-gray-600">
              <li>• Custom Code Required</li>
              <li>• Private/Gated Models</li>
              <li>• Missing Configurations</li>
            </ul>
          </div>
        </div>

        {/* Support Note */}
        <div className="flex items-start gap-3">
          <MailWarning className="h-5 w-5 flex-shrink-0 pt-1 text-gray-800" />
          <div>
            <a
              href="mailto:devs@manifold.inc"
              className="font-medium text-gray-900 hover:underline"
            >
              <h3 className="font-medium text-gray-900">Contact Support</h3>
            </a>
            <p className="pt-2 text-sm text-gray-600">
              Having issues with model compatibility? Our support team is here
              to help.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-3">
        <button
          onClick={() => addModelMutation.mutate(model)}
          disabled={
            !model || model.trim().length === 0 || addModelMutation.isLoading
          }
          className="rounded-full bg-mf-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mf-green disabled:cursor-not-allowed disabled:opacity-50"
        >
          {addModelMutation.isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Checking model...
            </div>
          ) : (
            "Continue to Pricing"
          )}
        </button>
      </div>
    </div>
  );
}
