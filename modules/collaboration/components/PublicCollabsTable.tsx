"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { PublicCollab } from "@/modules/collaboration/types";

export interface PublicCollabsTableProps {
  isDarkMode: boolean;
  collabs: PublicCollab[];
}

export const PublicCollabsTable = ({ isDarkMode, collabs }: PublicCollabsTableProps) => {
  return (
    <motion.div
      key="public"
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
                  Collab Title
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Creator
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Category
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Participants
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Start Date
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Status
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {collabs.map((collab) => (
                <tr
                  key={collab.id}
                  className={`border-t ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"}`}
                >
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-white" : "text-gray-900"} font-medium`}
                  >
                    {collab.title}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {collab.creator}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {collab.category}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {collab.participants}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {collab.startDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        collab.status === "Approved"
                          ? "bg-green-500/20 text-green-600"
                          : collab.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-600"
                            : "bg-red-500/20 text-red-600"
                      }`}
                    >
                      {collab.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {collab.status === "Pending" && (
                        <>
                          <button className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors">
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? "hover:bg-yellow-500/20"
                            : "hover:bg-yellow-50"
                        }`}
                        title="Feature"
                      >
                        <Star className="w-4 h-4 text-yellow-600" />
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
