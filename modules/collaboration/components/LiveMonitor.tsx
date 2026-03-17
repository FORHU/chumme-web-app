"use client";

import type { CollabRoom } from "@/modules/collaboration/types";

export interface LiveMonitorProps {
  isDarkMode: boolean;
  rooms: CollabRoom[];
}

export const LiveMonitor = ({ isDarkMode, rooms }: LiveMonitorProps) => {
  return (
    <div
      className={`rounded-xl p-6 mb-8 border ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700/50"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <h3
          className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Live Collaboration Monitor
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms
          .filter((r) => r.status === "Active")
          .slice(0, 3)
          .map((room) => (
            <div
              key={room.id}
              className={`p-5 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-900/50 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  {room.name}
                </span>
                <span className="px-2.5 py-1 bg-red-500 text-white text-xs rounded-md font-medium">
                  LIVE
                </span>
              </div>
              <div
                className={`space-y-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                <div className="flex justify-between">
                  <span>Participants</span>
                  <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                    {room.participants}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Song</span>
                  <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                    {room.song}
                  </span>
                </div>
              </div>
              <button className="w-full mt-4 h-10 bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Enter Room
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};
