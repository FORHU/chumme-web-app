"use client";
import { motion } from "framer-motion";
import { Eye, Ban, X } from "lucide-react";
import type { CollabRoom } from "@/modules/collaboration/types";

interface PrivateRoomsTableProps {
  isDarkMode: boolean;
  rooms: CollabRoom[];
}

export function PrivateRoomsTable({ isDarkMode, rooms }: PrivateRoomsTableProps) {
  return (
    <motion.div
      key="private"
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
                  Room ID
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Host
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Members
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Song
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Reports
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
              {rooms.map((room) => (
                <tr
                  key={room.id}
                  className={`border-t ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"}`}
                >
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-white" : "text-gray-900"} font-medium`}
                  >
                    {room.id}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {room.host}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {room.participants}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {room.song}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    0
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        room.status === "Active"
                          ? "bg-green-500/20 text-green-600"
                          : "bg-gray-500/20 text-gray-600"
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                        title="View Activity"
                      >
                        <Eye
                          className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                        />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? "hover:bg-yellow-500/20"
                            : "hover:bg-yellow-50"
                        }`}
                        title="Suspend Room"
                      >
                        <Ban className="w-4 h-4 text-yellow-600" />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode ? "hover:bg-red-500/20" : "hover:bg-red-50"
                        }`}
                        title="Close Room"
                      >
                        <X className="w-4 h-4 text-red-500" />
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
}
