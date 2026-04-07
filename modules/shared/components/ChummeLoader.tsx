"use client";

import Image from "next/image";
import React from "react";

import { cn } from "@/modules/shared/utils";

export interface ChummeLoaderProps {
  isLoading?: boolean;
  isError?: boolean;
  fullScreen?: boolean;
  className?: string;
}

export const ChummeLoader = ({
  isLoading = true,
  isError = false,
  fullScreen = false,
  className,
}: ChummeLoaderProps) => {
  if (!isLoading && !isError) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-8 p-4 w-full h-full min-h-[200px]",
        fullScreen &&
          "fixed inset-0 z-[100] bg-background-primary/90 backdrop-blur-md",
        className,
      )}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Logo with breathing animation */}
          <div className="relative w-24 h-24 animate-breathe">
            <Image
              src="/logo.png"
              alt="Chumme Logo"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>

          {/* Staggered animated dots */}
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-brand-vibrant animate-dot-stagger-0" />
            <div className="w-3 h-3 rounded-full bg-brand-vibrant animate-dot-stagger-1" />
            <div className="w-3 h-3 rounded-full bg-brand-vibrant animate-dot-stagger-2" />
          </div>
        </div>
      ) : (
        <div className="text-center space-y-2 opacity-50">
          <p className="text-text-primary text-lg font-medium">
            Unable to load page
          </p>
        </div>
      )}
    </div>
  );
};
