import {
  AlignVerticalSpaceAround,
  ArrowDownUp,
  Box,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
  Power,
  Settings,
  Tag,
} from "lucide-react";
import { type ChangeEvent } from "react";

import { MODALITIES } from "@/schema/schema";
import { useModalSidebarStore } from "@/store/modelSidebarStore";
import { reactClient } from "@/trpc/react";

type SectionId = "modality" | "sorting" | "liveStatus" | "organization" | "supportedEndpoints" | "advancedFilters";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

function SectionHeader({ icon: Icon, title, isOpen, onToggle }: SectionHeaderProps) {
  return (
    <div className="flex cursor-pointer items-center justify-between" onClick={onToggle}>
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
      <span className={`text-sm ${isActive ? "text-[#344054]" : "text-[#475467]"}`}>
        {label}
      </span>
    </button>
  );
}

interface SliderProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
}

function Slider({ label, value, onChange, min, max, step, formatValue }: SliderProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === "" ? null : Number(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#475467]">{label}</span>
        {value !== null && (
          <span className="text-xs font-medium text-[#475467]">{formatValue(value)}</span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? min}
        onChange={handleChange}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
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
                    : [...prev, modality]
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
          {orgs.slice(0, showAllOrganization ? orgs.length : 3).map((organization) => (
            <ToggleButton
              key={organization}
              label={organization}
              isActive={activeOrganization.includes(organization)}
              onClick={() => {
                setActiveOrganization((prev) =>
                  prev.includes(organization)
                    ? prev.filter((s) => s !== organization)
                    : [...prev, organization]
                );
              }}
            />
          ))}
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
              isActive={activeSupportedEndpoints.includes(endpoint.toUpperCase())}
              onClick={() => {
                setActiveSupportedEndpoints((prev) =>
                  prev.includes(endpoint.toUpperCase())
                    ? prev.filter((s) => s !== endpoint.toUpperCase())
                    : [...prev, endpoint.toUpperCase()]
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
    {
      id: "advancedFilters",
      icon: Settings,
      title: "Advanced Filters",
      content: (
        <SectionContent>
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 text-xs font-medium text-[#475467]">Performance</div>
              <Slider
                label="Minimum TPS"
                value={minTPS}
                onChange={setMinTPS}
                min={0}
                max={1000}
                step={10}
                formatValue={(value) => `${value} TPS`}
              />
            </div>
            <div>
              <div className="mb-2 text-xs font-medium text-[#475467]">Price</div>
              <Slider
                label="Maximum Weekly Price"
                value={maxWeeklyPrice}
                onChange={setMaxWeeklyPrice}
                min={250}
                max={2000}
                step={250}
                formatValue={(value) => `$${value}`}
              />
            </div>
          </div>
        </SectionContent>
      ),
    },
  ];

  return (
    <aside className="h-full pr-2 pt-2 sm:animate-slide-in-delay sm:pr-8 sm:pt-10">
      <div className="flex flex-col gap-2.5">
        {sections.map((section, index) => (
          <div key={section.id} className={`animate-slide-in-${index + 1} p-3 sm:animate-none`}>
            <SectionHeader
              icon={section.icon}
              title={section.title}
              isOpen={openSections[section.id]}
              onToggle={() => toggleSection(section.id)}
            />
            {openSections[section.id] && section.content}
          </div>
        ))}
      </div>
    </aside>
  );
}
