import { create } from "zustand";

interface DashboardState {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  settingsExpanded: boolean;
  setSettingsExpanded: (
    expanded: boolean | ((prev: boolean) => boolean),
  ) => void;
  musicExpanded: boolean;
  setMusicExpanded: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeNav: "Dashboard",
  setActiveNav: (nav) => set({ activeNav: nav }),
  settingsExpanded: false,
  setSettingsExpanded: (expanded) =>
    set((state) => ({
      settingsExpanded:
        typeof expanded === "function"
          ? expanded(state.settingsExpanded)
          : expanded,
    })),
  musicExpanded: false,
  setMusicExpanded: (val) =>
    set((state) => ({
      musicExpanded: typeof val === "function" ? val(state.musicExpanded) : val,
    })),
}));
