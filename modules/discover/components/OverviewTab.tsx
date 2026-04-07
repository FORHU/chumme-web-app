"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  analyticsData,
  fandomActivityData,
  overviewStats,
} from "@/modules/discover/constants/mock-data";

interface OverviewTabProps {
  isDarkMode: boolean;
}

export const OverviewTab = ({ isDarkMode }: OverviewTabProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className={`p-6 rounded-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-1`}
              >
                {stat.label}
              </p>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-lg border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}
          >
            Trending Topics Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                  const safePercent = typeof percent === "number" ? percent : 0;
                  return `${name} ${(safePercent * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                dataKey="value"
              >
                {analyticsData.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div
          className={`p-6 rounded-lg border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}
          >
            Most Popular Topics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fandomActivityData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#374151" : "#E5E7EB"}
              />
              <XAxis
                dataKey="fandom"
                stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
              <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                  border: `1px solid ${isDarkMode ? "#374151" : "#E5E7EB"}`,
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="posts" fill="#A53860" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
