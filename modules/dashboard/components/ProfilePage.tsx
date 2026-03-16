"use client";

import { motion } from "framer-motion";
import { Users, Music, AlertCircle, Star, Activity, TrendingUp, Play, Eye, Heart, Calendar, Edit, Trash2, Shield, Plus, X, Upload } from "lucide-react";
import { useState, type ComponentType } from "react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  id: string;
  username: string;
  profilePhoto: string | undefined;
  followers: number;
  following: number;
  totalRecordings: number;
  joinDate: string;
  status: "Active" | "Suspended" | "Pending";
}

interface Recording {
  id: string;
  thumbnail: string;
  songTitle: string;
  user: string;
  category: "Karaoke" | "Music";
  views: number;
  likes: number;
  uploadDate: string;
}

interface Report {
  id: string;
  user: string;
  recording: string;
  reason: string;
  reportedBy: string;
  date: string;
}

interface FeaturedArtist {
  id: string;
  username: string;
  followers: number;
  recordings: number;
  isFeatured: boolean;
}

const mockUsers: User[] = [
  { id: "1", username: "Jacob West", profilePhoto: undefined, followers: 1300, following: 48, totalRecordings: 9, joinDate: "Jan 15, 2024", status: "Active" },
  { id: "2", username: "Anna Lee", profilePhoto: undefined, followers: 2100, following: 62, totalRecordings: 15, joinDate: "Feb 3, 2024", status: "Active" },
  { id: "3", username: "Alex Kim", profilePhoto: undefined, followers: 890, following: 35, totalRecordings: 12, joinDate: "Dec 20, 2023", status: "Active" },
  { id: "4", username: "Sarah Chen", profilePhoto: undefined, followers: 1500, following: 54, totalRecordings: 18, joinDate: "Mar 8, 2024", status: "Suspended" },
  { id: "5", username: "Mike Johnson", profilePhoto: undefined, followers: 670, following: 28, totalRecordings: 7, joinDate: "Jan 30, 2024", status: "Active" },
];

const mockRecordings: Recording[] = [
  { id: "1", thumbnail: "", songTitle: "Dynamite", user: "Jacob West", category: "Karaoke", views: 1200, likes: 345, uploadDate: "2 days ago" },
  { id: "2", thumbnail: "", songTitle: "How You Like That", user: "Anna Lee", category: "Karaoke", views: 950, likes: 287, uploadDate: "5 days ago" },
  { id: "3", thumbnail: "", songTitle: "Butter", user: "Alex Kim", category: "Music", views: 720, likes: 198, uploadDate: "1 week ago" },
  { id: "4", thumbnail: "", songTitle: "Permission to Dance", user: "Sarah Chen", category: "Karaoke", views: 1400, likes: 412, uploadDate: "3 days ago" },
  { id: "5", thumbnail: "", songTitle: "Stay", user: "Mike Johnson", category: "Music", views: 580, likes: 156, uploadDate: "1 week ago" },
];

const mockReports: Report[] = [
  { id: "1", user: "Alex Kim", recording: "Butter", reason: "Inappropriate content", reportedBy: "User123", date: "1 day ago" },
  { id: "2", user: "Sarah Chen", recording: "Permission to Dance", reason: "Copyright violation", reportedBy: "User456", date: "2 days ago" },
  { id: "3", user: "Mike Johnson", recording: "Stay", reason: "Spam", reportedBy: "User789", date: "3 days ago" },
];

const mockFeaturedArtists: FeaturedArtist[] = [
  { id: "1", username: "Jacob West", followers: 1300, recordings: 9, isFeatured: true },
  { id: "2", username: "Anna Lee", followers: 2100, recordings: 15, isFeatured: true },
  { id: "3", username: "Alex Kim", followers: 890, recordings: 12, isFeatured: false },
  { id: "4", username: "Sarah Chen", followers: 1500, recordings: 18, isFeatured: false },
];

const categoryData = [
  { name: "Karaoke", value: 45, color: "#A53860" },
  { name: "Music Covers", value: 30, color: "#EF88AD" },
  { name: "Live Rooms", value: 25, color: "#670D2F" },
];

const userGrowthData = [
  { month: "Jan", users: 850 },
  { month: "Feb", users: 1200 },
  { month: "Mar", users: 1800 },
  { month: "Apr", users: 2400 },
  { month: "May", users: 3100 },
  { month: "Jun", users: 4200 },
];

const recentActivity = [
  { id: "1", text: "Jacob West uploaded a recording", time: "2 minutes ago" },
  { id: "2", text: "Anna Lee joined BTS Sing Along room", time: "15 minutes ago" },
  { id: "3", text: "Alex Kim gained 100 followers", time: "1 hour ago" },
  { id: "4", text: "Sarah Chen created a new community", time: "3 hours ago" },
  { id: "5", text: "Mike Johnson liked 'Dynamite' recording", time: "5 hours ago" },
];

export function ProfilePage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "recordings" | "reports" | "featured" | "analytics">("overview");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}>
            User Profile Manager
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Manage user profiles, recordings, and creator content
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value="12,540"
          icon={Users}
          isDarkMode={isDarkMode}
        />
        <StatsCard
          title="Active Today"
          value="3,210"
          icon={Activity}
          isDarkMode={isDarkMode}
        />
        <StatsCard
          title="Total Recordings"
          value="8,450"
          icon={Music}
          isDarkMode={isDarkMode}
        />
        <StatsCard
          title="Reported Profiles"
          value="32"
          icon={AlertCircle}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Tab Navigation */}
      <div className={`flex gap-2 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        {[
          { id: "overview", label: "Overview" },
          { id: "users", label: "User Management" },
          { id: "recordings", label: "Recordings" },
          { id: "reports", label: "Reports" },
          { id: "featured", label: "Featured Artists" },
          { id: "analytics", label: "Analytics" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 font-medium transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-[#A53860] text-[#A53860]"
                : isDarkMode
                ? "border-transparent text-gray-400 hover:text-gray-200"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && <OverviewTab isDarkMode={isDarkMode} />}
        {activeTab === "users" && <UsersTab isDarkMode={isDarkMode} users={mockUsers} />}
        {activeTab === "recordings" && <RecordingsTab isDarkMode={isDarkMode} recordings={mockRecordings} />}
        {activeTab === "reports" && <ReportsTab isDarkMode={isDarkMode} reports={mockReports} />}
        {activeTab === "featured" && <FeaturedTab isDarkMode={isDarkMode} artists={mockFeaturedArtists} />}
        {activeTab === "analytics" && <AnalyticsTab isDarkMode={isDarkMode} />}
      </div>
    </motion.div>
  );
}

function StatsCard({ title, value, icon: Icon, isDarkMode }: { title: string; value: string; icon: ComponentType<{ className?: string }>; isDarkMode: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${
        isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"
      } backdrop-blur-xl rounded-2xl p-6 border`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${isDarkMode ? "bg-[#A53860]/20" : "bg-[#A53860]/10"}`}>
          <Icon className={`w-6 h-6 ${isDarkMode ? "text-[#EF88AD]" : "text-[#A53860]"}`} />
        </div>
      </div>
      <h3 className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{value}</h3>
      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{title}</p>
    </motion.div>
  );
}

function OverviewTab({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Activity */}
      <div className={`${isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"} backdrop-blur-xl rounded-2xl p-6 border`}>
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${isDarkMode ? "bg-[#EF88AD]" : "bg-[#A53860]"}`} />
              <div className="flex-1">
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{activity.text}</p>
                <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"} mt-1`}>{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories */}
      <div className={`${isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"} backdrop-blur-xl rounded-2xl p-6 border`}>
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Top Recording Categories</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                borderRadius: "8px",
              }}
              labelStyle={{ color: isDarkMode ? "#ffffff" : "#000000" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.name}</span>
              </div>
              <span className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersTab({ isDarkMode, users }: { isDarkMode: boolean; users: User[] }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <CreateUserModal isDarkMode={isDarkMode} isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      
      <div className={`${isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"} backdrop-blur-xl rounded-2xl p-6 border`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>User Profiles</h3>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>User</th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Followers</th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Following</th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Recordings</th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Join Date</th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Status</th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={`border-b ${isDarkMode ? "border-gray-700/50" : "border-gray-100"}`}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-[#A53860]">
                        <AvatarImage src={user.profilePhoto || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-[#A53860] to-[#670D2F] text-white font-semibold">
                          {user.username.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user.username}</span>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{user.followers.toLocaleString()}</td>
                  <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{user.following}</td>
                  <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{user.totalRecordings}</td>
                  <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{user.joinDate}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                        : user.status === "Suspended"
                        ? isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700"
                        : isDarkMode ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`} title="View Profile">
                        <Eye className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                      </button>
                      <button className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`} title="Edit">
                        <Edit className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                      </button>
                      <button className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-red-900/20" : "hover:bg-red-50"}`} title="Suspend">
                        <Shield className="w-4 h-4 text-orange-500" />
                      </button>
                      <button className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-red-900/20" : "hover:bg-red-50"}`} title="Delete">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function RecordingsTab({ isDarkMode, recordings }: { isDarkMode: boolean; recordings: Recording[] }) {
  return (
    <div className={`${isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"} backdrop-blur-xl rounded-2xl p-6 border`}>
      <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Recordings Management</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Song</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>User</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Category</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Views</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Likes</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Upload Date</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recordings.map((recording) => (
              <tr key={recording.id} className={`border-b ${isDarkMode ? "border-gray-700/50" : "border-gray-100"}`}>
                <td className={`py-4 px-4 font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{recording.songTitle}</td>
                <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{recording.user}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    recording.category === "Karaoke"
                      ? isDarkMode ? "bg-purple-900/30 text-purple-400" : "bg-purple-100 text-purple-700"
                      : isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-700"
                  }`}>
                    {recording.category}
                  </span>
                </td>
                <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{recording.views.toLocaleString()}</td>
                <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{recording.likes}</td>
                <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{recording.uploadDate}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`} title="Play">
                      <Play className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                    </button>
                    <button className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`} title="Feature">
                      <Star className={`w-4 h-4 ${isDarkMode ? "text-yellow-500" : "text-yellow-600"}`} />
                    </button>
                    <button className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-red-900/20" : "hover:bg-red-50"}`} title="Remove">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsTab({ isDarkMode, reports }: { isDarkMode: boolean; reports: Report[] }) {
  return (
    <div className={`${isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"} backdrop-blur-xl rounded-2xl p-6 border`}>
      <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Recording Moderation</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>User</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Recording</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Reason</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Reported By</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Date</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className={`border-b ${isDarkMode ? "border-gray-700/50" : "border-gray-100"}`}>
                <td className={`py-4 px-4 font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{report.user}</td>
                <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{report.recording}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700"
                  }`}>
                    {report.reason}
                  </span>
                </td>
                <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{report.reportedBy}</td>
                <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{report.date}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium">
                      Approve
                    </button>
                    <button className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium">
                      Remove
                    </button>
                    <button className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium">
                      Warn
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeaturedTab({ isDarkMode, artists }: { isDarkMode: boolean; artists: FeaturedArtist[] }) {
  return (
    <div className={`${isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"} backdrop-blur-xl rounded-2xl p-6 border`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Featured Artists / Creators</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>User</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Followers</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Recordings</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Featured Status</th>
              <th className={`text-left py-3 px-4 text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist.id} className={`border-b ${isDarkMode ? "border-gray-700/50" : "border-gray-100"}`}>
                <td className={`py-4 px-4 font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{artist.username}</td>
                <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{artist.followers.toLocaleString()}</td>
                <td className={`py-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{artist.recordings}</td>
                <td className="py-4 px-4">
                  {artist.isFeatured ? (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                      isDarkMode ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600"
                    }`}>
                      Not Featured
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <button className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    artist.isFeatured
                      ? isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white hover:opacity-90"
                  }`}>
                    {artist.isFeatured ? "Remove Feature" : "Feature Profile"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsTab({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="space-y-6">
      {/* User Growth Chart */}
      <div className={`${isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"} backdrop-blur-xl rounded-2xl p-6 border`}>
        <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>User Growth Per Month</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
            <XAxis dataKey="month" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
            <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                borderRadius: "8px",
              }}
              labelStyle={{ color: isDarkMode ? "#ffffff" : "#000000" }}
            />
            <Line type="monotone" dataKey="users" stroke="#A53860" strokeWidth={3} dot={{ fill: "#A53860", r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"} backdrop-blur-xl rounded-2xl p-6 border`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${isDarkMode ? "bg-[#A53860]/20" : "bg-[#A53860]/10"}`}>
              <TrendingUp className={`w-6 h-6 ${isDarkMode ? "text-[#EF88AD]" : "text-[#A53860]"}`} />
            </div>
          </div>
          <h4 className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>+23.5%</h4>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>User Growth Rate</p>
        </div>

        <div className={`${isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"} backdrop-blur-xl rounded-2xl p-6 border`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${isDarkMode ? "bg-[#A53860]/20" : "bg-[#A53860]/10"}`}>
              <Heart className={`w-6 h-6 ${isDarkMode ? "text-[#EF88AD]" : "text-[#A53860]"}`} />
            </div>
          </div>
          <h4 className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>4.8</h4>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Average Engagement Score</p>
        </div>

        <div className={`${isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"} backdrop-blur-xl rounded-2xl p-6 border`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${isDarkMode ? "bg-[#A53860]/20" : "bg-[#A53860]/10"}`}>
              <Music className={`w-6 h-6 ${isDarkMode ? "text-[#EF88AD]" : "text-[#A53860]"}`} />
            </div>
          </div>
          <h4 className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>156</h4>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Avg Recordings Per User</p>
        </div>
      </div>
    </div>
  );
}

function CreateUserModal({ isDarkMode, isOpen, onClose }: { isDarkMode: boolean; isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    status: "",
  });

  const handleSubmit = () => {
    console.log("Creating user:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl ${
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } border`}>
        <DialogHeader>
          <DialogTitle className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Create New User
          </DialogTitle>
          <DialogDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Add a new user profile to the Chumme platform
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Profile Photo Upload */}
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20 border-2 border-[#A53860]">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-[#A53860] to-[#670D2F] text-white text-2xl font-semibold">
                {formData.fullName ? formData.fullName.split(" ").map((n) => n[0]).join("") : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <button className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium ${
                isDarkMode 
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
                <Upload className="w-4 h-4" />
                Upload Profile Photo
              </button>
              <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Recommended: Square image, at least 400x400px
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <Label className={`text-sm font-medium mb-2 block ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Full Name
              </Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                className={`${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                }`}
              />
            </div>

            {/* Username */}
            <div>
              <Label className={`text-sm font-medium mb-2 block ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Username
              </Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="johndoe"
                className={`${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <Label className={`text-sm font-medium mb-2 block ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Email Address
              </Label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                type="email"
                placeholder="john@example.com"
                className={`${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                }`}
              />
            </div>

            {/* Phone Number */}
            <div>
              <Label className={`text-sm font-medium mb-2 block ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Phone Number <span className="text-gray-500">(Optional)</span>
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className={`${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                }`}
              />
            </div>

            {/* Password */}
            <div>
              <Label className={`text-sm font-medium mb-2 block ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Password
              </Label>
              <Input
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                type="password"
                placeholder="••••••••"
                className={`${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                }`}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <Label className={`text-sm font-medium mb-2 block ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Confirm Password
              </Label>
              <Input
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                type="password"
                placeholder="••••••••"
                className={`${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                }`}
              />
            </div>

            {/* Role */}
            <div>
              <Label className={`text-sm font-medium mb-2 block ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                User Role
              </Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className={`w-full ${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 text-white" 
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label className={`text-sm font-medium mb-2 block ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Account Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className={`w-full ${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 text-white" 
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-lg font-medium transition-all ${
              isDarkMode 
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Create User
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
