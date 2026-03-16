"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/modules/shared/utils";

export function AuthCard({
  children,
  className,
  tone = "auto",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "auto" | "light";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "w-full lg:w-[480px] rounded-2xl shadow-lg border p-10 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
