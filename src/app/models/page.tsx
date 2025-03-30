"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
} from "lucide-react";

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

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
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

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setCurrentPage(page);
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
          <div className="absolute bottom-0 right-0 top-0 w-full max-w-sm border-l border-mf-silver-700 bg-mf-milk-300 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-lg font-medium text-mf-ash-300">Filters</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg p-2 text-mf-ash-300 hover:bg-mf-milk-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ModalSidebar />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Left sidebar - desktop */}
        <div className="hidden w-80 lg:block">
          <div className="sticky top-14 min-h-screen overflow-y-auto  bg-mf-milk-300">
            <ModalSidebar />
          </div>
        </div>

        {/* Main content area */}
        <div className="min-w-0 flex-1 bg-mf-milk-100">
          <div className="flex animate-slide-in flex-col">
            {/* Header */}
            <div className="px-4 pt-10 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-medium text-mf-ash-300 sm:text-2xl">
                  Models
                </h1>
                <div className="hidden whitespace-nowrap text-2xl font-normal text-mf-ash-300 lg:block">
                  {models.data?.total ?? 0} Models
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
              {/* Search Bar */}
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <Search className="h-4 w-4 text-mf-grey" />
                </div>
                <input
                  className="text-md placeholder:text-mf-silver flex h-9 w-full items-center rounded-lg border-mf-milk-700 bg-mf-milk-300 pb-3 pl-8 pr-8 pt-3 text-sm leading-tight ring-0 focus:border-mf-night-300 focus:ring-0"
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
                  className="inline-flex items-center gap-2 rounded-lg border border-mf-silver-700 bg-mf-milk-300 px-3 py-2 text-sm font-medium text-mf-ash-300 transition-colors hover:bg-mf-milk-100"
                >
                  <Filter className="h-4 w-4 text-mf-ash-300" />
                  <span>Filters</span>
                </button>
                <div className="text-sm text-mf-ash-300 lg:hidden">
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
                  modality={model.modality ?? "text-generation"}
                  description={model.description ?? ""}
                  enabled={model.enabled ?? false}
                  createdAt={model.createdAt}
                  avgTPS={model.avgTPS}
                  weeklyPrice={model.weeklyPrice}
                />
              ))}

              {/* Add Model CTA Card - only show on the last page */}
              {models.data?.items &&
                models.data.items.length > 0 &&
                currentPage === totalPages && (
                  <Link
                    href="/models/add"
                    className="group relative flex items-start overflow-hidden rounded-xl border border-mf-blue-700 bg-mf-milk-300 p-3 backdrop-blur-md transition-all duration-500 hover:from-mf-blue-700 hover:to-mf-blue-500 sm:p-4 md:p-5"
                  >
                    <div className="relative flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-mf-blue-700 sm:text-lg">
                            Add Any Model
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-[#475467]">
                            <span>Join the Targon ecosystem</span>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-mf-blue-900 px-3 py-1.5 text-sm font-medium text-mf-milk-300 shadow-sm transition-all duration-300 group-hover:bg-mf-blue-700 group-hover:shadow-md sm:px-4">
                            Add Model
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-[#475467]">
                        List your model on Targon and reach thousands of
                        developers. Simple integration and flexible pricing.
                      </p>
                    </div>
                  </Link>
                )}

              {/* Pagination */}
              {models.data && models.data.items.length > 0 && (
                <div className="flex items-center justify-center border-t border-mf-silver-700 pt-8">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="hover:mf-milk-300 inline-flex items-center gap-1 rounded-lg border border-mf-silver-700 bg-mf-milk-300 px-3 py-2 text-sm font-medium text-mf-ash-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
                              ? "bg-mf-blue-900 text-mf-milk-300"
                              : "hover:mf-milk-300 border border-mf-silver-700 bg-mf-milk-300 text-mf-ash-300"
                          }`}
                        >
                          1
                        </button>

                        {/* Show ellipsis if current page is far from start */}
                        {currentPage > 3 && (
                          <span className="px-1 text-mf-ash-300">...</span>
                        )}

                        {/* Previous Page */}
                        {currentPage > 2 && (
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="hover:mf-milk-300 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-mf-silver-700 bg-mf-milk-300 text-sm font-medium text-mf-ash-300 transition-colors"
                          >
                            {currentPage - 1}
                          </button>
                        )}

                        {/* Current Page */}
                        {currentPage !== 1 && currentPage !== totalPages && (
                          <button
                            disabled
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-mf-blue-900 text-sm font-medium text-mf-milk-300"
                          >
                            {currentPage}
                          </button>
                        )}

                        {/* Next Page */}
                        {currentPage < totalPages - 1 && (
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="hover:mf-milk-300 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-mf-silver-700 bg-mf-milk-300 text-sm font-medium text-mf-ash-300 transition-colors"
                          >
                            {currentPage + 1}
                          </button>
                        )}

                        {/* Show ellipsis if current page is far from end */}
                        {currentPage < totalPages - 2 && (
                          <span className="px-1 text-mf-ash-300">...</span>
                        )}

                        {/* Last Page */}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            currentPage === totalPages
                              ? "bg-mf-blue-900 text-mf-milk-300"
                              : "hover:mf-milk-300 border border-mf-silver-700 bg-mf-milk-300 text-mf-ash-300"
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
                      className="hover:mf-milk-300 inline-flex items-center gap-1 rounded-lg border border-mf-silver-700 bg-mf-milk-300 px-3 py-2 text-sm font-medium text-mf-ash-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
