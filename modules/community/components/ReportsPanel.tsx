"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  XCircle,
  CheckCircle,
  Ban,
  AlertTriangle,
  Eye,
  MessageSquare,
} from "lucide-react";
import { CommunityReport } from "@/modules/community/types";
import { communityReports } from "@/modules/community/constants/mock-data";

interface ReportsPanelProps {
  isDarkMode: boolean;
  searchTerm: string;
  selectedReport: CommunityReport | null;
  setSelectedReport: (report: CommunityReport | null) => void;
}

const ReportListItem = ({
  report,
  index,
  isSelected,
  onSelect,
  isDarkMode,
}: {
  report: CommunityReport;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  isDarkMode: boolean;
}) => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.05 * index }}
      onClick={onSelect}
      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
        isSelected
          ? "border-[#A53860] bg-[#A53860]/10"
          : isDarkMode
            ? "bg-gray-900 border-gray-700 hover:bg-gray-800"
            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              report.priority === "High"
                ? "bg-red-100 text-red-800"
                : report.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {report.priority}
          </span>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              report.status === "Pending"
                ? "bg-orange-100 text-orange-800"
                : report.status === "Under Review"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {report.status}
          </span>
        </div>
        <span
          className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          {report.timestamp}
        </span>
      </div>

      <h3
        className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-1`}
      >
        {report.type} in {report.community}
      </h3>
      <p
        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-2`}
      >
        Reported: @{report.reported} by @{report.reporter}
      </p>
      <p
        className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} line-clamp-2`}
      >
        {report.description}
      </p>
    </motion.div>
  );
};

const ReportDetailsPanel = ({
  selectedReport,
  onClose,
  isDarkMode,
}: {
  selectedReport: CommunityReport;
  onClose: () => void;
  isDarkMode: boolean;
}) => {
  return (
    <motion.div
      key={selectedReport.id}
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-6 rounded-lg border ${
        isDarkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3
            className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}
          >
            Report Details
          </h3>
          <p
            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Report ID: #{selectedReport.id}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:bg-gray-800"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p
            className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Community
          </p>
          <p
            className={`text-base ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            {selectedReport.community}
          </p>
        </div>
        <div>
          <p
            className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Report Type
          </p>
          <p
            className={`text-base ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            {selectedReport.type}
          </p>
        </div>
        <div>
          <p
            className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Description
          </p>
          <p
            className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            {selectedReport.description}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p
              className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Reporter
            </p>
            <p
              className={`text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              @{selectedReport.reporter}
            </p>
          </div>
          <div>
            <p
              className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Reported User
            </p>
            <p
              className={`text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              @{selectedReport.reported}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4
          className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Actions
        </h4>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
            <CheckCircle className="w-4 h-4" />
            Mark as Resolved
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
            <Ban className="w-4 h-4" />
            Ban User
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors">
            <AlertTriangle className="w-4 h-4" />
            Issue Warning
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              isDarkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Eye className="w-4 h-4" />
            View Evidence
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyReportSelection = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-6 rounded-lg border flex items-center justify-center ${
        isDarkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="text-center">
        <MessageSquare
          className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
        />
        <p
          className={`text-lg font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Select a report to view details
        </p>
      </div>
    </motion.div>
  );
};

export const ReportsPanel = ({
  isDarkMode,
  searchTerm,
  selectedReport,
  setSelectedReport,
}: ReportsPanelProps) => {
  const filteredReports = communityReports.filter(
    (report) =>
      report.community.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reported.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredReports.map((report, index) => (
            <ReportListItem
              key={report.id}
              report={report}
              index={index}
              isSelected={selectedReport?.id === report.id}
              onSelect={() => setSelectedReport(report)}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedReport ? (
            <ReportDetailsPanel
              selectedReport={selectedReport}
              onClose={() => setSelectedReport(null)}
              isDarkMode={isDarkMode}
            />
          ) : (
            <EmptyReportSelection isDarkMode={isDarkMode} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
