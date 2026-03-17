"use client";

import { motion } from "framer-motion";
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
  const dynamicStats = [
    { label: "Total Categories", value: stats.totalCategories.toString() },
    { label: "Total Subcategories", value: stats.totalSubcategories.toString() },
    { label: "Total Topics", value: stats.totalTopics.toString() },
    { label: "Active Topics", value: stats.activeTopics.toString() },
  ];

  const tree = Object.fromEntries(
    categories.map((cat) => [
      cat.name,
      Object.fromEntries(
        (cat.chummeSubCategories || []).map((sub) => [
          sub.name,
          (sub.chummeTopicCategories || []).map((t) => t.name),
        ])
      ),
    ])
  );

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

      <div className={`p-6 rounded-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          Entertainment Structure
        </h3>
        <div className={`font-mono text-sm space-y-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {Object.entries(tree).map(([cat, subs]) => (
            <div key={cat}>
              <p className="font-semibold">{cat}</p>
              {Object.entries(subs as Record<string, string[]>).map(([sub, topicList], si, sarr) => (
                <div key={sub}>
                  <p className="ml-4">{si < sarr.length - 1 ? "├" : "└"} {sub}</p>
                  {topicList.map((t, ti) => (
                    <p key={t} className="ml-10">
                      │ {ti < topicList.length - 1 ? "├" : "└"} {t}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
