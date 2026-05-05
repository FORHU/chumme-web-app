"use client";

import { Search, Plus, Edit, Trash2, Music, Mic, Layers, ShieldCheck, Layout } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { useDebounce } from "@/modules/shared/hooks/useDebounce";
import { SearchBar } from "@/modules/shared/components/SearchBar";
import { useArtists } from "@/modules/collaboration/hooks/useMusic";
import type { ModalData } from "@/modules/entertainment/types";
import type { TopicCategory } from "@/modules/entertainment/types/api.types";
import { useMemo } from "react";

export interface TopicsTabProps {
  isDark: boolean;
  setModalData: (d: ModalData) => void;
  topics: (TopicCategory & { subcategoryName: string; categoryName: string })[];
}

export const TopicsTab = ({ isDark, setModalData, topics }: TopicsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch artists to link images by name
  const { data: artistsData = [] } = useArtists();

  // Create a lookup map for artist images by name
  const artistImageMap = useMemo(() => {
    const map: Record<string, string> = {};
    artistsData.forEach((artist) => {
      if (artist.name && artist.imageUrl) {
        map[artist.name.toLowerCase()] = artist.imageUrl;
      }
    });
    return map;
  }, [artistsData]);

  const filteredTopics = topics.filter((topic) => {
    const term = debouncedSearchTerm.toLowerCase();
    if (!term) return true;
    return (
      topic.name.toLowerCase().includes(term) ||
      topic.categoryName.toLowerCase().includes(term) ||
      topic.subcategoryName.toLowerCase().includes(term) ||
      (topic.note ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-6">
        {/* Action Button */}
        <div className="shrink-0">
          <button
            onClick={() => setModalData({ type: "add-topic" })}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white text-sm font-medium hover:opacity-90 flex items-center gap-2 transition-all shadow-md h-12"
          >
            <Plus className="w-4 h-4" /> Add Topic
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search topics, category, subcategory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
          {[
            { label: "Total Topics", value: topics.length, icon: Music },
            { label: "Filtered", value: filteredTopics.length, icon: Search },
            { label: "Active", value: filteredTopics.length, icon: ShieldCheck },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className={`p-3.5 rounded-xl border ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                } shadow-sm`}
            >
              <div className="flex items-center gap-2 mb-1">
                {stat.icon && <stat.icon className={`w-3 h-3 ${isDark ? "text-gray-400" : "text-gray-500"}`} />}
                <p className={`text-[10px] uppercase tracking-wider font-semibold truncate ${isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                  {stat.label}
                </p>
              </div>
              <p className={`text-lg font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div
        className={`flex-1 min-h-0 rounded-2xl border overflow-hidden shadow-xl flex flex-col ${isDark ? "bg-gray-900/40 border-gray-700/50 backdrop-blur-xl" : "bg-white/80 border-gray-200 backdrop-blur-md"
          }`}
      >
        {filteredTopics.length === 0 ? (
          <div className="py-20 text-center">
            <Search
              className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-200"}`}
            />
            <p
              className={`text-lg font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              No results found
            </p>
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Try adjusting your search for &ldquo;{debouncedSearchTerm}&rdquo;
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-separate border-spacing-y-2 px-4">
              <thead className={`sticky top-0 z-20 ${isDark ? "bg-gray-900/90" : "bg-gray-50/90"} backdrop-blur-md`}>
                <tr>
                  {[
                    { label: "Name", icon: Mic },
                    { label: "Category", icon: Layout },
                    { label: "Subcategory", icon: Layers },
                    { label: "Status", icon: ShieldCheck },
                    { label: "Actions", icon: null },
                  ].map((h) => (
                    <th
                      key={h.label}
                      className={`px-4 py-4 text-[10px] font-semibold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      <div className="flex items-center gap-2">
                        {h.icon && <h.icon className="w-3 h-3" />}
                        {h.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredTopics.map((topic, index) => (
                    <motion.tr
                      key={topic.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className={`group transition-all duration-300 rounded-xl overflow-hidden ${isDark
                          ? "bg-gray-800/30 hover:bg-gray-700/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                          : "bg-gray-50/50 hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
                        }`}
                    >
                      <td className="px-4 py-4 first:rounded-l-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border-2 border-[#A53860] bg-gradient-to-br from-[#A53860] to-[#670D2F] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
                            {topic.imageUrl || artistImageMap[topic.name.toLowerCase()] ? (
                              <Image
                                src={topic.imageUrl || artistImageMap[topic.name.toLowerCase()]}
                                alt={topic.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              topic.name.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                            {topic.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {topic.categoryName}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {topic.subcategoryName}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white shadow-sm`}>
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-4 last:rounded-r-xl">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              setModalData({
                                type: "edit-topic",
                                item: {
                                  id: topic.id,
                                  name: topic.name,
                                  description: topic.note ?? "",
                                  category: topic.categoryName,
                                  subcategory: topic.subcategoryName,
                                  imageUrl: topic.imageUrl || artistImageMap[topic.name.toLowerCase()],
                                },
                              })
                            }
                            className={`p-2.5 rounded-xl transition-all ${isDark ? "bg-gray-700/50 hover:bg-gray-600" : "bg-white hover:bg-gray-100 shadow-sm"}`}
                          >
                            <Edit
                              className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                            />
                          </button>
                          <button
                            onClick={() =>
                              setModalData({
                                type: "delete-confirm",
                                item: {
                                  id: topic.id,
                                  name: topic.name,
                                  itemType: "topic",
                                },
                              })
                            }
                            className={`p-2.5 rounded-xl transition-all ${isDark ? "bg-red-500/10 hover:bg-red-500/20" : "bg-red-50 hover:bg-red-100"}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
