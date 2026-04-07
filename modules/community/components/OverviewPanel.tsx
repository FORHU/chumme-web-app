"use client";

import { motion } from "framer-motion";
import { Flag, UserX, Crown, Shield, LucideIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  moderationTrendData,
  reportTypeData,
} from "@/modules/community/constants/mock-data";

interface OverviewPanelProps {
  isDarkMode: boolean;
}

const ModerationTrendsChart = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <div
      className={`p-6 rounded-lg border ${
        isDarkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <h3
        className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}
      >
        Moderation Trends (7 days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={moderationTrendData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#374151" : "#E5E7EB"}
          />
          <XAxis dataKey="name" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
          <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
              border: `1px solid ${isDarkMode ? "#374151" : "#E5E7EB"}`,
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="reports"
            stroke="#A53860"
            strokeWidth={2}
            dot={{ fill: "#A53860", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="actions"
            stroke="#EF88AD"
            strokeWidth={2}
            dot={{ fill: "#EF88AD", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const ReportTypesDistribution = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <div
      className={`p-6 rounded-lg border ${
        isDarkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <h3
        className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}
      >
        Report Types Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={reportTypeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => {
              const safePercent = typeof percent === "number" ? percent : 0;
              return `${name} ${(safePercent * 100).toFixed(0)}%`;
            }}
            outerRadius={80}
            dataKey="value"
          >
            {reportTypeData.map((entry) => (
              <Cell key={`cell-${entry.id}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface QuickActionData {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const QuickActionCard = ({
  action,
  index,
  isDarkMode,
}: {
  action: QuickActionData;
  index: number;
  isDarkMode: boolean;
}) => {
  const Icon = action.icon;
  return (
    <motion.button
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -2 }}
      className={`p-4 rounded-lg border text-left transition-colors ${
        isDarkMode
          ? "bg-gray-800 border-gray-600 hover:bg-gray-700"
          : "bg-white border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h4
        className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-1`}
      >
        {action.title}
      </h4>
      <p
        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
      >
        {action.description}
      </p>
    </motion.button>
  );
};

export const OverviewPanel = ({ isDarkMode }: OverviewPanelProps) => {
  const quickActions: QuickActionData[] = [
    {
      title: "Review Reports",
      description: "Handle pending community reports",
      icon: Flag,
      color: "bg-red-500",
    },
    {
      title: "User Management",
      description: "Manage user bans and warnings",
      icon: UserX,
      color: "bg-orange-500",
    },
    {
      title: "Moderator Tools",
      description: "Assign and manage moderators",
      icon: Crown,
      color: "bg-purple-500",
    },
    {
      title: "Community Settings",
      description: "Configure community policies",
      icon: Shield,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModerationTrendsChart isDarkMode={isDarkMode} />
        <ReportTypesDistribution isDarkMode={isDarkMode} />
      </div>

      <div
        className={`p-6 rounded-lg border ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <h3
          className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={action.title}
              action={action}
              index={index}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
