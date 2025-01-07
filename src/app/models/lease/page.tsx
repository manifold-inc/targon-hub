"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  FileCode,
  MailWarning,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { reactClient } from "@/trpc/react";

type InfoSection = {
  icon: LucideIcon;
  title: string;
  items?: readonly string[];
  description?: string;
  href?: string;
};

const INFO_SECTIONS: readonly InfoSection[] = [
  {
    icon: FileCode,
    title: "Compatible Models",
    items: [
      "Transformer Models (BERT, GPT)",
      "Standard Architectures",
      "Public HuggingFace Models",
    ],
  },
  {
    icon: AlertCircle,
    title: "Incompatible Models",
    items: [
      "Custom Code Required",
      "Private/Gated Models",
      "Missing Configurations",
    ],
  },
  {
    icon: MailWarning,
    title: "Contact Support",
    description:
      "Having issues with model compatibility? Our support team is here to help.",
    href: "mailto:devs@manifold.inc",
  },
] as const;

export default function ModelPage() {
  const router = useRouter();
  const [model, setModel] = useState("");

  const addModelMutation = reactClient.model.addModel.useMutation({
    onSuccess: (response) => {
      if (response.enabled) {
        toast.info(response.message);
        router.push(`/models/${encodeURIComponent(model)}`);
        return;
      }

      if (response.message) {
        toast.info(response.message);
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
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Step 1: Enter Model Name
        </h2>
        <p className="pt-2 text-sm text-gray-600">
          Enter the HuggingFace model you&apos;d like to lease
        </p>
        <p className="pt-2 text-sm text-gray-600">
          Example:{" "}
          <span className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-gray-800">
            Organization/Model-Name
          </span>
        </p>
      </div>

      {/* Model Input */}
      <div>
        <label
          htmlFor="modelUrl"
          className="flex items-center gap-2 text-sm/6 font-semibold text-gray-900"
        >
          HuggingFace Model{" "}
        </label>
        <div className="pt-2">
          <div className="flex w-full items-center rounded-lg border border-gray-300 bg-white focus-within:border-mf-green focus-within:ring-2 focus-within:ring-mf-green">
            <span
              // flex-shrink-0 to ensure the text doesnt wrap on different browsers, let the prefix always show and the input shrink
              className="flex-shrink-0 cursor-text pl-4 text-sm text-gray-500"
              onClick={() => document.getElementById("modelUrl")?.focus()}
            >
              https://huggingface.com/
            </span>
            <input
              type="text"
              id="modelUrl"
              value={model}
              onChange={(e) => setModel(e.target.value.trim())}
              className="w-full border-0 bg-transparent py-2 pl-0 pr-4 text-sm text-gray-900 placeholder:text-gray-700 focus:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="flex flex-col gap-4">
        {INFO_SECTIONS.map(
          ({ icon: Icon, title, items, description, href }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="h-5 w-5 flex-shrink-0 pt-1 text-gray-800" />
              <div>
                {href ? (
                  <a
                    href={href}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    <h3 className="font-medium text-gray-900">{title}</h3>
                  </a>
                ) : (
                  <h3 className="font-medium text-gray-900">{title}</h3>
                )}
                {items ? (
                  <ul className="space-y-1 pt-2 text-sm text-gray-600">
                    {items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="pt-2 text-sm text-gray-600">{description}</p>
                )}
              </div>
            </div>
          ),
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-3">
        <button
          onClick={() => addModelMutation.mutate(model)}
          disabled={!model.trim() || addModelMutation.isLoading}
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
