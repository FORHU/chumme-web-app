"use client";

import React, { useEffect, useRef } from "react";

import { useAuthStore } from "@/modules/shared/store/useAuthStore";

export interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const initialized = useRef<boolean>(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    useAuthStore.getState().initialize();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      useAuthStore.getState()._forceLogout();
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, []);

  return <>{children}</>;
};
