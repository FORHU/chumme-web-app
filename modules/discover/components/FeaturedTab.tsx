"use client";

import { motion } from "framer-motion";

import { featuredContent } from "@/modules/discover/constants/mock-data";

interface FeaturedTabProps {
  isDarkMode: boolean;
}

export const FeaturedTab = ({ isDarkMode }: FeaturedTabProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Featured Discover Posts
        </h2>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90 transition-opacity">
          Feature Post
        </button>
      </div>

      <div className="space-y-4">
        {featuredContent.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className={`p-6 rounded-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-bold text-sm">
                    #{post.rank}
                  </span>
                  <h3
                    className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {post.post}
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Fandom
                    </p>
                    <p
                      className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {post.fandom}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Duration
                    </p>
                    <p
                      className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {post.duration}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Start Date
                    </p>
                    <p
                      className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {post.startDate}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      End Date
                    </p>
                    <p
                      className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {post.endDate}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  className={`px-3 py-1 text-sm rounded ${
                    isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Edit
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded ${
                    isDarkMode
                      ? "bg-red-900 text-red-200 hover:bg-red-800"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
