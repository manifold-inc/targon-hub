import { type ChangeEvent } from "react";
import {
  AlignVerticalSpaceAround,
  ArrowDownUp,
  Box,
  ChevronDown,
  ChevronUp,
  Info,
  Plus,
  Power,
  Settings2,
  Tag,
  X,
  type LucideIcon,
} from "lucide-react";

import { MODALITIES } from "@/schema/schema";
import { useModalSidebarStore } from "@/store/modelSidebarStore";
import { reactClient } from "@/trpc/react";

type SectionId =
  | "modality"
  | "sorting"
  | "liveStatus"
  | "organization"
  | "supportedEndpoints";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

function SectionHeader({
  icon: Icon,
  title,
  isOpen,
  onToggle,
}: SectionHeaderProps) {
  return (
    <div
      className="flex cursor-pointer items-center justify-between"
      onClick={onToggle}
    >
      <div className="flex items-center gap-5">
        <Icon width={20} height={20} className="text-[#98a1b2]" />
        <div className="font-medium leading-normal text-[#101828]">{title}</div>
      </div>
      {isOpen ? (
        <ChevronDown width={20} height={20} className="text-black" />
      ) : (
        <ChevronUp width={20} height={20} className="text-black" />
      )}
    </div>
  );
}

interface ToggleButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function ToggleButton({ label, isActive, onClick }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-9 w-full items-center justify-between rounded-full px-3 py-2 ${
        isActive ? "bg-[#f2f4f7]" : ""
      }`}
    >
      <span
        className={`text-sm ${isActive ? "text-[#344054]" : "text-[#475467]"}`}
      >
        {label}
      </span>
    </button>
  );
}

interface SliderProps {
  label: string;
  value: number | null | undefined;
  onChange: (value: number | null | undefined) => void;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
}

function PriceRangeSlider({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  min,
  max,
  step,
}: {
  minValue: number | null | undefined;
  maxValue: number | null | undefined;
  onMinChange: (value: number | null | undefined) => void;
  onMaxChange: (value: number | null | undefined) => void;
  min: number;
  max: number;
  step: number;
}) {
  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (maxValue === null || maxValue === undefined || value <= maxValue) {
      onMinChange(value);
    }
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (minValue === null || minValue === undefined || value >= minValue) {
      onMaxChange(value);
    }
  };

  const currentMin = minValue ?? min;
  const currentMax = maxValue ?? max;
  const minPos = ((currentMin - min) / (max - min)) * 100;
  const maxPos = ((currentMax - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#475467]">Price Range</span>
        <span className="text-xs font-medium text-[#475467]">
          ${currentMin} - ${currentMax}
        </span>
      </div>
      <div className="relative h-2">
        <div className="absolute h-full w-full rounded-lg bg-gray-200" />
        <div
          className="absolute h-full rounded-lg bg-[#142900]"
          style={{
            left: `${minPos}%`,
            right: `${100 - maxPos}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMin}
          onChange={handleMinChange}
          className="pointer-events-none absolute h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#142900] [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMax}
          onChange={handleMaxChange}
          className="pointer-events-none absolute h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#142900] [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110"
        />
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
}: SliderProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };

  const currentValue = value ?? min;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[#475467]">{label}</span>
        <span className="font-medium text-[#475467]">
          {formatValue(currentValue)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#142900] [&::-webkit-slider-thumb]:transition-colors hover:[&::-webkit-slider-thumb]:bg-[#142900]/90"
        style={{
          background: `linear-gradient(to right, #142900 0%, #142900 ${((currentValue - min) / (max - min)) * 100}%, #e5e7eb ${((currentValue - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  );
}

interface SectionContentProps {
  children: React.ReactNode;
}

function SectionContent({ children }: SectionContentProps) {
  return (
    <div className="pt-2">
      <div className="inline-flex flex-col items-start justify-start gap-2 px-2">
        <div className="flex flex-col items-start justify-start gap-2 border-l border-[#e4e7ec] px-4">
          {children}
        </div>
      </div>
    </div>
  );
}

interface Section {
  id: SectionId;
  icon: LucideIcon;
  title: string;
  content: React.ReactNode;
}

export default function ModalSidebar() {
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
    minTPS,
    setMinTPS,
    maxWeeklyPrice,
    setMaxWeeklyPrice,
    minWeeklyPrice,
    setMinWeeklyPrice,
  } = useModalSidebarStore();

  const { data: orgs = [] } = reactClient.model.getOrganizations.useQuery();

  const sections: Section[] = [
    {
      id: "modality",
      icon: Box,
      title: "Modality",
      content: (
        <SectionContent>
          {MODALITIES.map((modality) => (
            <ToggleButton
              key={modality}
              label={modality
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              isActive={activeModality.includes(modality)}
              onClick={() => {
                setActiveModality((prev) =>
                  prev.includes(modality)
                    ? prev.filter((m) => m !== modality)
                    : [...prev, modality],
                );
              }}
            />
          ))}
        </SectionContent>
      ),
    },
    {
      id: "liveStatus",
      icon: Power,
      title: "Status",
      content: (
        <SectionContent>
          <ToggleButton
            label="Live Models Only"
            isActive={showLiveOnly}
            onClick={() => {
              if (showLeaseableOnly) setShowLeaseableOnly(false);
              setShowLiveOnly(!showLiveOnly);
            }}
          />
          <ToggleButton
            label="Available to Lease"
            isActive={showLeaseableOnly}
            onClick={() => {
              if (showLiveOnly) setShowLiveOnly(false);
              setShowLeaseableOnly(!showLeaseableOnly);
            }}
          />
        </SectionContent>
      ),
    },
    {
      id: "organization",
      icon: AlignVerticalSpaceAround,
      title: "Organization",
      content: (
        <SectionContent>
          <div>
            {orgs
              .slice(0, showAllOrganization ? orgs.length : 3)
              .map((organization) => (
                <ToggleButton
                  key={organization}
                  label={organization}
                  isActive={activeOrganization.includes(organization)}
                  onClick={() => {
                    setActiveOrganization((prev) =>
                      prev.includes(organization)
                        ? prev.filter((s) => s !== organization)
                        : [...prev, organization],
                    );
                  }}
                />
              ))}
          </div>
          {orgs.length > 3 && (
            <ToggleButton
              label={showAllOrganization ? "Show less" : "Show more"}
              isActive={false}
              onClick={() => setShowAllOrganization(!showAllOrganization)}
            />
          )}
        </SectionContent>
      ),
    },
    {
      id: "supportedEndpoints",
      icon: Tag,
      title: "Supported Endpoints",
      content: (
        <SectionContent>
          {["chat", "completion"].map((endpoint) => (
            <ToggleButton
              key={endpoint}
              label={endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}
              isActive={activeSupportedEndpoints.includes(
                endpoint.toUpperCase(),
              )}
              onClick={() => {
                setActiveSupportedEndpoints((prev) =>
                  prev.includes(endpoint.toUpperCase())
                    ? prev.filter((s) => s !== endpoint.toUpperCase())
                    : [...prev, endpoint.toUpperCase()],
                );
              }}
            />
          ))}
        </SectionContent>
      ),
    },
    {
      id: "sorting",
      icon: ArrowDownUp,
      title: "Sort By",
      content: (
        <SectionContent>
          {[
            { id: "newest" as const, label: "Newest" },
            { id: "oldest" as const, label: "Oldest" },
          ].map((option) => (
            <ToggleButton
              key={option.id}
              label={option.label}
              isActive={sortBy === option.id}
              onClick={() => setSortBy(option.id === sortBy ? null : option.id)}
            />
          ))}
        </SectionContent>
      ),
    },
  ];

  return (
    <aside className="h-screen border-r border-[#e4e7ec] pr-2 pt-2 sm:animate-slide-in-delay sm:pr-8 sm:pt-10">
      <div className="flex h-full flex-col gap-2.5 overflow-y-auto">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`animate-slide-in-${index + 1} p-3 sm:animate-none`}
          >
            <SectionHeader
              icon={section.icon}
              title={section.title}
              isOpen={openSections[section.id]}
              onToggle={() => toggleSection(section.id)}
            />
            {openSections[section.id] && section.content}
          </div>
        ))}

        <div className="mx-3 h-px bg-gray-200" />

        {/* Advanced Filters */}
        <div className="p-3">
          <div className="flex cursor-pointer items-center justify-between">
            <div className="flex items-center gap-5">
              <Settings2 width={20} height={20} className="text-[#98a1b2]" />
              <div className="font-medium leading-normal text-[#101828]">
                Advanced Filters
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 px-9 pt-6">
            <div className="space-y-4">
              <Slider
                label="Minimum TPS"
                value={minTPS}
                onChange={setMinTPS}
                min={0}
                max={500}
                step={10}
                formatValue={(value) => `${value} TPS`}
              />
              <PriceRangeSlider
                minValue={minWeeklyPrice}
                maxValue={maxWeeklyPrice}
                onMinChange={setMinWeeklyPrice}
                onMaxChange={setMaxWeeklyPrice}
                min={250}
                max={2000}
                step={250}
              />
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#98a1b2]" />
                <p className="text-[11px] leading-[14px] text-[#475467]">
                  TPS (Tokens Per Second) shows the model&apos;s average
                  throughput over the past 7 days and is only available for live
                  models
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#98a1b2]" />
                <p className="text-[11px] leading-[14px] text-[#475467]">
                  Weekly price filter helps you find models within your leasing
                  budget
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="px-3 pt-3">
          <button
            onClick={() => {
              setActiveModality([]);
              setActiveOrganization([]);
              setActiveSupportedEndpoints([]);
              setSortBy(null);
              setShowLiveOnly(false);
              setShowLeaseableOnly(false);
              setMinTPS(0);
              setMinWeeklyPrice(250);
              setMaxWeeklyPrice(2000);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e4e7ec] bg-white px-4 py-2.5 text-sm font-medium text-[#344054] transition-colors hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        </div>

        {/* Add Model CTA */}
        <div className="px-3 py-3">
          <div className="relative flex flex-col items-center overflow-hidden rounded-xl border border-[#e4e7ec]/60 bg-white/30 px-4 py-5 text-center backdrop-blur-sm">
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#142900]/10 via-[#142900]/5 to-transparent" />
              <div className="absolute inset-0 animate-[shine_3s_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent_25%,rgba(68,255,109,0.05)_50%,transparent_75%)]" />
            </div>
            <p className="pb-3 text-xs font-medium text-[#344054]">
              Don&apos;t see the model you want?
            </p>
            <a
              href="/models/lease"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#142900] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-[1px] hover:bg-[#142900]/90 hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add New Model
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
