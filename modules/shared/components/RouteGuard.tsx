"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";

import { ChummeLoader } from "@/modules/shared/components/ChummeLoader";
import { useAuthStore } from "@/modules/shared/store/useAuthStore";

export interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const RouteGuard = ({
  children,
  requireAuth = true,
}: RouteGuardProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.replace("/auth");
    }

    if (
      !requireAuth &&
      isAuthenticated &&
      (pathname === "/" ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/verify-email") ||
        pathname.startsWith("/onboarding"))
    ) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, requireAuth, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <ChummeLoader />
      </div>
    );
  }

  return <>{children}</>;
};
