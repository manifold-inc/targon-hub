import { create } from "zustand";

interface ModalSidebarState {
  // Section open/close state
  openSections: {
    modality: boolean;
    contextLength: boolean;
    promptPricing: boolean;
    organization: boolean;
    supportedEndpoints: boolean;
    parameters: boolean;
  };
  toggleSection: (section: keyof ModalSidebarState["openSections"]) => void;

  // Modality state
  activeModality: string[];
  setActiveModality: (
    modalityOrUpdater: string[] | ((prev: string[]) => string[]),
  ) => void;

  // Context length state
  activeContextLength: number;
  setActiveContextLength: (length: number) => void;

  // Prompt pricing state
  activePromptPricing: [number, number];
  setActivePromptPricing: (pricing: [number, number]) => void;

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
  showAllSupportedEndpoints: boolean;
  setShowAllSupportedEndpoints: (show: boolean) => void;

  // Parameters state
  activeParameters: string[];
  setActiveParameters: (
    parametersOrUpdater: string[] | ((prev: string[]) => string[]),
  ) => void;
  showAllParameters: boolean;
  setShowAllParameters: (show: boolean) => void;
}

export const useModalSidebarStore = create<ModalSidebarState>((set) => ({
  // Initial section states
  openSections: {
    modality: false,
    contextLength: false,
    promptPricing: false,
    organization: false,
    supportedEndpoints: false,
    parameters: false,
  },
  toggleSection: (section) =>
    set((state) => ({
      openSections: {
        ...state.openSections,
        [section]: !state.openSections[section],
      },
    })),

  // Modality
  activeModality: [] as string[],
  setActiveModality: (modalityOrUpdater) =>
    set((state) => ({
      activeModality:
        typeof modalityOrUpdater === "function"
          ? modalityOrUpdater(state.activeModality)
          : modalityOrUpdater,
    })),

  // Context length
  activeContextLength: 4000,
  setActiveContextLength: (length) => set({ activeContextLength: length }),

  // Prompt pricing
  activePromptPricing: [0, 10] as [number, number],
  setActivePromptPricing: (pricing) => set({ activePromptPricing: pricing }),

  // Organization
  activeOrganization: [] as string[],
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
  activeSupportedEndpoints: [] as string[],
  setActiveSupportedEndpoints: (supportedEndpointsOrUpdater) =>
    set((state) => ({
      activeSupportedEndpoints:
        typeof supportedEndpointsOrUpdater === "function"
          ? supportedEndpointsOrUpdater(state.activeSupportedEndpoints)
          : supportedEndpointsOrUpdater,
    })),
  showAllSupportedEndpoints: false,
  setShowAllSupportedEndpoints: (show) =>
    set({ showAllSupportedEndpoints: show }),

  // Parameters
  activeParameters: [] as string[],
  setActiveParameters: (parametersOrUpdater) =>
    set((state) => ({
      activeParameters:
        typeof parametersOrUpdater === "function"
          ? parametersOrUpdater(state.activeParameters)
          : parametersOrUpdater,
    })),
  showAllParameters: false,
  setShowAllParameters: (show) => set({ showAllParameters: show }),
}));
