"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { CollaborationManager } from "@/modules/dashboard/components/CollaborationManager";
import { MusicPage } from "@/modules/collaboration/components/MusicPage";
import { KaraokePage } from "@/modules/collaboration/components/KaraokePage";
import type { CollabPage } from "@/modules/collaboration/types";

const CollaborationsPage = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activePage, setActivePage] = useState<CollabPage>("rooms");

  const tabs: { id: CollabPage; label: string }[] = [
    { id: "rooms", label: "Rooms" },
    { id: "music", label: "Music" },
    { id: "karaoke", label: "Karaoke" },
  ];

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activePage === tab.id
                ? "bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white"
                : isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activePage === "rooms" && <CollaborationManager />}
      {activePage === "music" && <MusicPage />}
      {activePage === "karaoke" && <KaraokePage />}
    </div>
  );
};

export default CollaborationsPage;
