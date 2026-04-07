"use client";

import * as React from "react";

import { cn } from "@/modules/shared/utils";

type SelectContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedLabel: string | null;
  registerOption: (value: string, label: string) => void;
  selectOption: (value: string, label: string) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const optionsRef = React.useRef<Map<string, string>>(new Map());
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);

  const registerOption = React.useCallback(
    (optValue: string, label: string) => {
      optionsRef.current.set(optValue, label);
      if (value !== undefined && value === optValue) {
        setSelectedLabel(label);
      }
    },
    [value],
  );

  const selectOption = React.useCallback(
    (nextValue: string, label: string) => {
      setSelectedLabel(label);
      onValueChange?.(nextValue);
      setOpen(false);
    },
    [onValueChange],
  );

  React.useEffect(() => {
    if (value === undefined) return;
    const label = optionsRef.current.get(value);
    if (label) setSelectedLabel(label);
  }, [value]);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        open,
        setOpen,
        selectedLabel,
        registerOption,
        selectOption,
      }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export type SelectTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(({ className, children, type, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);

  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A53860]/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onClick={(e) => {
        props.onClick?.(e);
        ctx?.setOpen(!ctx.open);
      }}
      {...props}
    >
      {children}
      <svg
        className="ml-2 h-4 w-4 opacity-60"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
});

SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export function SelectValue({
  placeholder,
  className,
  ...props
}: SelectValueProps) {
  const ctx = React.useContext(SelectContext);
  const text = ctx?.selectedLabel ?? ctx?.value ?? "";

  return (
    <span className={cn("truncate", className)} {...props}>
      {text ? text : placeholder}
    </span>
  );
}

export type SelectContentProps = React.HTMLAttributes<HTMLDivElement>;

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectContentProps
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);
  if (!ctx?.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

SelectContent.displayName = "SelectContent";

export interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, children, value, type, ...props }, ref) => {
    const ctx = React.useContext(SelectContext);
    const label = React.useMemo(() => {
      if (typeof children === "string") return children;
      return String(value);
    }, [children, value]);

    React.useEffect(() => {
      ctx?.registerOption(value, label);
    }, [ctx, label, value]);

    const isSelected = ctx?.value === value;

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
          isSelected ? "font-medium text-[#A53860]" : "text-gray-700",
          className,
        )}
        onClick={(e) => {
          props.onClick?.(e);
          ctx?.selectOption(value, label);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);

SelectItem.displayName = "SelectItem";
