"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/modules/shared/store/useAuthStore";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    useAuthStore.getState()._init();
  }, []);

  return <>{children}</>;
}
