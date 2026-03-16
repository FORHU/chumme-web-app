"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/modules/shared/utils";
import { useTheme } from "next-themes";

export function AuthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "w-full lg:w-[480px] rounded-2xl shadow-lg border p-10",
        isDark
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-200",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
