"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, ChevronDown, Hash, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ModalData } from "@/modules/entertainment/types";
import type { EntertainmentCategory } from "@/modules/entertainment/types/api.types";

interface CategoriesTabProps {
  isDark: boolean;
  setModalData: (d: ModalData) => void;
  categories: EntertainmentCategory[];
}

export const CategoriesTab = ({
  isDark,
  setModalData,
  categories,
}: CategoriesTabProps) => {
  const [expandedKeywords, setExpandedKeywords] = useState<string | null>(null);

  const toggleKeywords = (id: string) => {
    setExpandedKeywords(expandedKeywords === id ? null : id);
  };

  const cardClass = `rounded-xl border transition-all ${
    isDark ? "bg-gray-800/50 border-gray-700/50" : "bg-white border-gray-200"
  }`;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Categories
          </h2>
          <p
            className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {categories.length} entertainment categories
          </p>
        </div>
        <button
          onClick={() => setModalData({ type: "create-category" })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Category Cards */}
      <div className="space-y-3">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cardClass}
          >
            {/* Main Row */}
            <div className="flex items-center gap-4 px-5 py-4">
              {/* Color accent */}
              <div className="w-1 h-12 rounded-full bg-gradient-to-b from-[#A53860] to-[#670D2F] flex-shrink-0" />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3
                    className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {cat.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      isDark
                        ? "bg-green-900/30 text-green-400"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    Active
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      isDark
                        ? "bg-gray-700 text-gray-400"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {cat.chummeSubCategories?.length ?? 0} subcategories
                  </span>
                </div>
                <p
                  className={`text-sm truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {cat.note ?? "—"}
                </p>
              </div>

              {/* Discovery Keywords Toggle */}
              {cat.discoveryKeywords && cat.discoveryKeywords.length > 0 && (
                <button
                  onClick={() => toggleKeywords(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    expandedKeywords === cat.id
                      ? "bg-[#A53860]/20 text-[#EF88AD] border border-[#A53860]/30"
                      : isDark
                        ? "bg-gray-700/50 text-gray-400 border border-gray-700 hover:border-[#A53860]/40 hover:text-[#EF88AD]"
                        : "bg-gray-100 text-gray-500 border border-gray-200 hover:border-[#A53860]/40 hover:text-[#A53860]"
                  }`}
                >
                  <Hash className="w-3 h-3" />
                  {cat.discoveryKeywords.length} keywords
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      expandedKeywords === cat.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setModalData({
                      type: "edit-category",
                      item: {
                        id: cat.id,
                        name: cat.name,
                        description: cat.note ?? "",
                        discoveryKeywords: cat.discoveryKeywords ?? [],
                      },
                    })
                  }
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setModalData({
                      type: "delete-confirm",
                      item: {
                        id: cat.id,
                        name: cat.name,
                        itemType: "category",
                      },
                    })
                  }
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-red-900/20 text-red-400"
                      : "hover:bg-red-50 text-red-500"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expandable Discovery Keywords */}
            <AnimatePresence>
              {expandedKeywords === cat.id && cat.discoveryKeywords && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`px-5 pb-4 border-t ${
                      isDark ? "border-gray-700/50" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 mt-3 mb-3">
                      <Tag
                        className={`w-3.5 h-3.5 ${isDark ? "text-[#EF88AD]" : "text-[#A53860]"}`}
                      />
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Discovery Keywords
                      </span>
                      <span
                        className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}
                      >
                        — used by the discovery algorithm to find content
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.discoveryKeywords.map((keyword, ki) => (
                        <motion.span
                          key={keyword}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: ki * 0.04 }}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-mono font-medium ${
                            isDark
                              ? "bg-[#A53860]/10 text-[#EF88AD] border border-[#A53860]/20"
                              : "bg-[#A53860]/8 text-[#A53860] border border-[#A53860]/15"
                          }`}
                        >
                          <Hash className="w-2.5 h-2.5 opacity-70" />
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
