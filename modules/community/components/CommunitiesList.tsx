"use client";

import { motion } from "framer-motion";
import { Users, MessageSquare, Crown, MoreHorizontal } from "lucide-react";
import { activeCommunities } from "@/modules/community/constants/mock-data";
import { ActiveCommunity } from "@/modules/community/types";

interface CommunitiesListProps {
  isDarkMode: boolean;
  searchTerm: string;
}

const CommunityCard = ({
  community,
  index,
  isDarkMode,
}: {
  community: ActiveCommunity;
  index: number;
  isDarkMode: boolean;
}) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.05 * index }}
      className={`p-6 rounded-lg border ${
        isDarkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white text-xl">
            {community.thumbnail}
          </div>
          <div>
            <h3
              className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-1`}
            >
              {community.name}
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span
                className={`flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                <Users className="w-3 h-3" />
                {community.members.toLocaleString()} members
              </span>
              <span
                className={`flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                <MessageSquare className="w-3 h-3" />
                {community.posts} posts
              </span>
              <span
                className={`flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                <Crown className="w-3 h-3" />
                {community.moderators} mods
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              community.engagement === "Very High"
                ? "bg-purple-100 text-purple-800"
                : community.engagement === "High"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {community.engagement}
          </span>
          <button
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Members", value: community.members.toLocaleString() },
          { label: "Posts", value: community.posts.toString() },
          { label: "Spam Reports", value: community.spamReports.toString() },
          {
            label: "Engagement",
            value: `${community.id === 1 ? 78 : community.id === 2 ? 92 : community.id === 3 ? 85 : 71}%`,
          },
        ].map((metric) => (
          <div key={metric.label}>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {metric.label}
            </p>
            <p
              className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const CommunitiesList = ({
  isDarkMode,
  searchTerm,
}: CommunitiesListProps) => {
  const filteredCommunities = activeCommunities.filter((community) =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {filteredCommunities.map((community, index) => (
        <CommunityCard
          key={community.id}
          community={community}
          index={index}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
};
