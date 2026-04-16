import { useCallback } from "react";
import { useSnackbarStore } from "@/modules/shared/store/useSnackbarStore";

export const useSnackbar = () => {
  const messages = useSnackbarStore((state) => state.messages);
  const show = useSnackbarStore((state) => state.show);
  const dismiss = useSnackbarStore((state) => state.dismiss);

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
