"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";

import { useModalSidebarStore } from "@/store/modelSidebarStore";
import { reactClient } from "@/trpc/react";
import ModelCard from "../_components/models/ModelCard";
import ModalSidebar from "../_components/models/ModalSidebar";
import { WatchForSuccess } from "../_components/WatchForStripeSuccess";

const ITEMS_PER_PAGE = 5;

export default function Page() {
  const [query, setQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    activeOrganization,
    activeModality,
    activeSupportedEndpoints,
    sortBy,
    showLiveOnly,
    showLeaseableOnly,
    minTPS,
    minWeeklyPrice,
    maxWeeklyPrice,
  } = useModalSidebarStore();

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    query,
    activeOrganization,
    activeModality,
    activeSupportedEndpoints,
    sortBy,
    showLiveOnly,
    showLeaseableOnly,
    minTPS,
    minWeeklyPrice,
    maxWeeklyPrice,
  ]);

  const models = reactClient.model.getModels.useQuery(
    {
      name: query,
      orgs: activeOrganization,
      modalities: activeModality,
      endpoints: activeSupportedEndpoints,
      showLiveOnly,
      showLeaseableOnly,
      sortBy,
      minTPS: minTPS && minTPS > 0 ? minTPS : undefined,
      minWeeklyPrice,
      maxWeeklyPrice,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    },
    { keepPreviousData: true },
  );

  const totalPages = models.data?.totalPages ?? 1;
  const currentModels = models.data?.items ?? [];

  return (
    <>
      <div className="lg:hidden">
        <WatchForSuccess />
        <button
          onClick={() => setIsMobileOpen((s) => !s)}
          className="flex w-full justify-between px-6 pt-12"
        >
          <div className="text-xl font-medium leading-normal text-[#101828]">
            Filters
          </div>
          <div className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
            <Filter aria-hidden="true" className="h-6 w-6 text-mf-gray-600" />
          </div>
        </button>
        {isMobileOpen && <ModalSidebar />}
      </div>
      <div className="flex">
        {/* Left sidebar */}
        <div className="sticky top-0 hidden h-full w-80 border-r border-[#f2f4f7] pt-8 lg:block">
          <ModalSidebar />
        </div>

        {/* Main content area */}
        <div className="w-full flex-1 p-3 sm:p-8">
          <div className="inline-flex w-full animate-slide-in flex-wrap items-center justify-between p-3 sm:p-8">
            <div className="text-2xl font-medium leading-loose text-[#101828]">
              Models
            </div>
            <div className="whitespace-nowrap text-2xl font-normal leading-loose text-[#d0d5dd]">
              {models.data?.total ?? 0} Models
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
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setCurrentPage(1); // Reset to first page on new search
                  }}
                />
              </div>
            </div>
          </div>

          {models.data && (
            <div className="flex animate-slide-in flex-col gap-4 p-3 sm:p-8">
              {currentModels.map((model) => (
                <ModelCard
                  key={model.name}
                  name={model.name ?? ""}
                  modality={model.modality ?? ""}
                  description={model.description ?? ""}
                  enabled={model.enabled ?? false}
                  createdAt={model.createdAt}
                  avgTPS={model.avgTPS}
                  weeklyPrice={model.weeklyPrice}
                />
              ))}

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-center border-t border-[#e4e7ec] pt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#e4e7ec] bg-white px-3 py-2 text-sm font-medium text-[#344054] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {/* Numbered Pages */}
                  {Array.from({ length: Math.min(5, Math.max(1, totalPages)) }, (_, i) => {
                    let pageNumber;
                    const showEllipsisStart = totalPages > 5 && currentPage > 3;
                    const showEllipsisEnd = totalPages > 5 && currentPage < totalPages - 2;

                    if (totalPages <= 5) {
                      // Show all pages if 5 or fewer
                      pageNumber = i + 1;
                    } else if (i === 0) {
                      // Always show first page
                      pageNumber = 1;
                    } else if (i === 4) {
                      // Always show last page
                      pageNumber = totalPages;
                    } else if (i === 1 && showEllipsisStart) {
                      // Show ellipsis after first page
                      return (
                        <span key="ellipsis-start" className="px-1 text-[#344054]">
                          ...
                        </span>
                      );
                    } else if (i === 3 && showEllipsisEnd) {
                      // Show ellipsis before last page
                      return (
                        <span key="ellipsis-end" className="px-1 text-[#344054]">
                          ...
                        </span>
                      );
                    } else if (showEllipsisStart && showEllipsisEnd) {
                      // Show current page in the middle
                      pageNumber = currentPage;
                    } else if (showEllipsisStart) {
                      // Show last few pages
                      pageNumber = totalPages - (4 - i);
                    } else {
                      // Show first few pages
                      pageNumber = i + 1;
                    }

                    if (typeof pageNumber !== 'number') return null;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        disabled={currentPage === pageNumber}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNumber
                            ? "bg-[#142900] text-white"
                            : "border border-[#e4e7ec] bg-white text-[#344054] hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === Math.max(1, totalPages)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#e4e7ec] bg-white px-3 py-2 text-sm font-medium text-[#344054] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
