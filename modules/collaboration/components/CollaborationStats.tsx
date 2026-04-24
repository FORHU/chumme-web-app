"use client";

interface CollaborationStatsProps {
  isDarkMode: boolean;
}

const STATS = [
  { label: "Total Collaborations", value: "420" },
  { label: "Active Rooms", value: "68" },
  { label: "Public Rooms", value: "210" },
  { label: "Private Rooms", value: "210" },
  { label: "Total Recordings", value: "1,250" },
];

export function CollaborationStats({ isDarkMode }: CollaborationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {STATS.map((stat, index) => (
        <div
          key={index}
          className={`rounded-xl p-6 border ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`text-sm mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {stat.label}
          </p>
          <p
            className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
