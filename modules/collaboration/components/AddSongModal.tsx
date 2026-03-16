"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AddSongModalProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, artist: string) => void;
}

export function AddSongModal({
  isDarkMode,
  isOpen,
  onClose,
  onSubmit,
}: AddSongModalProps) {
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");

  const handleSubmit = () => {
    onSubmit(songTitle, songArtist);
    setSongTitle("");
    setSongArtist("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-2xl p-6 ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            } shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Add Song
              </h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Song Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Dynamite"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className={`w-full h-12 px-4 rounded-xl text-sm transition-all ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                  } border focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Artist
                </label>
                <input
                  type="text"
                  placeholder="e.g., BTS"
                  value={songArtist}
                  onChange={(e) => setSongArtist(e.target.value)}
                  className={`w-full h-12 px-4 rounded-xl text-sm transition-all ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                  } border focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className={`flex-1 h-12 rounded-xl font-semibold transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 h-12 bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                Add Song
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
