"use client";
import type { ComponentType } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Users, TrendingUp, Star, Activity } from "lucide-react";

const engagementData = [
  { name: "Jan 1",  moments: 20 },
  { name: "Jan 5",  moments: 45 },
  { name: "Jan 10", moments: 35 },
  { name: "Jan 15", moments: 65 },
  { name: "Jan 20", moments: 85 },
  { name: "Jan 25", moments: 70 },
  { name: "Jan 30", moments: 95 },
  { name: "Feb 1",  moments: 80 },
  { name: "Feb 5",  moments: 60 },
  { name: "Feb 10", moments: 75 },
];

const platformData = [
  { name: "Instagram", value: 35, color: "#E1306C" },
  { name: "Twitter",   value: 25, color: "#1DA1F2" },
  { name: "TikTok",    value: 30, color: "#000000" },
  { name: "YouTube",   value: 10, color: "#FF0000" },
];

const stats = [
  { label: "Total Users",       value: "48.2k", delta: "+1.2k", icon: Users,      color: "from-[#A53860] to-[#670D2F]" },
  { label: "Communities",       value: "670",   delta: "+24",   icon: Star,       color: "from-[#EF88AD] to-[#A53860]" },
  { label: "Moments Shared",    value: "156k",  delta: "+4.2k", icon: TrendingUp, color: "from-[#670D2F] to-[#A53860]" },
  { label: "Active Right Now",  value: "3,840", delta: "+245",  icon: Activity,   color: "from-[#A53860] to-[#EF88AD]" },
];

const topCommunities = [
  { name: "Taylor Swift Fans", members: "12k" },
  { name: "BTS Army",          members: "8k"  },
  { name: "Marvel Universe",   members: "6k"  },
];

type StatCardProps = {
  label: string;
  value: string;
  delta: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  index: number;
};

function StatCard({ label, value, delta, icon: Icon, color, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 + index * 0.07 }}
      className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="mt-2 text-xs text-green-600 font-medium">{delta} this month</p>
    </motion.div>
  );
}

export function DashboardOverview() {
  return (
    <>
      {/* Greeting */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Good Morning, <span className="text-[#A53860]">Admin</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Here&apos;s what&apos;s happening in your communities today</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Line chart */}
        <motion.div
          initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Community Engagement</h3>
          <p className="text-sm text-gray-400 mb-6">February 2026</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="moments" stroke="#A53860" strokeWidth={3} dot={{ fill: "#A53860", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Platform Activity</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={platformData} cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={4} dataKey="value">
                {platformData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {platformData.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{p.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{p.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Communities */}
      <motion.div
        initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Communities</h3>
          <a href="/dashboard/communities" className="text-sm text-[#A53860] font-semibold hover:text-[#670D2F] transition-colors">See All</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCommunities.map((c) => (
            <div key={c.name} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF88AD] to-[#A53860] flex items-center justify-center text-white font-bold flex-shrink-0">
                {c.name.substring(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{c.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{c.members} members</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
