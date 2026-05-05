"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useMemo, useEffect } from "react";

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

  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      const originalMainClass = main.className;
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      
      main.classList.add("!h-full", "!overflow-hidden", "!flex", "!flex-col", "!p-0");
      
      const mainColumn = main.parentElement;
      if (mainColumn) {
        mainColumn.classList.add("!h-screen", "!overflow-hidden");
      }

      return () => {
        main.className = originalMainClass;
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        if (mainColumn) {
          mainColumn.classList.remove("!h-screen", "!overflow-hidden");
        }
      };
    }
  }, []);

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
    <div className="w-full flex-1 flex flex-col min-h-0 p-4 lg:p-8">
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
        className="flex-1 flex flex-col min-h-0"
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
