"use client";

import { motion } from "framer-motion";
import { Plus, Edit, VolumeX, Volume2, Trash2 } from "lucide-react";
import type { Song } from "@/modules/collaboration/types";

export interface SongLibraryProps {
  isDarkMode: boolean;
  songs: Song[];
  onAddSong: () => void;
}

export const SongLibrary = ({
  isDarkMode,
  songs,
  onAddSong,
}: SongLibraryProps) => {
  return (
    <motion.div
      key="songs"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <button
          onClick={onAddSong}
          className="w-full h-12 bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Add Song
        </button>
      </div>

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
                  Song Title
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Artist
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Usage Count
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
              {songs.map((song) => (
                <tr
                  key={song.id}
                  className={`border-t ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"}`}
                >
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-white" : "text-gray-900"} font-medium`}
                  >
                    {song.title}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {song.artist}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {song.usageCount} uses
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        song.status === "Active"
                          ? "bg-green-500/20 text-green-600"
                          : "bg-gray-500/20 text-gray-600"
                      }`}
                    >
                      {song.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                      >
                        <Edit
                          className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                        />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? "hover:bg-yellow-500/20"
                            : "hover:bg-yellow-50"
                        }`}
                        title="Disable"
                      >
                        {song.status === "Active" ? (
                          <VolumeX className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-green-600" />
                        )}
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode ? "hover:bg-red-500/20" : "hover:bg-red-50"
                        }`}
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
