"use client";

import { useState } from "react";
import { Combobox, ComboboxInput } from "@headlessui/react";
import { Search } from "lucide-react";

import { useModalSidebarStore } from "@/store/modelSidebarStore";
import { reactClient } from "@/trpc/react";
import ModalSidebar from "../_components/ModalSidebar";
import ModelCard from "../_components/ModelCard";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(() => {
    return searchParams.get("openLeaseModal") === "true";
  });
  const savedModel = searchParams.get("model");
  const step = Number(searchParams.get("step")) || null;
  const successUrl = searchParams.get("success") === "true";
  const canceledUrl = searchParams.get("canceled") === "true";

  const { data: modelsInfo } = reactClient.model.getModelsInfo.useQuery();
  const { activeOrganization, activeModality } = useModalSidebarStore();

  // Filter models based on search query and active series
  const filteredModels = modelsInfo?.filter((model) => {
    // If no query and no active series, include all models
    if (!query && !activeOrganization.length) return true;

    // Check if model matches search query
    const matchesQuery =
      !query ||
      model.name?.toLowerCase().includes(query.toLowerCase()) ||
      model.organization?.toLowerCase().includes(query.toLowerCase()) ||
      (model.modality?.toLowerCase() || "").includes(query.toLowerCase());

    // Check if model matches active series
    const matchesOrganization =
      !activeOrganization.length ||
      (model.organization && activeOrganization.includes(model.organization));

    const matchesModality =
      !activeModality.length ||
      (model.modality && activeModality.includes(model.modality));

    // Model must match all conditions
    return matchesQuery && matchesOrganization && matchesModality;
  });

  return (
    <>
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-80 border-r border-[#f2f4f7]">
          <ModalSidebar 
            isLeaseModalOpen={isLeaseModalOpen}
            setIsLeaseModalOpen={setIsLeaseModalOpen}
            savedModel={savedModel}
            step={step}
            successUrl={successUrl}
            canceledUrl={canceledUrl}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 p-8">
          <div className="inline-flex h-16 w-full animate-slide-in items-center justify-between p-8">
            <div className="text-2xl font-medium leading-loose text-[#101828]">
              Models
            </div>
            <div className="text-2xl font-normal leading-loose text-[#d0d5dd]">
              {modelsInfo?.length} Models
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex animate-slide-in justify-center px-8 py-3">
            <div className="relative w-full">
              <Combobox
                value={query}
                onChange={(value: string) => setQuery(value)}
              >
                <div className="relative flex">
                  <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                    <Search className="h-5 w-5 text-[#98a1b2]" />
                  </div>
                  <ComboboxInput
                    className="text-md flex h-11 w-full items-center rounded-md border-0 bg-gray-50 pb-2.5 pl-14 pr-3 pt-3 placeholder:text-[#98a1b2] focus:outline-none focus:ring-gray-200"
                    placeholder="Filter"
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
              </Combobox>
            </div>
          </div>
          {modelsInfo && (
            <div className="flex animate-slide-in flex-col gap-4 p-8">
              {filteredModels?.map((model) => (
                <ModelCard
                  key={model.name}
                  name={model.name ?? ""}
                  organization={model.organization ?? ""}
                  modality={model.modality ?? ""}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
