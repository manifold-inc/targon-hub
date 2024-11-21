import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  AlignVerticalSpaceAround,
  BadgeDollarSign,
  Box,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  FileText,
  Tag,
} from "lucide-react";

import { MODALITIES } from "@/schema/schema";
import { useModalSidebarStore } from "@/store/modelSidebarStore";
import LeaseModal from "./LeaseModal";

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
    activeContextLength,
    setActiveContextLength,
    activePromptPricing,
    setActivePromptPricing,
    activeOrganization,
    setActiveOrganization,
    showAllOrganization,
    setShowAllOrganization,
    activeSupportedEndpoints,
    setActiveSupportedEndpoints,
    activeParameters,
    setActiveParameters,
    showAllParameters,
    setShowAllParameters,
  } = useModalSidebarStore();

  const searchParams = useSearchParams();
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(() => {
    return searchParams.get("openLeaseModal") === "true";
  });

  const contextTickLabels = ["4k", "64k", "1M"];
  const contextTotalTicks = 8;
  const priceTickLabels = ["$0", "$0.5", "$10+"];
  const priceTotalTicks = 8;

  const parametersList = [
    "temperature",
    "top_p",
    "max_new_tokens",
    "stop_sequences",
  ];

  const endpointColors: Record<string, string> = {
    chat: "#0284c7",
    completion: "#ea580c",
  };

  const orgs = ["Nvidia", "NousResearch", "Microsoft", "Gryphe", "Qwen"];
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
                      className={`flex h-9 w-full items-center rounded-full px-3 py-2 ${activeModality.includes(modality) ? "bg-[#f2f4f7]" : ""
                        }`}
                    >
                      <div
                        className={`text-sm leading-tight ${activeModality.includes(modality)
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
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden animate-slide-in-2 p-3 sm:animate-none">
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => toggleSection("contextLength")}
          >
            <div className="flex items-center gap-5">
              <FileText width={20} height={20} className="text-[#98a1b2]" />
              <div className="font-medium leading-normal text-[#101828]">
                Context Length
              </div>
            </div>
            {openSections.contextLength ? (
              <ChevronDown width={20} height={20} className="text-black" />
            ) : (
              <ChevronUp width={20} height={20} className="text-black" />
            )}
          </div>
          {openSections.contextLength && (
            <div className="pt-2">
              <div className="flex h-[52px] flex-col items-start justify-start gap-2 self-stretch px-10">
                {/* Slider Container */}
                <div className="relative h-6 self-stretch">
                  {/* Background Track */}
                  <div className="absolute top-[8px] h-2 w-full rounded-full bg-[#e4e7ec]" />
                  {/* Filled Track */}
                  <div
                    className="absolute top-[8px] h-2 rounded-full bg-[#155dee]"
                    style={{
                      width: `${((activeContextLength - 4000) / (1000000 - 4000)) * 100}%`,
                    }}
                  />
                  {/* Thumb */}
                  <input
                    type="range"
                    min={4000}
                    max={1000000}
                    value={activeContextLength}
                    onChange={(e) =>
                      setActiveContextLength(Number(e.target.value))
                    }
                    className="absolute top-0 h-6 w-full cursor-pointer appearance-none bg-transparent 
                                        [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer 
                                        [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full 
                                        [&::-moz-range-thumb]:border-[2px] [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-[#155dee] 
                                        [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm
                                        [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer 
                                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full 
                                        [&::-webkit-slider-thumb]:border-[2px] [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-[#155dee] 
                                        [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
                  />
                </div>

                {/* Tick marks and labels */}
                <div className="flex h-5 flex-col items-start justify-start gap-2 self-stretch">
                  <div className="inline-flex items-center justify-between self-stretch">
                    {contextTickLabels.map((label, labelIndex) => (
                      <>
                        <div className="text-center text-sm font-normal leading-tight text-[#475467]">
                          {label}
                        </div>
                        {labelIndex < contextTickLabels.length - 1 &&
                          Array(
                            contextTotalTicks / (contextTickLabels.length - 1),
                          )
                            .fill(null)
                            .map((_, i) => (
                              <div
                                key={`tick-${labelIndex}-${i}`}
                                className="h-2 w-px bg-[#d0d5dd]"
                              />
                            ))}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden animate-slide-in-3 p-3 sm:animate-none">
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => toggleSection("promptPricing")}
          >
            <div className="flex items-center gap-5">
              <CircleDollarSign
                width={20}
                height={20}
                className="text-[#98a1b2]"
              />
              <div className="font-medium leading-normal text-[#101828]">
                Prompt pricing
              </div>
            </div>
            {openSections.promptPricing ? (
              <ChevronDown width={20} height={20} className="text-black" />
            ) : (
              <ChevronUp width={20} height={20} className="text-black" />
            )}
          </div>
          {openSections.promptPricing && (
            <div className="pt-2">
              <div className="flex h-[52px] flex-col items-start justify-start gap-2 self-stretch px-10">
                {/* Slider Container */}
                <div className="relative h-6 self-stretch">
                  {/* Background Track */}
                  <div className="absolute top-[8px] h-2 w-full rounded-full bg-[#e4e7ec]" />
                  {/* Filled Track */}
                  <div
                    className="absolute top-[8px] h-2 rounded-full bg-[#155dee]"
                    style={{
                      left: `${(activePromptPricing[0] / 10) * 100}%`,
                      width: `${((activePromptPricing[1] - activePromptPricing[0]) / 10) * 100}%`,
                    }}
                  />
                  {/* Min Thumb */}
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.1}
                    value={activePromptPricing[0]}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setActivePromptPricing([
                        Math.min(value, activePromptPricing[1]),
                        activePromptPricing[1],
                      ]);
                    }}
                    className="pointer-events-none absolute top-0 h-6 w-full cursor-pointer appearance-none bg-transparent 
                                [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 
                                [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none 
                                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[2px] 
                                [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-[#155dee] 
                                [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm
                                [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 
                                [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer 
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full 
                                [&::-webkit-slider-thumb]:border-[2px] [&::-webkit-slider-thumb]:border-solid 
                                [&::-webkit-slider-thumb]:border-[#155dee] [&::-webkit-slider-thumb]:bg-white 
                                [&::-webkit-slider-thumb]:shadow-sm"
                  />
                  {/* Max Thumb */}
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.1}
                    value={activePromptPricing[1]}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setActivePromptPricing([
                        activePromptPricing[0],
                        Math.max(value, activePromptPricing[0]),
                      ]);
                    }}
                    className="pointer-events-none absolute top-0 h-6 w-full cursor-pointer appearance-none bg-transparent 
                                [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 
                                [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none 
                                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[2px] 
                                [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-[#155dee] 
                                [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm
                                [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 
                                [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer 
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full 
                                [&::-webkit-slider-thumb]:border-[2px] [&::-webkit-slider-thumb]:border-solid 
                                [&::-webkit-slider-thumb]:border-[#155dee] [&::-webkit-slider-thumb]:bg-white 
                                [&::-webkit-slider-thumb]:shadow-sm"
                  />
                </div>

                {/* Tick marks and labels */}
                <div className="flex h-5 flex-col items-start justify-start gap-2 self-stretch">
                  <div className="inline-flex items-center justify-between self-stretch">
                    {priceTickLabels.map((label, labelIndex) => (
                      <>
                        <div className="text-center text-sm font-normal leading-tight text-[#475467]">
                          {label === "$0" ? "Free" : label}
                        </div>
                        {labelIndex < priceTickLabels.length - 1 &&
                          Array(priceTotalTicks / (priceTickLabels.length - 1))
                            .fill(null)
                            .map((_, i) => (
                              <div
                                key={`tick-${labelIndex}-${i}`}
                                className="h-2 w-px bg-[#d0d5dd]"
                              />
                            ))}
                      </>
                    ))}
                  </div>
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
                        className={`inline-flex h-9 w-full items-center justify-start gap-1 rounded-full px-3 py-2 ${activeOrganization.includes(organization)
                            ? "bg-[#f2f4f7]"
                            : ""
                          }`}
                      >
                        <div className="flex w-48 items-center justify-start px-0.5">
                          <div
                            className={`text-sm leading-tight ${activeOrganization.includes(organization)
                                ? "text-[#344054]"
                                : "text-[#475467]"
                              }`}
                          >
                            {organization}
                          </div>
                        </div>
                      </button>
                    ))}
                  {(orgs?.length ?? 0) > 3 && (
                    <button
                      onClick={() =>
                        setShowAllOrganization(!showAllOrganization)
                      }
                      className="inline-flex h-9 w-full items-center justify-start gap-1 rounded-full px-3 py-2 opacity-50"
                    >
                      <div className="flex items-center justify-start px-0.5">
                        <div className="text-sm font-normal leading-tight text-[#475467]">
                          {showAllOrganization ? "Show less" : "Show more"}
                        </div>
                      </div>
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
                      className={`inline-flex h-9 w-full items-center justify-start gap-1 rounded-full px-3 py-2 ${activeSupportedEndpoints.includes(
                        endpoint.toUpperCase(),
                      )
                          ? "bg-[#f2f4f7]"
                          : ""
                        }`}
                    >
                      <div className="flex w-48 items-center justify-between px-0.5">
                        <div
                          className={`text-sm leading-tight ${activeSupportedEndpoints.includes(
                            endpoint.toUpperCase(),
                          )
                              ? "text-[#344054]"
                              : "text-[#475467]"
                            }`}
                        >
                          {endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}
                        </div>
                        <div
                          className="h-3 w-3 rounded-full border-2 border-white"
                          style={{ backgroundColor: endpointColors[endpoint] }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden animate-slide-in-6 p-3 sm:animate-none">
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => toggleSection("parameters")}
          >
            <div className="flex items-center gap-5">
              <Image src="/CodeXML.svg" alt="CodeXML" width={20} height={20} />
              <div className="font-medium leading-normal text-[#101828]">
                Supported Parameters
              </div>
            </div>
            {openSections.parameters ? (
              <ChevronDown width={20} height={20} className="text-black" />
            ) : (
              <ChevronUp width={20} height={20} className="text-black" />
            )}
          </div>
          {openSections.parameters && (
            <div className="pt-2">
              <div className="inline-flex flex-col items-start justify-start gap-2 px-2">
                <div className="flex flex-col items-start justify-start gap-2 border-l border-[#e4e7ec] px-4">
                  {parametersList
                    .slice(0, showAllParameters ? parametersList.length : 3)
                    .map((parameter) => (
                      <button
                        key={parameter}
                        onClick={() => {
                          setActiveParameters((prev) =>
                            prev.includes(parameter)
                              ? prev.filter((s) => s !== parameter)
                              : [...prev, parameter],
                          );
                        }}
                        className={`inline-flex h-9 w-full items-center justify-start gap-1 rounded-full px-3 py-2 ${activeParameters.includes(parameter)
                            ? "bg-[#f2f4f7]"
                            : ""
                          }`}
                      >
                        <div className="flex w-48 items-center justify-start px-0.5">
                          <div
                            className={`text-sm leading-tight ${activeParameters.includes(parameter)
                                ? "text-[#344054]"
                                : "text-[#475467]"
                              }`}
                          >
                            {parameter}
                          </div>
                        </div>
                      </button>
                    ))}
                  {parametersList.length > 3 && (
                    <button
                      onClick={() => setShowAllParameters(!showAllParameters)}
                      className="inline-flex h-9 w-full items-center justify-start gap-1 rounded-full px-3 py-2 opacity-50"
                    >
                      <div className="flex items-center justify-start px-0.5">
                        <div className="text-sm font-normal leading-tight text-[#475467]">
                          {showAllParameters ? "Show less" : "Show more"}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex animate-slide-in-4 justify-center p-3 sm:animate-none">
          <button
            className="group relative flex h-12 w-full items-center justify-center sm:w-44"
            onClick={() => setIsLeaseModalOpen(true)}
          >
            <div className="absolute h-11 w-40 rounded-full border-2 border-black opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="inline-flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-full border-2 border-white bg-[#101828] px-3 py-2 text-white group-hover:border-0 sm:w-fit">
              <span className="flex items-center gap-2 text-sm font-semibold leading-tight">
                Lease a Model
                <BadgeDollarSign className="h-4 w-4 opacity-50" />
              </span>
            </div>
          </button>
        </div>
      </div>
      <LeaseModal
        isOpen={isLeaseModalOpen}
        onClose={() => setIsLeaseModalOpen(false)}
        savedModel={savedModel}
        step={step}
      />
    </aside>
  );
}
