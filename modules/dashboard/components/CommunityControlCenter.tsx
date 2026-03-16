"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Edit, Trash2, X, MapPin, Users, Grid3x3, Activity, AlertTriangle, TrendingUp, Search } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Country {
  id: string;
  name: string;
  categories: number;
  communities: number;
  status: "Active" | "Disabled";
}

interface Category {
  id: string;
  name: string;
  country: string;
  communities: number;
  color: string;
  icon: string;
}

interface Community {
  id: string;
  name: string;
  category: string;
  country: string;
  members: string;
  createdDate: string;
  status: "Active" | "Suspended";
}

const mockCountries: Country[] = [
  { id: "1", name: "Philippines", categories: 12, communities: 120, status: "Active" },
  { id: "2", name: "Korea", categories: 18, communities: 200, status: "Active" },
  { id: "3", name: "Japan", categories: 10, communities: 95, status: "Active" },
  { id: "4", name: "USA", categories: 15, communities: 180, status: "Active" },
  { id: "5", name: "Thailand", categories: 8, communities: 75, status: "Active" },
];

const mockCategories: Category[] = [
  { id: "1", name: "Fan Polls", country: "Philippines", communities: 25, color: "#A53860", icon: "" },
  { id: "2", name: "Fan Meets", country: "Korea", communities: 40, color: "#EF88AD", icon: "" },
  { id: "3", name: "Merch", country: "Japan", communities: 18, color: "#670D2F", icon: "" },
  { id: "4", name: "Events", country: "USA", communities: 32, color: "#F4C2A0", icon: "" },
  { id: "5", name: "News", country: "Thailand", communities: 15, color: "#8B3A52", icon: "" },
];

const mockCommunities: Community[] = [
  { id: "1", name: "BTS Philippines Fans", category: "K-pop", country: "Philippines", members: "12K", createdDate: "Jan 15, 2024", status: "Active" },
  { id: "2", name: "Blackpink Merch PH", category: "Merch", country: "Philippines", members: "5K", createdDate: "Feb 1, 2024", status: "Active" },
  { id: "3", name: "Anime Fans Japan", category: "Anime", country: "Japan", members: "8K", createdDate: "Jan 20, 2024", status: "Active" },
  { id: "4", name: "K-Drama Korea", category: "Drama", country: "Korea", members: "15K", createdDate: "Dec 10, 2023", status: "Active" },
];

const communityAnalytics = [
  { id: "p1", name: "Philippines", value: 35, color: "#A53860" },
  { id: "p2", name: "Korea", value: 25, color: "#EF88AD" },
  { id: "p3", name: "Japan", value: 20, color: "#670D2F" },
  { id: "p4", name: "USA", value: 20, color: "#F4C2A0" },
];

export function CommunityControlCenter() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState<"countries" | "categories" | "analytics" | "moderation">("countries");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState<"country" | "category" | "community">("country");
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [countryName, setCountryName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#A53860");
  const [communityName, setCommunityName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");

  const handleCreate = () => {
    console.log("Creating:", modalType, { countryName, categoryName, communityName });
    setShowCreateModal(false);
    resetForm();
  };

  const resetForm = () => {
    setCountryName("");
    setCategoryName("");
    setCategoryColor("#A53860");
    setCommunityName("");
    setSelectedCountry("");
    setSelectedCategory("");
    setCommunityDescription("");
  };

  const openCreateModal = (type: "country" | "category" | "community") => {
    setModalType(type);
    setShowCreateModal(true);
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Communities
        </h2>
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Manage countries, categories, and communities across the Chumme ecosystem
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className={`rounded-2xl p-6 border ${
          isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50"
        } backdrop-blur-xl`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#A53860]/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#A53860]" />
            </div>
            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Countries
            </span>
          </div>
          <p className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>25</p>
          <p className="text-sm text-green-600 mt-1">+3 this month</p>
        </div>

        <div className={`rounded-2xl p-6 border ${
          isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50"
        } backdrop-blur-xl`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#EF88AD]/20 flex items-center justify-center">
              <Grid3x3 className="w-5 h-5 text-[#EF88AD]" />
            </div>
            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Categories
            </span>
          </div>
          <p className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>120</p>
          <p className="text-sm text-green-600 mt-1">+8 this month</p>
        </div>

        <div className={`rounded-2xl p-6 border ${
          isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50"
        } backdrop-blur-xl`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#670D2F]/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#670D2F]" />
            </div>
            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Communities
            </span>
          </div>
          <p className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>3,200</p>
          <p className="text-sm text-green-600 mt-1">+45 this week</p>
        </div>

        <div className={`rounded-2xl p-6 border ${
          isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50"
        } backdrop-blur-xl`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#F4C2A0]/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#A53860]" />
            </div>
            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Active Today
            </span>
          </div>
          <p className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>850</p>
          <p className="text-sm text-green-600 mt-1">+12% from yesterday</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: "countries", label: "Countries", icon: MapPin },
          { id: "categories", label: "Categories", icon: Grid3x3 },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
          { id: "moderation", label: "Moderation", icon: AlertTriangle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white shadow-lg"
                : isDarkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "countries" && (
          <motion.div
            key="countries"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <button
                onClick={() => openCreateModal("country")}
                className="w-full h-12 bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
              >
                <Plus className="w-5 h-5" />
                Add Country
              </button>
            </div>

            <div className={`rounded-2xl border ${
              isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50"
            } backdrop-blur-xl overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={isDarkMode ? "bg-gray-900/50" : "bg-gray-50"}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Country Name</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Categories</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Communities</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Status</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCountries.map((country) => (
                      <tr key={country.id} className={`border-t ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"}`}>
                        <td className={`px-6 py-4 ${isDarkMode ? "text-white" : "text-gray-900"} font-medium`}>{country.name}</td>
                        <td className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{country.categories}</td>
                        <td className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{country.communities}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            country.status === "Active"
                              ? "bg-green-500/20 text-green-600"
                              : "bg-gray-500/20 text-gray-600"
                          }`}>
                            {country.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className={`p-2 rounded-lg transition-colors ${
                              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                            }`}>
                              <Edit className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                            </button>
                            <button className={`p-2 rounded-lg transition-colors ${
                              isDarkMode ? "hover:bg-red-500/20" : "hover:bg-red-50"
                            }`}>
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
          </motion.div>
        )}

        {activeTab === "categories" && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <button
                onClick={() => openCreateModal("category")}
                className="w-full h-12 bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
              >
                <Plus className="w-5 h-5" />
                Create Category
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full h-12 pl-12 pr-4 rounded-xl transition-all ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                  } border focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}
                />
              </div>
            </div>

            <div className={`rounded-2xl border ${
              isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50"
            } backdrop-blur-xl overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={isDarkMode ? "bg-gray-900/50" : "bg-gray-50"}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Category Name</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Country</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Communities</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Color</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCategories.map((category) => (
                      <tr key={category.id} className={`border-t ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"}`}>
                        <td className={`px-6 py-4 ${isDarkMode ? "text-white" : "text-gray-900"} font-medium`}>
                          {category.name}
                        </td>
                        <td className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{category.country}</td>
                        <td className={`px-6 py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{category.communities}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {category.color}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className={`p-2 rounded-lg transition-colors ${
                              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                            }`}>
                              <Edit className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                            </button>
                            <button className={`p-2 rounded-lg transition-colors ${
                              isDarkMode ? "hover:bg-red-500/20" : "hover:bg-red-50"
                            }`}>
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
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`rounded-2xl p-6 border ${
              isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50"
            } backdrop-blur-xl`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Communities by Country
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={communityAnalytics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {communityAnalytics.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Growing Communities */}
            <div className={`rounded-2xl p-6 border mt-6 ${
              isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50"
            } backdrop-blur-xl`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Fastest Growing Communities
              </h3>
              <div className="space-y-3">
                {["BTS Philippines Fans", "Blackpink Korea", "Anime Japan", "K-Drama Thailand"].map((name, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-900" : "bg-gray-50"
                  }`}>
                    <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{name}</span>
                    <span className="text-green-600 text-sm font-semibold">+{10 + (index * 7) % 30}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "moderation" && (
          <motion.div
            key="moderation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`rounded-2xl p-6 border ${
              isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50"
            } backdrop-blur-xl`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Reports Panel
              </h3>
              <div className="space-y-4">
                {[
                  { community: "Spam Community XYZ", reason: "Spam content", date: "2 hours ago" },
                  { community: "Inappropriate Group", reason: "Inappropriate content", date: "5 hours ago" },
                  { community: "Fake Merch Sellers", reason: "Scam reports", date: "1 day ago" },
                ].map((report, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${
                    isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {report.community}
                        </h4>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Reason: {report.reason}
                        </p>
                      </div>
                      <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {report.date}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                        Suspend
                      </button>
                      <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDarkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}>
                        Dismiss
                      </button>
                      <button className="px-4 py-2 bg-[#A53860] text-white rounded-lg text-sm font-medium hover:bg-[#670D2F] transition-colors">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg rounded-2xl p-6 ${
                isDarkMode ? "bg-gray-900" : "bg-white"
              } shadow-2xl max-h-[90vh] overflow-y-auto`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {modalType === "country" ? "Add Country" : modalType === "category" ? "Create Category" : "Create Community"}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  }`}
                >
                  <X className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                </button>
              </div>

              {/* Modal Content */}
              {modalType === "country" && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Country Name
                  </label>
                  <select
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl text-sm transition-all ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    } border focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}
                  >
                    <option value="">Select Country</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Korea">Korea</option>
                    <option value="Japan">Japan</option>
                    <option value="United States">United States</option>
                    <option value="China">China</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="India">India</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Mexico">Mexico</option>
                  </select>
                </div>
              )}

              {modalType === "category" && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Category Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Fan Polls, Merch, Events"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className={`w-full h-12 px-4 rounded-xl text-sm transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                      } border focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Country
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className={`w-full h-12 px-4 rounded-xl text-sm transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-900"
                      } border focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}
                    >
                      <option value="">Select Country</option>
                      {mockCountries.map((country) => (
                        <option key={country.id} value={country.name}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Color
                    </label>
                    <input
                      type="color"
                      value={categoryColor}
                      onChange={(e) => setCategoryColor(e.target.value)}
                      className="w-full h-12 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {modalType === "community" && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Community Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., BTS Philippines Fans"
                      value={communityName}
                      onChange={(e) => setCommunityName(e.target.value)}
                      className={`w-full h-12 px-4 rounded-xl text-sm transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                      } border focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Country
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className={`w-full h-12 px-4 rounded-xl text-sm transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-900"
                      } border focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}
                    >
                      <option value="">Select Country</option>
                      {mockCountries.map((country) => (
                        <option key={country.id} value={country.name}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full h-12 px-4 rounded-xl text-sm transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-900"
                      } border focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}
                    >
                      <option value="">Select Category</option>
                      {mockCategories.map((category) => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Description
                    </label>
                    <textarea
                      placeholder="Describe the community..."
                      value={communityDescription}
                      onChange={(e) => setCommunityDescription(e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl text-sm transition-all resize-none ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                      } border focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 h-12 rounded-xl font-semibold transition-colors ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 h-12 bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
