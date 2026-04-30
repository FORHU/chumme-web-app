"use client";

import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

import { useDebounce } from "@/modules/shared/hooks/useDebounce";
import type { ModalData } from "@/modules/entertainment/types";
import type { TopicCategory } from "@/modules/entertainment/types/api.types";

export interface TopicsTabProps {
  isDark: boolean;
  setModalData: (d: ModalData) => void;
  topics: (TopicCategory & { subcategoryName: string; categoryName: string })[];
}

export const TopicsTab = ({ isDark, setModalData, topics }: TopicsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2
            className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Topics
          </h2>
          <p
            className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {debouncedSearchTerm
              ? `${filteredTopics.length} of ${topics.length} topics`
              : `${topics.length} topics`}
          </p>
        </div>
        <button
          onClick={() => setModalData({ type: "add-topic" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Topic
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search topics, category, subcategory..."
          className={`w-full h-10 pl-9 pr-10 rounded-lg border text-sm outline-none transition-all ${
            isDark
              ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-[#A53860]"
              : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A53860]"
          } focus:ring-2 focus:ring-[#A53860]/10`}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium transition-colors ${
              isDark
                ? "text-gray-500 hover:text-gray-300"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Clear
          </button>
        )}
      </div>

      <div
        className={`rounded-lg border overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        {filteredTopics.length === 0 ? (
          <div className="py-12 text-center">
            <Search
              className={`w-8 h-8 mx-auto mb-3 ${isDark ? "text-gray-600" : "text-gray-300"}`}
            />
            <p
              className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              No results for &ldquo;{debouncedSearchTerm}&rdquo;
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className={isDark ? "bg-gray-900" : "bg-gray-50"}>
              <tr>
                {["Name", "Category", "Subcategory", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}
            >
              {filteredTopics.map((topic) => (
                <tr
                  key={topic.id}
                  className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}
                >
                  <td
                    className={`px-6 py-4 font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {topic.name}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {topic.categoryName}
                  </td>
                  <td
                    className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {topic.subcategoryName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                    >
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
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
                            },
                          })
                        }
                        className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
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
                        className={`p-2 rounded-lg ${isDark ? "hover:bg-red-900/30" : "hover:bg-red-50"}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
