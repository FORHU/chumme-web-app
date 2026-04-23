import { create } from "zustand";

interface DashboardState {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  expandedItems: Record<string, boolean>;
  toggleExpanded: (label: string) => void;
  setExpanded: (label: string, expanded: boolean) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeNav: "Dashboard",
  setActiveNav: (nav) => set({ activeNav: nav }),
  expandedItems: {},
  toggleExpanded: (label) =>
    set((state) => ({
      expandedItems: {
        ...state.expandedItems,
        [label]: !state.expandedItems[label],
      },
    })),
  setExpanded: (label, expanded) =>
    set((state) => ({
      expandedItems: {
        ...state.expandedItems,
        [label]: expanded,
      },
    })),
  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
