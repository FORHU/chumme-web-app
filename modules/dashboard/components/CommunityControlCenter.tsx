import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { 
  CommunityReport, 
} from "@/modules/community/types";
import {
  Search,
  Filter,
  Shield,
} from "lucide-react";
import { 
  communityStats,
  tabs,
} from "@/modules/community/constants/mock-data";

// Components
import { OverviewPanel } from "@/modules/community/components/OverviewPanel";
import { ReportsPanel } from "@/modules/community/components/ReportsPanel";
import { CommunitiesList } from "@/modules/community/components/CommunitiesList";
import { ActionsLog } from "@/modules/community/components/ActionsLog";

interface CommunityControlCenterProps {
  isDarkMode: boolean;
}

export function CommunityControlCenter({ isDarkMode }: CommunityControlCenterProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
            Community Control Center
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Monitor and moderate community activity across the platform
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
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90 transition-opacity">
            <Shield className="w-4 h-4" />
            Emergency Mode
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {communityStats.map((stat, index) => {
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
                  <p
                    className={`text-sm mt-1 ${
                      stat.change.startsWith("+") ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
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

            {(activeTab === "reports" || activeTab === "communities") && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-[#A53860]/50`}
                  />
                </div>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "overview" && <OverviewPanel isDarkMode={isDarkMode} />}
            {activeTab === "reports" && (
              <ReportsPanel
                isDarkMode={isDarkMode}
                searchTerm={searchTerm}
                selectedReport={selectedReport}
                setSelectedReport={setSelectedReport}
              />
            )}
            {activeTab === "communities" && (
              <CommunitiesList isDarkMode={isDarkMode} searchTerm={searchTerm} />
            )}
            {activeTab === "actions" && <ActionsLog isDarkMode={isDarkMode} />}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
