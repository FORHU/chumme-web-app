"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useMemo } from "react";

import { useEntertainmentCategories } from "@/modules/entertainment/hooks/useEntertainment";
import type { ModalData } from "@/modules/entertainment/types";
import { ChummeLoader } from "@/modules/shared/components/ChummeLoader";

import { CategoriesTab } from "./CategoriesTab";
import { EntertainmentModal } from "./EntertainmentModal";
import { OverviewTab } from "./OverviewTab";
import { SubcategoriesTab } from "./SubcategoriesTab";
import { TopicsTab } from "./TopicsTab";

const tabs = [
  { id: "overview", name: "Overview" },
  { id: "categories", name: "Categories" },
  { id: "subcategories", name: "Subcategories" },
  { id: "topics", name: "Topics" },
];

export const EntertainmentPage = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState("overview");
  const [modalData, setModalData] = useState<ModalData>({ type: null });
  const closeModal = () => setModalData({ type: null });

  const {
    data: categories = [],
    isLoading,
    error,
  } = useEntertainmentCategories();

  const subcategories = useMemo(() => {
    return categories.flatMap((cat) =>
      (cat.chummeSubCategories || []).map((sub) => ({
        ...sub,
        categoryName: cat.name,
      })),
    );
  }, [categories]);

  const topics = useMemo(() => {
    return categories.flatMap((cat) =>
      (cat.chummeSubCategories || []).flatMap((sub) =>
        (sub.chummeTopicCategories || []).map((t) => ({
          ...t,
          categoryName: cat.name,
          subcategoryName: sub.name,
        })),
      ),
    );
  }, [categories]);

  const stats = useMemo(() => {
    return {
      totalCategories: categories.length,
      totalSubcategories: subcategories.length,
      totalTopics: topics.length,
      activeTopics: topics.length, // assuming all active for now
    };
  }, [categories, subcategories, topics]);

  if (isLoading) return <ChummeLoader />;
  if (error)
    return (
      <div className="p-8 text-red-500">Error loading entertainment data.</div>
    );

  return (
    <div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1
          className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Entertainment Manager
        </h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Manage entertainment structure: Categories, Subcategories, and Topics
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div
          className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#A53860] text-[#A53860]"
                    : isDark
                      ? "border-transparent text-gray-400 hover:text-gray-300"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        key={activeTab}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === "overview" && (
          <OverviewTab isDark={isDark} stats={stats} categories={categories} />
        )}
        {activeTab === "categories" && (
          <CategoriesTab
            isDark={isDark}
            setModalData={setModalData}
            categories={categories}
          />
        )}
        {activeTab === "subcategories" && (
          <SubcategoriesTab
            isDark={isDark}
            setModalData={setModalData}
            subcategories={subcategories}
          />
        )}
        {activeTab === "topics" && (
          <TopicsTab
            isDark={isDark}
            setModalData={setModalData}
            topics={topics}
          />
        )}
      </motion.div>

      {modalData.type && (
        <EntertainmentModal
          key={modalData.item?.id || modalData.type}
          isDark={isDark}
          modalData={modalData}
          closeModal={closeModal}
          categories={categories}
          subcategories={subcategories}
        />
      )}
    </div>
  );
};
