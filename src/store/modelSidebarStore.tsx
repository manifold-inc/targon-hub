import { create } from "zustand";

import { type MODALITIES } from "@/schema/schema";

export type SortOption = "newest" | "oldest" | null;

interface ModalSidebarState {
  // Section open/close state
  openSections: {
    modality: boolean;
    sorting: boolean;
    liveStatus: boolean;
    organization: boolean;
    supportedEndpoints: boolean;
  };
  toggleSection: (section: keyof ModalSidebarState["openSections"]) => void;

  // Live filter state
  showLiveOnly: boolean;
  setShowLiveOnly: (show: boolean) => void;
  showLeaseableOnly: boolean;
  setShowLeaseableOnly: (show: boolean) => void;

  // Sorting state
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;

  // Modality state
  activeModality: Array<(typeof MODALITIES)[number]>;
  setActiveModality: (
    modalityOrUpdater:
      | Array<(typeof MODALITIES)[number]>
      | ((
          prev: Array<(typeof MODALITIES)[number]>,
        ) => Array<(typeof MODALITIES)[number]>),
  ) => void;

  // Organization state
  activeOrganization: string[];
  setActiveOrganization: (
    organizationOrUpdater: string[] | ((prev: string[]) => string[]),
  ) => void;
  showAllOrganization: boolean;
  setShowAllOrganization: (show: boolean) => void;

  // Supported endpoints state
  activeSupportedEndpoints: string[];
  setActiveSupportedEndpoints: (
    supportedEndpointsOrUpdater: string[] | ((prev: string[]) => string[]),
  ) => void;
}

export const useModalSidebarStore = create<ModalSidebarState>((set) => ({
  // Initial section states
  openSections: {
    modality: false,
    sorting: false,
    liveStatus: false,
    organization: false,
    supportedEndpoints: false,
  },
  toggleSection: (section) =>
    set((state) => ({
      openSections: {
        ...state.openSections,
        [section]: !state.openSections[section],
      },
    })),

  // Live filter
  showLiveOnly: false,
  setShowLiveOnly: (show) => set({ showLiveOnly: show }),
  showLeaseableOnly: false,
  setShowLeaseableOnly: (show) => set({ showLeaseableOnly: show }),

  // Sorting
  sortBy: null,
  setSortBy: (option) => set({ sortBy: option }),

  // Modality
  activeModality: [],
  setActiveModality: (modalityOrUpdater) =>
    set((state) => ({
      activeModality:
        typeof modalityOrUpdater === "function"
          ? modalityOrUpdater(state.activeModality)
          : modalityOrUpdater,
    })),

  // Organization
  activeOrganization: [],
  setActiveOrganization: (organizationOrUpdater) =>
    set((state) => ({
      activeOrganization:
        typeof organizationOrUpdater === "function"
          ? organizationOrUpdater(state.activeOrganization)
          : organizationOrUpdater,
    })),
  showAllOrganization: false,
  setShowAllOrganization: (show) => set({ showAllOrganization: show }),

  // Supported endpoints
  activeSupportedEndpoints: [],
  setActiveSupportedEndpoints: (supportedEndpointsOrUpdater) =>
    set((state) => ({
      activeSupportedEndpoints:
        typeof supportedEndpointsOrUpdater === "function"
          ? supportedEndpointsOrUpdater(state.activeSupportedEndpoints)
          : supportedEndpointsOrUpdater,
    })),
}));
