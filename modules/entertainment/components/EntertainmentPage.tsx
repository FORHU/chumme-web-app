"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Film,
  Music,
  Video,
  Upload,
  Star,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Play,
} from "lucide-react";

interface EntertainmentPageProps {
  isDarkMode: boolean;
}

import { 
  contentStats, 
  contentItems, 
  tabs 
} from "@/modules/entertainment/constants/mock-data";

export function EntertainmentPage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContent = contentItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fandom.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1
            className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}
          >
            Entertainment Manager
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Manage content, streams, and entertainment features
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              isDarkMode
                ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Content
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Add Stream
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {contentStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`p-6 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-1`}
                  >
                    {stat.title}
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-500 mt-1">{stat.change}</p>
                </div>
                <div
                  className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <div
          className={`p-6 rounded-lg border ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white"
                        : isDarkMode
                          ? "text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-[#A53860]/50`}
                />
              </div>
              <button
                className={`p-2 rounded-lg border transition-colors ${
                  isDarkMode
                    ? "border-gray-700 text-gray-300 hover:bg-gray-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.05 * index }}
                className={`p-4 rounded-lg border transition-colors ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700 hover:bg-gray-800"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white text-xl">
                    {item.thumbnail}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-semibold truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {item.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.status === "Featured"
                            ? "bg-purple-100 text-purple-800"
                            : item.status === "Trending"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span
                        className={`flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        <Star className="w-3 h-3" />
                        {item.fandom}
                      </span>
                      <span
                        className={`flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </span>
                      <span
                        className={`flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        <Eye className="w-3 h-3" />
                        {item.views}
                      </span>
                      <span
                        className={`flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        <Heart className="w-3 h-3" />
                        {item.likes}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                          : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                          : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                      }`}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
