"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

import { tabs } from "@/modules/discover/constants/mock-data";
import { OverviewTab } from "@/modules/discover/components/OverviewTab";
import { LinksTab } from "@/modules/discover/components/LinksTab";
import { FeaturedTab } from "@/modules/discover/components/FeaturedTab";
import { ReportsTab } from "@/modules/discover/components/ReportsTab";

import type { DiscoverTabId } from "@/modules/discover/types";

export const DiscoverPage = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState<DiscoverTabId>("overview");

  return (
    <div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1
          className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}
        >
          Discover Manager
        </h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Manage social media links appearing in Discover feed
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div
          className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#A53860] text-[#A53860]"
                    : isDarkMode
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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === "overview" && <OverviewTab isDarkMode={isDarkMode} />}
          {activeTab === "links" && <LinksTab isDarkMode={isDarkMode} />}
          {activeTab === "featured" && <FeaturedTab isDarkMode={isDarkMode} />}
          {activeTab === "reports" && <ReportsTab isDarkMode={isDarkMode} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
