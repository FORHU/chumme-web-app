"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Download, Upload, X } from "lucide-react";

export type SnackbarType = "success" | "error" | "download" | "upload";

export interface SnackbarMessage {
  id: string;
  type: SnackbarType;
  title: string;
  description?: string;
  duration?: number;
}

interface SnackbarProps {
  messages: SnackbarMessage[];
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: {
    Icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-500/20 border-green-500/30",
  },
  error: {
    Icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/20 border-red-500/30",
  },
  download: {
    Icon: Download,
    color: "text-[#EF88AD]",
    bg: "bg-[#A53860]/20 border-[#A53860]/30",
  },
  upload: {
    Icon: Upload,
    color: "text-[#EF88AD]",
    bg: "bg-[#A53860]/20 border-[#A53860]/30",
  },
};

const SnackbarItem = ({
  message,
  onDismiss,
}: {
  message: SnackbarMessage;
  onDismiss: (id: string) => void;
}) => {
  const [progress, setProgress] = useState(100);
  const duration = message.duration ?? 4000;
  const { Icon, color, bg } = iconMap[message.type];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - 100 / (duration / 100);
        if (next <= 0) {
          clearInterval(interval);
          return 0;
        }
        return next;
      });
    }, 100);

    const timeout = setTimeout(() => onDismiss(message.id), duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [message.id, duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`relative w-80 rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden ${bg} bg-gray-900/90`}
    >
      {/* Content */}
      <div className="flex items-start gap-3 p-4">
        <div className={`mt-0.5 shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">
            {message.title}
          </p>
          {message.description && (
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              {message.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDismiss(message.id)}
          className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-white/10">
        <motion.div
          className={`h-full ${
            message.type === "error"
              ? "bg-red-400"
              : message.type === "success"
                ? "bg-green-400"
                : "bg-[#EF88AD]"
          }`}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
};

export const Snackbar = ({ messages, onDismiss }: SnackbarProps) => (
  <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3 pointer-events-none">
    <AnimatePresence mode="popLayout">
      {messages.map((msg) => (
        <div key={msg.id} className="pointer-events-auto">
          <SnackbarItem message={msg} onDismiss={onDismiss} />
        </div>
      ))}
    </AnimatePresence>
  </div>
);
