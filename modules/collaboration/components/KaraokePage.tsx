"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Eye, X } from "lucide-react";
import { mockKaraokeSongs, mockKaraokeRecordings } from "@/modules/collaboration/constants/mock-data";
import type { KaraokeTabId } from "@/modules/collaboration/types";

export const KaraokePage = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<KaraokeTabId>("songs");

  const labelClass = `block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`;

  return (
    <div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Karaoke Management</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>Manage karaoke songs, lyrics, and fan recordings</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Karaoke Songs", value: "1,200" },
          { label: "Most Sung Song", value: "Dynamite" },
          { label: "Active Tracks", value: "980" },
          { label: "Total Recordings", value: "5,400" },
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 * index }}
            className={`p-6 rounded-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{stat.label}</p>
            <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className={`border-b mb-6 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex gap-6">
          {(["songs", "recordings"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab ? "border-[#A53860] text-[#A53860]"
                  : isDark ? "border-transparent text-gray-400 hover:text-gray-300"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "songs" && (
        <>
          <div className="mb-6">
            <button onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Karaoke Song
            </button>
          </div>
          <div className={`rounded-lg border overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <table className="w-full">
              <thead className={isDark ? "bg-gray-900" : "bg-gray-50"}>
                <tr>
                  {["Title", "Artist", "Lyrics", "Duration", "Status", "Actions"].map((h) => (
                    <th key={h} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
                {mockKaraokeSongs.map((song) => (
                  <tr key={song.id} className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                    <td className={`px-6 py-4 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{song.title}</td>
                    <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{song.artist}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{song.lyrics}</span>
                    </td>
                    <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{song.duration}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${song.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                        {song.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}>
                          <Edit className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                        </button>
                        <button className={`p-2 rounded-lg ${isDark ? "hover:bg-red-500/20" : "hover:bg-red-50"}`}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "recordings" && (
        <div className={`rounded-lg border overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <table className="w-full">
            <thead className={isDark ? "bg-gray-900" : "bg-gray-50"}>
              <tr>
                {["User", "Song", "Room", "Date", "Views", "Actions"].map((h) => (
                  <th key={h} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
              {mockKaraokeRecordings.map((rec) => (
                <tr key={rec.id} className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                  <td className={`px-6 py-4 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{rec.user}</td>
                  <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{rec.song}</td>
                  <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{rec.room}</td>
                  <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{rec.date}</td>
                  <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{rec.views.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}>
                      <Eye className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Add Karaoke Song</h3>
                <button onClick={() => setShowAddModal(false)} className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                  <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                </button>
              </div>
              <div className="space-y-4">
                {["Title", "Artist"].map((field) => (
                  <div key={field}>
                    <label className={labelClass}>{field}</label>
                    <input type="text" placeholder={`Enter ${field.toLowerCase()}`}
                      className={`w-full h-11 px-4 rounded-xl border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" : "bg-gray-50 border-gray-200 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#A53860]/50`} />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowAddModal(false)}
                    className={`flex-1 h-11 rounded-xl font-semibold ${isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                    Cancel
                  </button>
                  <button onClick={() => setShowAddModal(false)}
                    className="flex-1 h-11 rounded-xl font-semibold bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white hover:opacity-90">
                    Add Song
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
