import { create } from "zustand";

export type Modality = "text-to-text" | "text-to-image";

interface ModalSidebarState {
  // Section open/close state
  openSections: {
    modality: boolean;
    contextLength: boolean;
    promptPricing: boolean;
    series: boolean;
    category: boolean;
    parameters: boolean;
  };
  toggleSection: (section: keyof ModalSidebarState["openSections"]) => void;

  // Modality state
  activeModality: Modality[];
  setActiveModality: (
    modalityOrUpdater: Modality[] | ((prev: Modality[]) => Modality[]),
  ) => void;

  // Context length state
  activeContextLength: number;
  setActiveContextLength: (length: number) => void;

  // Prompt pricing state
  activePromptPricing: [number, number];
  setActivePromptPricing: (pricing: [number, number]) => void;

  // Series state
  activeSeries: string[];
  setActiveSeries: (
    seriesOrUpdater: string[] | ((prev: string[]) => string[]),
  ) => void;
  showAllSeries: boolean;
  setShowAllSeries: (show: boolean) => void;

  // Category state
  activeCategory: string[];
  setActiveCategory: (
    categoryOrUpdater: string[] | ((prev: string[]) => string[]),
  ) => void;
  showAllCategory: boolean;
  setShowAllCategory: (show: boolean) => void;

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
    series: false,
    category: false,
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
  activeModality: [] as Modality[],
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

  // Series
  activeSeries: [] as string[],
  setActiveSeries: (seriesOrUpdater) =>
    set((state) => ({
      activeSeries:
        typeof seriesOrUpdater === "function"
          ? seriesOrUpdater(state.activeSeries)
          : seriesOrUpdater,
    })),
  showAllSeries: false,
  setShowAllSeries: (show) => set({ showAllSeries: show }),

  // Category
  activeCategory: [] as string[],
  setActiveCategory: (categoryOrUpdater) =>
    set((state) => ({
      activeCategory:
        typeof categoryOrUpdater === "function"
          ? categoryOrUpdater(state.activeCategory)
          : categoryOrUpdater,
    })),
  showAllCategory: false,
  setShowAllCategory: (show) => set({ showAllCategory: show }),

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
