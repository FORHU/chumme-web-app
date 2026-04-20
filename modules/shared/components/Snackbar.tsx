"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Download, Upload, X } from "lucide-react";
import { useEffect } from "react";

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
    color: "text-[#EF88AD]",
    bg: "bg-[#A53860]/20 border-[#A53860]/30",
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
  const duration = message.duration ?? 4000;
  const { Icon, color, bg } = iconMap[message.type];

  useEffect(() => {
    const timeout = setTimeout(() => onDismiss(message.id), duration);
    return () => clearTimeout(timeout);
  }, [message.id, duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
      className={`relative w-80 rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden ${bg} bg-gray-900/90`}
    >
      {/* Content */}
      <div className="flex items-center gap-3 p-3 min-h-[56px]">
        <div className={`shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-sm font-semibold text-white leading-tight">
            {message.title}
          </p>
          {message.description && (
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
              {message.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDismiss(message.id)}
          className="shrink-0 p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

    </motion.div>
  );
};

export const Snackbar = ({ messages, onDismiss }: SnackbarProps) => (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-9999 flex flex-col gap-3 pointer-events-none">
    <AnimatePresence mode="popLayout">
      {messages.map((msg) => (
        <div key={msg.id} className="pointer-events-auto">
          <SnackbarItem message={msg} onDismiss={onDismiss} />
        </div>
      ))}
    </AnimatePresence>
  </div>
);
