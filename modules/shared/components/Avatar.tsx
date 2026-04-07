"use client";

import Image from "next/image";
import React from "react";

import { cn } from "@/modules/shared/utils";

export type AvatarProps = React.HTMLAttributes<HTMLDivElement>;

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className,
        )}
        {...props}
      />
    );
  },
);

Avatar.displayName = "Avatar";

export type AvatarImageProps = Omit<
  React.ComponentPropsWithoutRef<typeof Image>,
  "alt"
> & {
  alt?: string;
};

export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof Image>,
  AvatarImageProps
>(({ className, alt = "", ...props }, ref) => {
  return (
    <Image
      ref={ref}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      unoptimized
      width={40}
      height={40}
      {...props}
    />
  );
});

AvatarImage.displayName = "AvatarImage";

export type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement>;

export const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  AvatarFallbackProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-background-tertiary text-text-secondary",
        className,
      )}
      {...props}
    />
  );
});

AvatarFallback.displayName = "AvatarFallback";
