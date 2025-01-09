import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlignVerticalSpaceAround,
  ArrowDownUp,
  Box,
  ChevronDown,
  ChevronUp,
  Power,
  Tag,
} from "lucide-react";

import { MODALITIES } from "@/schema/schema";
import { useModalSidebarStore } from "@/store/modelSidebarStore";
import LeaseModal from "./LeaseModal";

const orgs = ["Nvidia", "NousResearch", "Microsoft", "Gryphe", "Qwen"];

export default function ModalSidebar({
  savedModel,
  step,
}: {
  savedModel: string | null;
  step: number | null;
}) {
  const {
    openSections,
    toggleSection,
    activeModality,
    setActiveModality,
    sortBy,
    setSortBy,
    showLiveOnly,
    setShowLiveOnly,
    showLeaseableOnly,
    setShowLeaseableOnly,
    activeOrganization,
    setActiveOrganization,
    showAllOrganization,
    setShowAllOrganization,
    activeSupportedEndpoints,
    setActiveSupportedEndpoints,
  } = useModalSidebarStore();

  const searchParams = useSearchParams();
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(() => {
    return searchParams.get("openLeaseModal") === "true";
  });

  return (
    <aside className="h-full pr-2 pt-2 sm:animate-slide-in-delay sm:pr-8 sm:pt-10">
      <div className="flex flex-col gap-2.5">
        <div className="animate-slide-in-1 p-3 sm:animate-none">
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => toggleSection("modality")}
          >
            <div className="flex items-center gap-5">
              <Box width={20} height={20} className="text-[#98a1b2]" />
              <div className="font-medium leading-normal text-[#101828]">
                Modality
              </div>
            </div>
            {openSections.modality ? (
              <ChevronDown width={20} height={20} className="text-black" />
            ) : (
              <ChevronUp width={20} height={20} className="text-black" />
            )}
          </div>
          {openSections.modality && (
            <div className="pt-2">
              <div className="inline-flex flex-col items-start justify-start gap-2 px-2">
                <div className="flex flex-col items-start justify-start gap-2 border-l border-[#e4e7ec] px-4">
                  {MODALITIES.map((modality) => (
                    <button
                      key={modality}
                      onClick={() => {
                        setActiveModality((prev) =>
                          prev.includes(modality)
                            ? prev.filter((m) => m !== modality)
                            : [...prev, modality],
                        );
                      }}
                      className={`inline-flex h-9 w-full items-center justify-between rounded-full px-3 py-2 ${
                        activeModality.includes(modality) ? "bg-[#f2f4f7]" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          activeModality.includes(modality)
                            ? "text-[#344054]"
                            : "text-[#475467]"
                        }`}
                      >
                        {modality
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="animate-slide-in-1 p-3 sm:animate-none">
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => toggleSection("liveStatus")}
          >
            <div className="flex items-center gap-5">
              <Power width={20} height={20} className="text-[#98a1b2]" />
              <div className="font-medium leading-normal text-[#101828]">
                Status
              </div>
            </div>
            {openSections.liveStatus ? (
              <ChevronDown width={20} height={20} className="text-black" />
            ) : (
              <ChevronUp width={20} height={20} className="text-black" />
            )}
          </div>
          {openSections.liveStatus && (
            <div className="pt-2">
              <div className="inline-flex flex-col items-start justify-start gap-2 px-2">
                <div className="flex flex-col items-start justify-start gap-2 border-l border-[#e4e7ec] px-4">
                  <button
                    onClick={() => {
                      if (showLeaseableOnly) {
                        setShowLeaseableOnly(false);
                      }
                      setShowLiveOnly(!showLiveOnly);
                    }}
                    className={`inline-flex h-9 w-full items-center justify-between rounded-full px-3 py-2 ${
                      showLiveOnly ? "bg-[#f2f4f7]" : ""
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        showLiveOnly ? "text-[#344054]" : "text-[#475467]"
                      }`}
                    >
                      Live Models Only
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      if (showLiveOnly) {
                        setShowLiveOnly(false);
                      }
                      setShowLeaseableOnly(!showLeaseableOnly);
                    }}
                    className={`inline-flex h-9 w-full items-center justify-between rounded-full px-3 py-2 ${
                      showLeaseableOnly ? "bg-[#f2f4f7]" : ""
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        showLeaseableOnly ? "text-[#344054]" : "text-[#475467]"
                      }`}
                    >
                      Available to Lease
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="animate-slide-in-2 p-3 sm:animate-none">
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => toggleSection("organization")}
          >
            <div className="flex items-center gap-5">
              <AlignVerticalSpaceAround
                width={20}
                height={20}
                className="text-[#98a1b2]"
              />
              <div className="font-medium leading-normal text-[#101828]">
                Organization
              </div>
            </div>
            {openSections.organization ? (
              <ChevronDown width={20} height={20} className="text-black" />
            ) : (
              <ChevronUp width={20} height={20} className="text-black" />
            )}
          </div>
          {openSections.organization && (
            <div className="pt-2">
              <div className="inline-flex flex-col items-start justify-start gap-2 px-2">
                <div className="flex flex-col items-start justify-start gap-2 border-l border-[#e4e7ec] px-4">
                  {orgs
                    .slice(0, showAllOrganization ? orgs.length : 3)
                    .map((organization) => (
                      <button
                        key={organization}
                        onClick={() => {
                          setActiveOrganization((prev) =>
                            prev.includes(organization)
                              ? prev.filter((s) => s !== organization)
                              : [...prev, organization],
                          );
                        }}
                        className={`inline-flex h-9 w-full items-center justify-between rounded-full px-3 py-2 ${
                          activeOrganization.includes(organization)
                            ? "bg-[#f2f4f7]"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm ${
                            activeOrganization.includes(organization)
                              ? "text-[#344054]"
                              : "text-[#475467]"
                          }`}
                        >
                          {organization}
                        </span>
                      </button>
                    ))}
                  {orgs.length > 3 && (
                    <button
                      onClick={() =>
                        setShowAllOrganization(!showAllOrganization)
                      }
                      className="inline-flex h-9 w-full items-center justify-between rounded-full px-3 py-2 opacity-50"
                    >
                      <span className="text-sm text-[#475467]">
                        {showAllOrganization ? "Show less" : "Show more"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="animate-slide-in-3 p-3 sm:animate-none">
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => toggleSection("supportedEndpoints")}
          >
            <div className="flex items-center gap-5">
              <Tag width={20} height={20} className="text-[#98a1b2]" />
              <div className="font-medium leading-normal text-[#101828]">
                Supported Endpoints
              </div>
            </div>
            {openSections.supportedEndpoints ? (
              <ChevronDown width={20} height={20} className="text-black" />
            ) : (
              <ChevronUp width={20} height={20} className="text-black" />
            )}
          </div>
          {openSections.supportedEndpoints && (
            <div className="pt-2">
              <div className="inline-flex flex-col items-start justify-start gap-2 px-2">
                <div className="flex flex-col items-start justify-start gap-2 border-l border-[#e4e7ec] px-4">
                  {["chat", "completion"].map((endpoint) => (
                    <button
                      key={endpoint}
                      onClick={() => {
                        setActiveSupportedEndpoints((prev) =>
                          prev.includes(endpoint.toUpperCase())
                            ? prev.filter((s) => s !== endpoint.toUpperCase())
                            : [...prev, endpoint.toUpperCase()],
                        );
                      }}
                      className={`inline-flex h-9 w-full items-center justify-between rounded-full px-3 py-2 ${
                        activeSupportedEndpoints.includes(
                          endpoint.toUpperCase(),
                        )
                          ? "bg-[#f2f4f7]"
                          : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          activeSupportedEndpoints.includes(
                            endpoint.toUpperCase(),
                          )
                            ? "text-[#344054]"
                            : "text-[#475467]"
                        }`}
                      >
                        {endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="animate-slide-in-1 p-3 sm:animate-none">
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => toggleSection("sorting")}
          >
            <div className="flex items-center gap-5">
              <ArrowDownUp width={20} height={20} className="text-[#98a1b2]" />
              <div className="font-medium leading-normal text-[#101828]">
                Sort By
              </div>
            </div>
            {openSections.sorting ? (
              <ChevronDown width={20} height={20} className="text-black" />
            ) : (
              <ChevronUp width={20} height={20} className="text-black" />
            )}
          </div>
          {openSections.sorting && (
            <div className="pt-2">
              <div className="inline-flex flex-col items-start justify-start gap-2 px-2">
                <div className="flex flex-col items-start justify-start gap-2 border-l border-[#e4e7ec] px-4">
                  {[
                    { id: "newest" as const, label: "Newest" },
                    { id: "oldest" as const, label: "Oldest" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id === sortBy ? null : option.id);
                      }}
                      className={`inline-flex h-9 w-full items-center justify-between rounded-full px-3 py-2 ${
                        sortBy === option.id ? "bg-[#f2f4f7]" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          sortBy === option.id
                            ? "text-[#344054]"
                            : "text-[#475467]"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isLeaseModalOpen && (
        <LeaseModal
          isOpen={isLeaseModalOpen}
          onClose={() => setIsLeaseModalOpen(false)}
          savedModel={savedModel ?? ""}
          step={step}
        />
      )}
    </aside>
  );
}
