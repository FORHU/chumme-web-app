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
    useAuthStore.getState()._init();
  }, []);

  return <>{children}</>;
};
