"use client";

import * as React from "react";
import { cn } from "@/modules/shared/utils";

type DialogContextValue = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

export interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export type DialogContentProps = React.HTMLAttributes<HTMLDivElement>;

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(DialogContext);
    if (!ctx?.open) return null;

    return (
      <div className="fixed inset-0 z-50">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => ctx.onOpenChange?.(false)}
          aria-hidden="true"
        />
        <div
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl outline-none",
            className,
          )}
          role="dialog"
          aria-modal="true"
          {...props}
        >
          {children}
        </div>
      </div>
    );
  },
);

DialogContent.displayName = "DialogContent";

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

export type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <h2
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps) {
  return (
    <p className={cn("text-sm text-gray-500", className)} {...props} />
  );
}
