"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Search } from "lucide-react";

import { useModalSidebarStore } from "@/store/modelSidebarStore";
import { reactClient } from "@/trpc/react";
import ModalSidebar from "../_components/ModalSidebar";
import ModelCard from "../_components/ModelCard";
import { WatchForSuccess } from "../_components/WatchForStripeSuccess";

export default function Page() {
  const [query, setQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const searchParams = useSearchParams();
  const savedModel = decodeURIComponent(searchParams.get("model") ?? "");
  const step = Number(searchParams.get("step")) || null;

  const { activeOrganization, activeModality, activeSupportedEndpoints } =
    useModalSidebarStore();
  const models = reactClient.model.getModels.useQuery(
    {
      name: query,
      orgs: activeOrganization,
      modalities: activeModality,
      endpoints: activeSupportedEndpoints,
    },
    { keepPreviousData: true },
  );

  return (
    <>
      <div className="md:hidden">
        <WatchForSuccess />
        <button
          onClick={() => setIsMobileOpen((s) => !s)}
          className="flex w-full justify-between px-5 py-2"
        >
          <div className="text-xl font-medium leading-normal text-[#101828]">
            Filters
          </div>
          <div className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
            <Filter aria-hidden="true" className="h-6 w-6 text-mf-gray-600" />
          </div>
        </button>
        {isMobileOpen && <ModalSidebar savedModel={savedModel} step={step} />}
      </div>
      <div className="flex">
        {/* Left sidebar */}
        <div className="sticky top-0 hidden h-full w-80 border-r border-[#f2f4f7] pt-8 md:block">
          <ModalSidebar savedModel={savedModel} step={step} />
        </div>

        {/* Main content area */}
        <div className="w-full flex-1 p-3 sm:p-8">
          <div className="inline-flex w-full animate-slide-in flex-wrap items-center justify-between p-3 sm:p-8">
            <div className="text-2xl font-medium leading-loose text-[#101828]">
              Models
            </div>
            <div className="whitespace-nowrap text-2xl font-normal leading-loose text-[#d0d5dd]">
              {models.data?.length} Models
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex animate-slide-in justify-center p-3 py-3 sm:px-8">
            <div className="relative w-full">
              <div className="relative flex">
                <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                  <Search className="h-5 w-5 text-[#98a1b2]" />
                </div>
                <input
                  className="text-md flex h-11 w-full items-center rounded-md border-0 bg-gray-50 pb-2.5 pl-14 pr-3 pt-3 placeholder:text-[#98a1b2] focus:outline-none focus:ring-gray-200"
                  placeholder="Filter"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
          </div>
          {models.data && (
            <div className="flex animate-slide-in flex-col gap-4 p-3 sm:p-8">
              {models.data?.map((model) => (
                <ModelCard
                  key={model.name}
                  name={model.name ?? ""}
                  modality={model.modality ?? ""}
                  description={model.description ?? ""}
                  enabled={model.enabled ?? false}
                  cpt={model.cpt ?? 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
