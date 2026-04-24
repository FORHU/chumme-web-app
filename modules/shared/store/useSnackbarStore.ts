import { create } from "zustand";

import type {
  SnackbarMessage,
  SnackbarType,
} from "@/modules/shared/components/Snackbar";

interface SnackbarState {
  messages: SnackbarMessage[];
  show: (parameters: {
    type: SnackbarType;
    title: string;
    description?: string;
    duration?: number;
  }) => string;
  dismiss: (id: string) => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  messages: [],
  show: ({ type, title, description, duration }) => {
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);

    const newMessage: SnackbarMessage = {
      id,
      type,
      title,
      description,
      duration,
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    return id;
  },
  dismiss: (id) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),
}));
