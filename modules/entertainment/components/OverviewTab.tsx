"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import type { EntertainmentCategory } from "@/modules/entertainment/types/api.types";

export interface OverviewTabProps {
  isDark: boolean;
  stats: {
    totalCategories: number;
    totalSubcategories: number;
    totalTopics: number;
    activeTopics: number;
  };
  categories: EntertainmentCategory[];
}

export const OverviewTab = ({ isDark, stats, categories }: OverviewTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((cat) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    // Match category name
    if (cat.name.toLowerCase().includes(term)) return true;

    // Match any subcategory name
    if (cat.chummeSubCategories?.some((sub) =>
      sub.name.toLowerCase().includes(term) ||
      sub.chummeTopicCategories?.some((topic) =>
        topic.name.toLowerCase().includes(term)
      )
    )) return true;

    return false;
  });

  const dynamicStats = [
    { label: "Total Categories", value: stats.totalCategories.toString() },
    { label: "Total Subcategories", value: stats.totalSubcategories.toString() },
    { label: "Total Topics", value: stats.totalTopics.toString() },
    { label: "Active Topics", value: stats.activeTopics.toString() },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className={`p-6 rounded-lg border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Entertainment Structure - Collapsible */}
      <div className={`rounded-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        
        {/* Card Header */}
        <div className={`px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Entertainment Structure
            </h3>
            <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {filteredCategories.length} of {categories.length} categories
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative mt-3">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories, subcategories, topics..."
              className={`w-full h-10 pl-9 pr-4 rounded-lg border text-sm outline-none transition-all ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-[#A53860]"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A53860]"
              } focus:ring-2 focus:ring-[#A53860]/10`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium transition-colors ${
                  isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Accordion List */}
        {filteredCategories.length > 0 ? (
          <div className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
            {filteredCategories.map((cat) => (
              <CategoryAccordion
                key={cat.id}
                category={cat}
                isDark={isDark}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Search className={`w-8 h-8 mx-auto mb-3 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
            <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              No results for "{searchTerm}"
            </p>
            <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Try searching for a category, subcategory, or topic name
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

function CategoryAccordion({
  category,
  isDark,
  searchTerm,
}: {
  category: EntertainmentCategory;
  isDark: boolean;
  searchTerm: string;
}) {
  const hasMatch =
    searchTerm &&
    (category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.chummeSubCategories?.some(
        (sub) =>
          sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.chummeTopicCategories?.some((topic) =>
            topic.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      ));

  const [open, setOpen] = useState(false);
  const isOpen = open || !!hasMatch;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${
          isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
        }`}
      >
        <span className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
          {category.name}
        </span>
        {isOpen ? (
          <ChevronDown className={`w-4 h-4 shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        ) : (
          <ChevronRight className={`w-4 h-4 shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        )}
      </button>

      {isOpen && (
        <div className={`px-6 pb-4 ${isDark ? "border-t border-gray-700/50" : "border-t border-gray-100"}`}>
          {category.chummeSubCategories && category.chummeSubCategories.length > 0 ? (
            <div className="mt-3 space-y-3">
              {category.chummeSubCategories.map((sub) => (
                <SubCategoryAccordion key={sub.id} sub={sub} isDark={isDark} searchTerm={searchTerm} />
              ))}
            </div>
          ) : (
            <p className={`mt-3 text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              No subcategories
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SubCategoryAccordion({
  sub,
  isDark,
  searchTerm,
}: {
  sub: EntertainmentCategory["chummeSubCategories"][number];
  isDark: boolean;
  searchTerm: string;
}) {
  const hasTopicMatch =
    searchTerm &&
    sub.chummeTopicCategories?.some((topic) =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const isSubMatch =
    searchTerm && sub.name.toLowerCase().includes(searchTerm.toLowerCase());

  const [open, setOpen] = useState(false);
  const isOpen = open || !!hasTopicMatch || !!isSubMatch;

  const topics = sub.chummeTopicCategories || [];

  return (
    <div className={`rounded-lg border ${isDark ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50"}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors rounded-lg ${
          isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronDown className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          ) : (
            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          )}
          <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {sub.name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"
          }`}>
            {topics.length} topics
          </span>
        </div>
      </button>

      {isOpen && (
        <div className={`px-4 pb-3 ${isDark ? "border-t border-gray-700/50" : "border-t border-gray-200"}`}>
          {topics.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.map((topic) => {
                const isTopicMatch =
                  searchTerm &&
                  topic.name.toLowerCase().includes(searchTerm.toLowerCase());
                return (
                  <span
                    key={topic.id}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      isTopicMatch
                        ? "bg-[#A53860] text-white border border-[#A53860] ring-2 ring-[#A53860]/30"
                        : isDark
                        ? "bg-[#A53860]/20 text-[#EF88AD] border border-[#A53860]/30"
                        : "bg-[#A53860]/10 text-[#A53860] border border-[#A53860]/20"
                    }`}
                  >
                    {topic.name}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className={`mt-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              No topics
            </p>
          )}
        </div>
      )}
    </div>
  );
}
