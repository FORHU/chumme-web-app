"use client";

import { Play, Trash2, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import type { SocialIngestionSchedule } from "@/modules/platform-ingestion/api/ingestion-api";

interface Props {
  schedules: SocialIngestionSchedule[];
  isLoading: boolean;
  isDarkMode: boolean;
  triggeringId: string | null;
  onTrigger: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

export function SchedulesTable({
  schedules,
  isLoading,
  isDarkMode,
  triggeringId,
  onTrigger,
  onToggleActive,
  onDelete,
}: Props) {
  const table = `rounded-2xl border backdrop-blur-xl overflow-hidden ${
    isDarkMode
      ? "bg-gray-800/50 border-gray-700/50"
      : "bg-white/80 border-gray-200/50"
  }`;

  const th = `px-6 py-4 text-left text-sm font-semibold ${
    isDarkMode ? "text-gray-300" : "text-gray-700"
  }`;

  const td = `px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`;

  return (
    <div className={table}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDarkMode ? "bg-gray-900/50" : "bg-gray-50"}>
            <tr>
              <th className={th}>Platform</th>
              <th className={th}>Handle</th>
              <th className={th}>Mode</th>
              <th className={th}>Interval</th>
              <th className={th}>Last Crawled</th>
              <th className={th}>Status</th>
              <th className={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Loading skeleton */}
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <tr
                  key={i}
                  className={`border-t ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"}`}
                >
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 rounded bg-gray-600/20 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}

            {/* Empty */}
            {!isLoading && schedules.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className={`px-6 py-10 text-center text-sm ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  No schedules found. Schedules are created automatically when
                  social accounts are linked.
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading &&
              schedules.map((schedule) => {
                const isTriggeringThis = triggeringId === schedule.id;
                const target = schedule.target;

                return (
                  <tr
                    key={schedule.id}
                    className={`border-t ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"}`}
                  >
                    {/* Platform */}
                    <td className={td}>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          target?.platform === "YOUTUBE"
                            ? "bg-red-500/20 text-red-400"
                            : target?.platform === "FACEBOOK"
                              ? "bg-blue-500/20 text-blue-400"
                              : target?.platform === "INSTAGRAM"
                                ? "bg-pink-500/20 text-pink-400"
                                : target?.platform === "TIKTOK"
                                  ? "bg-gray-500/20 text-gray-300"
                                  : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {target?.platform ?? "—"}
                      </span>
                    </td>

                    {/* Handle */}
                    <td className={`${td} font-mono text-xs`}>
                      {target?.externalHandle ?? "—"}
                    </td>

                    {/* Mode */}
                    <td className={td}>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          schedule.mode === "AUTO"
                            ? "bg-[#A53860]/20 text-[#EF88AD]"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {schedule.mode}
                      </span>
                    </td>

                    {/* Interval */}
                    <td className={td}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 opacity-50" />
                        {schedule.intervalHours
                          ? `${schedule.intervalHours}h`
                          : schedule.exactTime
                            ? schedule.exactTime
                            : "—"}
                      </div>
                    </td>

                    {/* Last crawled */}
                    <td className={`${td} text-xs`}>
                      {target?.lastCrawledAt ? (
                        new Date(target.lastCrawledAt).toLocaleString()
                      ) : (
                        <span className="italic opacity-40">Never</span>
                      )}
                    </td>

                    {/* Active toggle */}
                    <td className={td}>
                      <button
                        onClick={() =>
                          onToggleActive(schedule.id, !schedule.isActive)
                        }
                        className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
                      >
                        {schedule.isActive ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-green-500" />
                            <span className="text-xs text-green-500 font-medium">
                              Active
                            </span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft
                              className={`w-5 h-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                            />
                            <span
                              className={`text-xs font-medium ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                            >
                              Paused
                            </span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className={td}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onTrigger(schedule.id)}
                          disabled={isTriggeringThis}
                          title="Trigger crawl now"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white text-xs font-medium hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isTriggeringThis ? (
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                          {isTriggeringThis ? "Triggering..." : "Run Now"}
                        </button>
                        <button
                          onClick={() => onDelete(schedule.id)}
                          title="Delete schedule"
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDarkMode
                              ? "hover:bg-red-500/20"
                              : "hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
