"use client";

import { motion } from "framer-motion";
import { Eye, Ban, Trash2 } from "lucide-react";

import type { CollaborationRoom } from "@/modules/collaboration/types";

export interface RoomsTableProps {
  isDarkMode: boolean;
  rooms: CollaborationRoom[];
}

export const RoomsTable = ({ isDarkMode, rooms }: RoomsTableProps) => {
  return (
    <motion.div
      key="rooms"
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
                  Room Name
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Type
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Host
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Participants
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Song
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
                    {room.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        room.type === "Public"
                          ? "bg-blue-500/20 text-blue-600"
                          : "bg-purple-500/20 text-purple-600"
                      }`}
                    >
                      {room.type}
                    </span>
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
                        title="View Room"
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
                        title="Remove User"
                      >
                        <Ban className="w-4 h-4 text-yellow-600" />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode ? "hover:bg-red-500/20" : "hover:bg-red-50"
                        }`}
                        title="End Room"
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
