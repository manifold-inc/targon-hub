"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";

import { useModalSidebarStore } from "@/store/modelSidebarStore";
import { reactClient } from "@/trpc/react";
import ModalSidebar from "../_components/models/ModalSidebar";
import ModelCard from "../_components/models/ModelCard";
import { WatchForSuccess } from "../_components/WatchForStripeSuccess";

const ITEMS_PER_PAGE = 10;

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

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    // Update the page state
    setCurrentPage(page);

    // @TODO: This is a hack to ensure the page is scrolled to the top after the state update. But it doenst work on first and last page.
    // @TODO: Find a better solution.
    // @TODO: Ask Josh for help.
    // Try the modern scrollIntoView first
    const mainContent =
      document.querySelector("main") || document.documentElement;
    if (mainContent.scrollIntoView) {
      mainContent.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback to window.scrollTo
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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

  return (
    <>
      <WatchForSuccess />

      {/* Mobile Filter Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Sidebar */}
          <div className="absolute bottom-0 right-0 top-0 w-full max-w-sm border-l border-[#f2f4f7] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-lg font-medium text-[#101828]">Filters</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg p-2 text-[#98a1b2] hover:bg-gray-50"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            <ModalSidebar />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Left sidebar - desktop */}
        <div className="sticky top-0 hidden h-full w-80 animate-slide-in-delay border-r border-[#f2f4f7] pt-8 lg:block">
          <ModalSidebar />
        </div>

        {/* Main content area */}
        <div className="min-w-0 flex-1">
          <div className="flex animate-slide-in flex-col">
            {/* Header */}
            <div className="px-4 pt-10 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-medium text-[#101828] sm:text-2xl">
                  Models
                </h1>
                <div className="hidden whitespace-nowrap text-2xl font-normal text-[#d0d5dd] lg:block">
                  {models.data?.total ?? 0} Models
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
              {/* Search Bar */}
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <Search className="h-5 w-5 text-[#98a1b2]" />
                </div>
                <input
                  className="h-11 w-full rounded-lg border-0 bg-gray-50 pl-10 pr-4 text-sm text-[#101828] placeholder:text-[#98a1b2] focus:outline-none focus:ring-1 focus:ring-[#e4e7ec] sm:text-base"
                  placeholder="Filter models..."
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Filter Button - mobile/tablet only */}
              <div className="flex items-center justify-between lg:hidden">
                <button
                  onClick={() => setIsMobileOpen((s) => !s)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#e4e7ec] bg-white px-3 py-2 text-sm font-medium text-[#344054] transition-colors hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 text-[#98a1b2]" />
                  <span>Filters</span>
                </button>
                <div className="text-sm text-[#475467] lg:hidden">
                  {models.data?.total ?? 0} Models
                </div>
              </div>
            </div>

            {/* Model Cards */}
            <div className="flex flex-col gap-3 p-4 sm:gap-4 sm:px-6 lg:px-8">
              {models.data?.items.map((model) => (
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
              {models.data && models.data.items.length > 0 && (
                <div className="mt-4 flex items-center justify-center border-t border-[#e4e7ec] pt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#e4e7ec] bg-white px-3 py-2 text-sm font-medium text-[#344054] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* First Page */}
                    {totalPages > 1 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            currentPage === 1
                              ? "bg-[#142900] text-white"
                              : "border border-[#e4e7ec] bg-white text-[#344054] hover:bg-gray-50"
                          }`}
                        >
                          1
                        </button>

                        {/* Show ellipsis if current page is far from start */}
                        {currentPage > 3 && (
                          <span className="px-1 text-[#344054]">...</span>
                        )}

                        {/* Previous Page */}
                        {currentPage > 2 && (
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4e7ec] bg-white text-sm font-medium text-[#344054] transition-colors hover:bg-gray-50"
                          >
                            {currentPage - 1}
                          </button>
                        )}

                        {/* Current Page */}
                        {currentPage !== 1 && currentPage !== totalPages && (
                          <button
                            disabled
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#142900] text-sm font-medium text-white"
                          >
                            {currentPage}
                          </button>
                        )}

                        {/* Next Page */}
                        {currentPage < totalPages - 1 && (
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4e7ec] bg-white text-sm font-medium text-[#344054] transition-colors hover:bg-gray-50"
                          >
                            {currentPage + 1}
                          </button>
                        )}

                        {/* Show ellipsis if current page is far from end */}
                        {currentPage < totalPages - 2 && (
                          <span className="px-1 text-[#344054]">...</span>
                        )}

                        {/* Last Page */}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            currentPage === totalPages
                              ? "bg-[#142900] text-white"
                              : "border border-[#e4e7ec] bg-white text-[#344054] hover:bg-gray-50"
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#e4e7ec] bg-white px-3 py-2 text-sm font-medium text-[#344054] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
