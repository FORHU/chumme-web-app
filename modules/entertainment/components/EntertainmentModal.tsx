"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { ModalData } from "@/modules/entertainment/types";
import type {
  EntertainmentCategory,
  SubCategory,
} from "@/modules/entertainment/types/api.types";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
  useCreateTopicCategory,
  useUpdateTopicCategory,
  useDeleteTopicCategory,
} from "@/modules/entertainment/hooks/useEntertainment";

interface EntertainmentModalProps {
  isDark: boolean;
  modalData: ModalData;
  closeModal: () => void;
  categories: EntertainmentCategory[];
  subcategories: (SubCategory & { categoryName: string })[];
}

export const EntertainmentModal = ({
  isDark,
  modalData,
  closeModal,
  categories,
  subcategories,
}: EntertainmentModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, setStatus] = useState("Active");

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const createSubCategory = useCreateSubCategory();
  const updateSubCategory = useUpdateSubCategory();
  const deleteSubCategory = useDeleteSubCategory();
  const createTopicCategory = useCreateTopicCategory();
  const updateTopicCategory = useUpdateTopicCategory();
  const deleteTopicCategory = useDeleteTopicCategory();

  const isLoading =
    createCategory.isPending ||
    updateCategory.isPending ||
    deleteCategory.isPending ||
    createSubCategory.isPending ||
    updateSubCategory.isPending ||
    deleteSubCategory.isPending ||
    createTopicCategory.isPending ||
    updateTopicCategory.isPending ||
    deleteTopicCategory.isPending;

  // Pre-fill form when editing
  useEffect(() => {
    if (modalData.item) {
      setName((modalData.item.name as string) || "");
      setDescription((modalData.item.description as string) || "");
      setSelectedCategoryId((modalData.item.chummeCategoryId as string) || "");
      setSelectedSubcategoryId(
        (modalData.item.chummeSubCategoryId as string) || "",
      );
    } else {
      setName("");
      setDescription("");
      setSelectedCategoryId(categories[0]?.id || "");
      setSelectedSubcategoryId(subcategories[0]?.id || "");
      setStatus("Active");
    }
  }, [modalData, categories, subcategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      switch (modalData.type) {
        case "create-category":
          await createCategory.mutateAsync({
            name: name.trim(),
            note: description.trim() || undefined,
            isAd: false,
            chummeTrait: "ENTERTAINMENT",
          });
          break;

        case "edit-category":
          await updateCategory.mutateAsync({
            id: modalData.item!.id as string,
            data: {
              name: name.trim(),
              note: description.trim() || undefined,
            },
          });
          break;

        case "create-subcategory":
          if (!selectedCategoryId) return;
          await createSubCategory.mutateAsync({
            name: name.trim(),
            chummeCategoryId: selectedCategoryId,
            note: description.trim() || undefined,
            isAd: false,

          });
          break;

        case "edit-subcategory":
          await updateSubCategory.mutateAsync({
            id: modalData.item!.id as string,
            data: {
              name: name.trim(),
              note: description.trim() || undefined,
            },
          });
          break;

        case "add-topic":
          if (!selectedSubcategoryId) return;
          await createTopicCategory.mutateAsync({
            name: name.trim(),
            chummeSubCategoryId: selectedSubcategoryId,
            note: description.trim() || undefined,
            isAd: false,

          });
          break;

        case "edit-topic":
          await updateTopicCategory.mutateAsync({
            id: modalData.item!.id as string,
            data: {
              name: name.trim(),
              note: description.trim() || undefined,
            },
          });
          break;

        default:
          break;
      }
      closeModal();
    } catch (err: unknown) {
      console.error("[EntertainmentModal] Submit error:", err);
    }
  };

  const handleDelete = async () => {
    if (!modalData.item) return;
    try {
      const itemType = modalData.item.itemType as string;
      if (itemType === "category") {
        await deleteCategory.mutateAsync(modalData.item.id as string);
      } else if (itemType === "subcategory") {
        await deleteSubCategory.mutateAsync(modalData.item.id as string);
      } else if (itemType === "topic") {
        await deleteTopicCategory.mutateAsync(modalData.item.id as string);
      }
      closeModal();
    } catch (err: unknown) {
      console.error("[EntertainmentModal] Delete error:", err);
    }
  };

  const inputClass = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${isDark
    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-[#A53860]"
    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A53860]"
    } focus:ring-2 focus:ring-[#A53860]/10`;

  const labelClass = `block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"
    }`;

  const selectClass = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${isDark
    ? "bg-gray-800 border-gray-700 text-white focus:border-[#A53860]"
    : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#A53860]"
    } focus:ring-2 focus:ring-[#A53860]/10`;

  const getTitle = () => {
    switch (modalData.type) {
      case "create-category": return "Create Category";
      case "edit-category": return "Edit Category";
      case "create-subcategory": return "Create Subcategory";
      case "edit-subcategory": return "Edit Subcategory";
      case "add-topic": return "Add Topic";
      case "edit-topic": return "Edit Topic";
      case "delete-confirm": return `Delete "${modalData.item?.name}"?`;
      default: return "";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${isDark
            ? "bg-gray-900 border border-gray-700"
            : "bg-white border border-gray-200"
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              {getTitle()}
            </h3>
            <button
              onClick={closeModal}
              className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
            >
              <X
                className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"
                  }`}
              />
            </button>
          </div>

          {/* Delete Confirmation */}
          {modalData.type === "delete-confirm" ? (
            <div>
              <p
                className={`mb-6 text-sm ${isDark ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Are you sure you want to delete{" "}
                <span className="font-semibold">&quot;{modalData.item?.name}&quot;</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  disabled={isLoading}
                  className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-colors ${isDark
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } disabled:opacity-50`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 h-11 rounded-xl font-semibold text-sm bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ) : (
            /* Create / Edit Form */
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name field — always shown */}
              <div>
                <label className={labelClass}>
                  {modalData.type === "create-category" ||
                    modalData.type === "edit-category"
                    ? "Category Name"
                    : modalData.type === "create-subcategory" ||
                      modalData.type === "edit-subcategory"
                      ? "Subcategory Name"
                      : "Topic Name"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`Enter ${modalData.type?.includes("category") && !modalData.type?.includes("subcategory")
                    ? "category"
                    : modalData.type?.includes("subcategory")
                      ? "subcategory"
                      : "topic"
                    } name`}
                  className={inputClass}
                  required
                  autoFocus
                />
              </div>

              {/* Parent Category selector — for subcategory create */}
              {modalData.type === "create-subcategory" && (
                <div>
                  <label className={labelClass}>Parent Category</label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className={selectClass}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Parent Subcategory selector — for topic create */}
              {modalData.type === "add-topic" && (
                <div>
                  <label className={labelClass}>Parent Subcategory</label>
                  <select
                    value={selectedSubcategoryId}
                    onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                    className={selectClass}
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.categoryName} → {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description / Note — for category and subcategory and topic (since topics have notes too) */}
              {(modalData.type === "create-category" ||
                modalData.type === "edit-category" ||
                modalData.type === "create-subcategory" ||
                modalData.type === "edit-subcategory" ||
                modalData.type === "add-topic" ||
                modalData.type === "edit-topic") && (
                  <div>
                    <label className={labelClass}>Description / Note</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description"
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                )}

              {/* Error message */}
              {(createCategory.isError ||
                updateCategory.isError ||
                createSubCategory.isError ||
                createTopicCategory.isError) && (
                  <p className="text-red-500 text-sm">
                    {(
                      createCategory.error ||
                      updateCategory.error ||
                      createSubCategory.error ||
                      createTopicCategory.error
                    )?.message || "Something went wrong. Please try again."}
                  </p>
                )}

              {/* Footer buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isLoading}
                  className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-colors ${isDark
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } disabled:opacity-50`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="flex-1 h-11 rounded-xl font-semibold text-sm bg-linear-to-r from-[#A53860] to-[#670D2F] text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading
                    ? modalData.type?.includes("edit")
                      ? "Saving..."
                      : "Creating..."
                    : modalData.type?.includes("edit")
                      ? "Save Changes"
                      : "Create"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
