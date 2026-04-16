"use client";

import React from "react";

import { Snackbar } from "@/modules/shared/components/Snackbar";
import { useSnackbarStore } from "@/modules/shared/store/useSnackbarStore";

export const SnackbarManager = () => {
  const messages = useSnackbarStore((state) => state.messages);
  const dismiss = useSnackbarStore((state) => state.dismiss);

  return <Snackbar messages={messages} onDismiss={dismiss} />;
};
