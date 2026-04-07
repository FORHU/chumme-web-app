"use client";

import { motion } from "framer-motion";
import { Star, Play, Download, Trash2 } from "lucide-react";

import type { Recording } from "@/modules/collaboration/types";

export interface RecordingsTableProps {
  isDarkMode: boolean;
  recordings: Recording[];
}

export const RecordingsTable = ({
  isDarkMode,
  recordings,
}: RecordingsTableProps) => {
  return (
    <motion.div
      key="recordings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`rounded-2xl border ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700/50"
            : "bg-white/80 border-gray-200/50"
        } backdrop-blur-xl overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkMode ? "bg-gray-900/50" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Recording Title
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Room
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Creator
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Duration
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Upload Date
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recordings.map((recording) => (
                <tr
                  key={recording.id}
                  className={`border-t ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"}`}
                >
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-white" : "text-gray-900"} font-medium`}
                  >
                    <div className="flex items-center gap-2">
                      {recording.title}
                      {recording.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {recording.room}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {recording.creator}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {recording.duration}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {recording.uploadDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                        title="Play"
                      >
                        <Play
                          className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                        />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? "hover:bg-yellow-500/20"
                            : "hover:bg-yellow-50"
                        }`}
                        title="Feature"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            recording.featured
                              ? "text-yellow-500 fill-current"
                              : "text-yellow-600"
                          }`}
                        />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? "hover:bg-blue-500/20"
                            : "hover:bg-blue-50"
                        }`}
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode ? "hover:bg-red-500/20" : "hover:bg-red-50"
                        }`}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
