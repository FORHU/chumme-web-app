"use client";

import { AnimatePresence } from "framer-motion";
import { Music, Users, Video, AlertTriangle, Eye } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { AddSongModal } from "@/modules/collaboration/components/AddSongModal";
import { CollabStats } from "@/modules/collaboration/components/CollabStats";
import { LiveMonitor } from "@/modules/collaboration/components/LiveMonitor";
import { PrivateRoomsTable } from "@/modules/collaboration/components/PrivateRoomsTable";
import { PublicCollabsTable } from "@/modules/collaboration/components/PublicCollabsTable";
import { RecordingsTable } from "@/modules/collaboration/components/RecordingsTable";
import { ReportsPanel } from "@/modules/collaboration/components/ReportsPanel";
import { RoomsTable } from "@/modules/collaboration/components/RoomsTable";
import { SongLibrary } from "@/modules/collaboration/components/SongLibrary";
import {
  mockRooms,
  mockPublicCollabs,
  mockSongs,
  mockRecordings,
} from "@/modules/collaboration/constants/mock-data";
import type { TabId } from "@/modules/collaboration/types";

export const CollaborationManager = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState<TabId>("rooms");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const handleCreate = (title: string, artist: string) => {
    console.warn("Creating song:", { title, artist });
    setShowCreateModal(false);
  };

  const TABS = [
    { id: "monitor", label: "Live Monitor", icon: Eye },
    { id: "rooms", label: "All Rooms", icon: Users },
    { id: "public", label: "Public Collabs", icon: Users },
    { id: "private", label: "Private Rooms", icon: Users },
    { id: "songs", label: "Song Library", icon: Music },
    { id: "recordings", label: "Recordings", icon: Video },
    { id: "reports", label: "Reports", icon: AlertTriangle },
  ] as const;

  return (
    <div className="h-full">
      <div className="mb-8">
        <h2
          className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Collaboration Manager
        </h2>
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Manage collaboration rooms, songs, recordings, and moderation
        </p>
      </div>

      <CollabStats isDarkMode={isDarkMode} />

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabId)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-linear-to-r from-[#A53860] to-[#670D2F] text-white shadow-lg"
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
        {activeTab === "monitor" && (
          <LiveMonitor isDarkMode={isDarkMode} rooms={mockRooms} />
        )}
        {activeTab === "rooms" && (
          <RoomsTable isDarkMode={isDarkMode} rooms={mockRooms} />
        )}
        {activeTab === "public" && (
          <PublicCollabsTable
            isDarkMode={isDarkMode}
            collabs={mockPublicCollabs}
          />
        )}
        {activeTab === "private" && (
          <PrivateRoomsTable
            isDarkMode={isDarkMode}
            rooms={mockRooms.filter((r) => r.type === "Private")}
          />
        )}
        {activeTab === "songs" && (
          <SongLibrary
            isDarkMode={isDarkMode}
            songs={mockSongs}
            onAddSong={() => setShowCreateModal(true)}
          />
        )}
        {activeTab === "recordings" && (
          <RecordingsTable
            isDarkMode={isDarkMode}
            recordings={mockRecordings}
          />
        )}
        {activeTab === "reports" && <ReportsPanel isDarkMode={isDarkMode} />}
      </AnimatePresence>

      <AddSongModal
        isDarkMode={isDarkMode}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};
