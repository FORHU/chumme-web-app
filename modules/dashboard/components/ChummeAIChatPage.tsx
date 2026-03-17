"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Plus, Edit, Trash2, Power, X, MessageSquare, Mic,
  Video, TrendingUp, Users, Upload,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import type { ComponentType } from "react";

type TabId = "artists" | "chat" | "voice" | "avatar" | "analytics";
type ArtistType = "Chat" | "Voice Chat" | "AI Avatar";

interface AIArtist {
  id: string;
  name: string;
  avatar: string;
  type: "Chat" | "Voice Chat" | "AI Avatar";
  status: "Active" | "Disabled";
}

const mockArtists: AIArtist[] = [
  { id: "1", name: "Lisa", avatar: "L", type: "Chat", status: "Active" },
  { id: "2", name: "Jennie", avatar: "J", type: "Voice Chat", status: "Active" },
  { id: "3", name: "Jungkook", avatar: "JK", type: "AI Avatar", status: "Disabled" },
  { id: "4", name: "Taylor", avatar: "T", type: "Chat", status: "Active" },
];

const analyticsData = [
  { id: "mon", name: "Mon", chats: 120, voice: 45, avatar: 20 },
  { id: "tue", name: "Tue", chats: 180, voice: 60, avatar: 35 },
  { id: "wed", name: "Wed", chats: 150, voice: 55, avatar: 30 },
  { id: "thu", name: "Thu", chats: 220, voice: 80, avatar: 50 },
  { id: "fri", name: "Fri", chats: 280, voice: 95, avatar: 65 },
  { id: "sat", name: "Sat", chats: 310, voice: 110, avatar: 75 },
  { id: "sun", name: "Sun", chats: 290, voice: 100, avatar: 70 },
];

const samplePrompts = [
  "Best Taylor Swift song for studying",
  "How to join a fan event",
  "Songs that make you feel emotional",
  "Latest K-pop trends",
];

export const ChummeAIChatPage = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState<TabId>("artists");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [aiChatEnabled, setAiChatEnabled] = useState<boolean>(true);
  const [voiceChatEnabled, setVoiceChatEnabled] = useState<boolean>(true);
  const [liveAvatarEnabled, setLiveAvatarEnabled] = useState<boolean>(false);

  const [artistName, setArtistName] = useState<string>("");
  const [artistType, setArtistType] = useState<ArtistType>("Chat");
  const [personality, setPersonality] = useState<string>("");
  const [voiceModel, setVoiceModel] = useState<string>("");

  const handleCreateArtist = () => {
    console.log("Creating AI Artist:", {
      artistName,
      artistType,
      personality,
      voiceModel,
    });
    setShowCreateModal(false);
    setArtistName("");
    setPersonality("");
    setVoiceModel("");
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          AI Artist Studio
        </h2>
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Create, manage, and monitor AI artists for fan engagement
        </p>
      </div>

      <div
        className={`rounded-2xl p-6 mb-6 ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700/50"
            : "bg-white/80 border-gray-200/50"
        } border backdrop-blur-xl`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          AI Feature Control
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  aiChatEnabled
                    ? "bg-[#A53860]/20"
                    : isDarkMode
                      ? "bg-gray-700"
                      : "bg-gray-100"
                }`}
              >
                <MessageSquare
                  className={`w-5 h-5 ${
                    aiChatEnabled
                      ? "text-[#A53860]"
                      : isDarkMode
                        ? "text-gray-500"
                        : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                AI Chat
              </span>
            </div>
            <button
              onClick={() => setAiChatEnabled(!aiChatEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                aiChatEnabled
                  ? "bg-gradient-to-r from-[#A53860] to-[#670D2F]"
                  : isDarkMode
                    ? "bg-gray-700"
                    : "bg-gray-300"
              }`}
            >
              <motion.div
                animate={{ x: aiChatEnabled ? 24 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  voiceChatEnabled
                    ? "bg-[#EF88AD]/20"
                    : isDarkMode
                      ? "bg-gray-700"
                      : "bg-gray-100"
                }`}
              >
                <Mic
                  className={`w-5 h-5 ${
                    voiceChatEnabled
                      ? "text-[#EF88AD]"
                      : isDarkMode
                        ? "text-gray-500"
                        : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Voice Chat
              </span>
            </div>
            <button
              onClick={() => setVoiceChatEnabled(!voiceChatEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                voiceChatEnabled
                  ? "bg-gradient-to-r from-[#A53860] to-[#670D2F]"
                  : isDarkMode
                    ? "bg-gray-700"
                    : "bg-gray-300"
              }`}
            >
              <motion.div
                animate={{ x: voiceChatEnabled ? 24 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  liveAvatarEnabled
                    ? "bg-[#670D2F]/20"
                    : isDarkMode
                      ? "bg-gray-700"
                      : "bg-gray-100"
                }`}
              >
                <Video
                  className={`w-5 h-5 ${
                    liveAvatarEnabled
                      ? "text-[#670D2F]"
                      : isDarkMode
                        ? "text-gray-500"
                        : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Live Avatar
              </span>
            </div>
            <button
              onClick={() => setLiveAvatarEnabled(!liveAvatarEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                liveAvatarEnabled
                  ? "bg-gradient-to-r from-[#A53860] to-[#670D2F]"
                  : isDarkMode
                    ? "bg-gray-700"
                    : "bg-gray-300"
              }`}
            >
              <motion.div
                animate={{ x: liveAvatarEnabled ? 24 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(
          [
            { id: "artists", label: "AI Artists", icon: Users },
            { id: "chat", label: "Chat Training", icon: MessageSquare },
            { id: "voice", label: "Voice Settings", icon: Mic },
            { id: "avatar", label: "Avatar Config", icon: Video },
            { id: "analytics", label: "Analytics", icon: TrendingUp },
          ] as const satisfies ReadonlyArray<{
            id: TabId;
            label: string;
            icon: ComponentType<{ className?: string }>;
          }>
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      <AnimatePresence mode="wait">
        {activeTab === "artists" && (
          <motion.div
            key="artists"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full h-12 bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white rounded-xl font-semibold mb-6 flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
            >
              <Plus className="w-5 h-5" />
              Create AI Artist
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockArtists.map((artist) => (
                <motion.div
                  key={artist.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-2xl p-6 border ${
                    isDarkMode
                      ? "bg-gray-800/50 border-gray-700/50"
                      : "bg-white/80 border-gray-200/50"
                  } backdrop-blur-xl hover:shadow-xl transition-shadow`}
                >
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#A53860] to-[#670D2F] flex items-center justify-center text-white font-bold text-2xl mb-3">
                      {artist.avatar}
                    </div>
                    <h3
                      className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {artist.name}
                    </h3>
                  </div>

                  <div className="flex justify-center mb-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        artist.type === "Chat"
                          ? "bg-[#A53860]/20 text-[#A53860]"
                          : artist.type === "Voice Chat"
                            ? "bg-[#EF88AD]/20 text-[#EF88AD]"
                            : "bg-[#670D2F]/20 text-[#670D2F]"
                      }`}
                    >
                      {artist.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        artist.status === "Active" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        artist.status === "Active"
                          ? "text-green-600"
                          : isDarkMode
                            ? "text-gray-500"
                            : "text-gray-400"
                      }`}
                    >
                      {artist.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className={`flex-1 h-9 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isDarkMode
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          : "bg-red-50 text-red-500 hover:bg-red-100"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    className={`w-full h-9 rounded-lg flex items-center justify-center gap-2 text-sm font-medium mt-3 transition-colors ${
                      artist.status === "Active"
                        ? "bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white hover:shadow-md"
                        : isDarkMode
                          ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    {artist.status === "Active" ? "Disable" : "Enable"}
                  </button>
                </motion.div>
              ))}
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
            className={`rounded-2xl p-6 border ${
              isDarkMode
                ? "bg-gray-800/50 border-gray-700/50"
                : "bg-white/80 border-gray-200/50"
            } backdrop-blur-xl`}
          >
            <h3
              className={`text-lg font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              AI Usage Analytics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                <XAxis dataKey="name" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                    border: `1px solid ${isDarkMode ? "#374151" : "#E5E7EB"}`,
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="chats" stroke="#A53860" strokeWidth={2} />
                <Line type="monotone" dataKey="voice" stroke="#EF88AD" strokeWidth={2} />
                <Line type="monotone" dataKey="avatar" stroke="#670D2F" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {activeTab === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`rounded-2xl p-6 border ${
              isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50"
            } backdrop-blur-xl`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Chat Configuration
              </h3>
        
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  AI Personality Description
                </label>
                <textarea
                  placeholder="Describe the AI's personality, tone, and behavior..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl text-sm resize-none border transition-all ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                  } focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 outline-none`}
                />
              </div>
        
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Conversation Tone
                </label>
                <select className={`w-full h-12 px-4 rounded-xl text-sm border transition-all outline-none ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                } focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}>
                  <option>Friendly</option>
                  <option>Energetic</option>
                  <option>Professional</option>
                  <option>Casual</option>
                </select>
              </div>
        
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Sample Prompts
                  </label>
                  <button className="px-3 py-1 bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white rounded-lg text-xs font-medium flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {samplePrompts.map((prompt, index) => (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                      isDarkMode ? "bg-gray-900" : "bg-gray-50"
                    }`}>
                      <span className={`flex-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {prompt}
                      </span>
                      <button className={`p-1 rounded transition-colors ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}>
                        <Edit className={`w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                      </button>
                      <button className={`p-1 rounded transition-colors ${isDarkMode ? "hover:bg-red-500/20" : "hover:bg-red-50"}`}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === "voice" && (
          <motion.div
            key="voice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`rounded-2xl p-6 border ${
              isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50"
            } backdrop-blur-xl`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Voice Chat Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Voice Model
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Lisa_KPOP_V1"
                    className={`w-full h-12 px-4 rounded-xl text-sm border transition-all outline-none ${
                      isDarkMode
                        ? "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                    } focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Language
                  </label>
                  <select className={`w-full h-12 px-4 rounded-xl text-sm border outline-none ${
                    isDarkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                  } focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}>
                    <option>English</option>
                    <option>Korean</option>
                    <option>Japanese</option>
                    <option>Spanish</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Accent
                  </label>
                  <select className={`w-full h-12 px-4 rounded-xl text-sm border outline-none ${
                    isDarkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                  } focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}>
                    <option>Neutral</option>
                    <option>American</option>
                    <option>British</option>
                    <option>Korean</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Emotion Style
                  </label>
                  <select className={`w-full h-12 px-4 rounded-xl text-sm border outline-none ${
                    isDarkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                  } focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}>
                    <option>Friendly</option>
                    <option>Energetic</option>
                    <option>Calm</option>
                    <option>Excited</option>
                  </select>
                </div>
              </div>
              <button className="w-full h-12 mt-6 bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                <Upload className="w-5 h-5" />
                Upload Voice Sample
              </button>
            </div>
          </motion.div>
        )}
        
        {activeTab === "avatar" && (
          <motion.div
            key="avatar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`rounded-2xl p-6 border ${
              isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50"
            } backdrop-blur-xl`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                AI Live Avatar Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Avatar Image
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    }`}>
                      <Upload className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Click to upload avatar image
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Lip Sync Model
                    </label>
                    <select className={`w-full h-12 px-4 rounded-xl text-sm border outline-none ${
                      isDarkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                    } focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}>
                      <option>Standard Sync</option>
                      <option>High Precision</option>
                      <option>Anime Style</option>
                    </select>
                  </div>
                </div>
                <div>
                  <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Animation Presets
                  </h4>
                  {[
                    { label: "Idle Animation", options: ["Gentle Breathing", "Blinking", "Head Tilt"] },
                    { label: "Talking Animation", options: ["Natural Speech", "Expressive", "Subtle"] },
                    { label: "Reaction Animation", options: ["Happy", "Surprised", "Thoughtful"] },
                  ].map((preset) => (
                    <div key={preset.label} className="mb-4">
                      <label className={`block text-xs font-medium mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {preset.label}
                      </label>
                      <select className={`w-full h-10 px-3 rounded-lg text-sm border outline-none ${
                        isDarkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}>
                        {preset.options.map((opt) => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                  ))}
                  <button className="w-full h-10 bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-shadow">
                    Preview Avatar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md rounded-2xl p-6 border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  Create AI Artist
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Artist Name
                  </label>
                  <input
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    className={`w-full h-11 px-4 rounded-xl border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-[#A53860]/50`}
                    placeholder="Enter artist name"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Artist Type
                  </label>
                  <select
                    value={artistType}
                    onChange={(e) => setArtistType(e.target.value as ArtistType)}
                    className={`w-full h-11 px-4 rounded-xl border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-[#A53860]/50`}
                  >
                    <option value="Chat">Chat</option>
                    <option value="Voice Chat">Voice Chat</option>
                    <option value="AI Avatar">AI Avatar</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Personality
                  </label>
                  <textarea
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    className={`w-full h-20 px-4 py-3 rounded-xl border resize-none ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-[#A53860]/50`}
                    placeholder="Describe the AI personality..."
                  />
                </div>

                {artistType === "Voice Chat" && (
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Voice Model
                    </label>
                    <input
                      value={voiceModel}
                      onChange={(e) => setVoiceModel(e.target.value)}
                      className={`w-full h-11 px-4 rounded-xl border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-200 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-[#A53860]/50`}
                      placeholder="Select voice model..."
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className={`flex-1 h-11 rounded-xl border font-medium ${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateArtist}
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:shadow-lg transition-shadow"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
