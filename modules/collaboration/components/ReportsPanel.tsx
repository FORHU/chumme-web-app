"use client";
import { motion } from "framer-motion";

interface ReportsPanelProps {
  isDarkMode: boolean;
}

export function ReportsPanel({ isDarkMode }: ReportsPanelProps) {
  return (
    <motion.div
      key="reports"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`rounded-2xl p-6 border ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700/50"
            : "bg-white/80 border-gray-200/50"
        } backdrop-blur-xl`}
      >
        <h3
          className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Reports & Moderation
        </h3>
        <div className="space-y-4">
          {[
            {
              type: "Inappropriate chat",
              room: "Kpop Night Room",
              user: "user_456",
              date: "1 hour ago",
            },
            {
              type: "Abusive user",
              room: "BTS Sing Along",
              user: "baduser123",
              date: "3 hours ago",
            },
            {
              type: "Spam collaboration",
              room: "Fan Singing PH",
              user: "spammer99",
              date: "5 hours ago",
            },
          ].map((report, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4
                    className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {report.type}
                  </h4>
                  <p
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Room: {report.room}
                  </p>
                  <p
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Reported User: {report.user}
                  </p>
                </div>
                <span
                  className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  {report.date}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 bg-[#A53860] text-white rounded-lg text-sm font-medium hover:bg-[#670D2F] transition-colors">
                  Review
                </button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">
                  Suspend User
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                  Close Room
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
