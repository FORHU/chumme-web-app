"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Modal } from "./Modal";
import { cn } from "@/modules/shared/utils";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDark?: boolean;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  isDark = false,
}: DeleteConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className={cn("p-6", isDark ? "bg-[#1a2035] text-white" : "bg-white text-gray-900")}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className={cn("p-2 rounded-lg transition-colors", isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")}
          >
            <X className={cn("w-5 h-5", isDark ? "text-gray-400" : "text-gray-500")} />
          </button>
        </div>

        <p className={cn("text-sm mb-8", isDark ? "text-gray-400" : "text-gray-600")}>
          {description}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              "px-6 h-11 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50",
              isDark ? "bg-[#243050] text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 h-11 rounded-xl font-semibold text-sm bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
