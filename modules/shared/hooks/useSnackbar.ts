import { useState, useCallback } from "react";
import type { SnackbarMessage, SnackbarType } from "@/modules/shared/components/Snackbar";

export const useSnackbar = () => {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const show = useCallback(
    ({
      type,
      title,
      description,
      duration,
    }: {
      type: SnackbarType;
      title: string;
      description?: string;
      duration?: number;
    }) => {
      const id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
      setMessages((prev) => [...prev, { id, type, title, description, duration }]);
      return id;
    },
    [],
  );

  const showDownload = useCallback(
    (filename = "chumme.apk") =>
      show({
        type: "download",
        title: "Download Started",
        description: `${filename} is being downloaded to your device`,
        duration: 4000,
      }),
    [show],
  );

  const showUpload = useCallback(
    (filename = "APK file") =>
      show({
        type: "upload",
        title: "Upload Started",
        description: `${filename} is being uploaded. This may take a moment.`,
        duration: 5000,
      }),
    [show],
  );

  const showSuccess = useCallback(
    (title: string, description?: string) =>
      show({ type: "success", title, description, duration: 4000 }),
    [show],
  );

  const showError = useCallback(
    (title: string, description?: string) =>
      show({ type: "error", title, description, duration: 5000 }),
    [show],
  );

  return {
    messages,
    dismiss,
    show,
    showDownload,
    showUpload,
    showSuccess,
    showError,
  };
};
