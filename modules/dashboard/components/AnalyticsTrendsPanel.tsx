"use client";

import { TrendingUp } from "lucide-react";
import type { AnalyticsTrends } from "@/modules/platform-ingestion/api/ingestion-api";

interface Props {
  data: AnalyticsTrends | undefined;
  isLoading: boolean;
  isDarkMode: boolean;
}

const PLATFORM_COLORS: Record<string, string> = {
  YOUTUBE: "#FF0000",
  FACEBOOK: "#1877F2",
  INSTAGRAM: "#E1306C",
  TIKTOK: "#010101",
};

export function AnalyticsTrendsPanel({ data, isLoading, isDarkMode }: Props) {
  const panel = `rounded-2xl border backdrop-blur-xl p-6 ${
    isDarkMode
      ? "bg-gray-800/50 border-gray-700/50"
      : "bg-white/80 border-gray-200/50"
  }`;

  const platforms = data?.platforms;
  const platformEntries: [string, number][] = Array.isArray(platforms)
    ? platforms.map((p) => {
        const item = p as {
          platform?: unknown;
          name?: unknown;
          key?: unknown;
          count?: unknown;
          value?: unknown;
        };

        const rawPlatform = item.platform ?? item.name ?? item.key ?? "UNKNOWN";
        const platform =
          typeof rawPlatform === "string" ? rawPlatform : String(rawPlatform);

        const rawCount = item.count ?? item.value ?? 0;
        const count =
          typeof rawCount === "number" ? rawCount : Number(rawCount);

        return [platform, Number.isFinite(count) ? count : 0];
      })
    : Object.entries(platforms ?? {}).map(([k, v]) => {
        const count = typeof v === "number" ? v : Number(v);
        return [k, Number.isFinite(count) ? count : 0];
      });

  const totalPlatform = platformEntries.reduce((a, [, v]) => a + v, 0);

  const maxTrend = data?.trend
    ? Math.max(...data.trend.map((t) => t.count), 1)
    : 1;

  console.log("[trends] raw platforms:", platforms);
  console.log(
    "[trends] platforms[0]:",
    Array.isArray(platforms) ? platforms[0] : undefined,
  );

  const scoutSuccess = data?.scoutSuccess;
  const scoutSuccessValue =
    typeof scoutSuccess === "number"
      ? scoutSuccess
      : scoutSuccess &&
          typeof scoutSuccess === "object" &&
          "discoveredTalents7d" in scoutSuccess &&
          typeof (scoutSuccess as { discoveredTalents7d?: unknown })
            .discoveredTalents7d === "number"
        ? (scoutSuccess as { discoveredTalents7d: number }).discoveredTalents7d
        : undefined;

  const scoutSuccessIsRate =
    scoutSuccessValue !== undefined &&
    scoutSuccessValue >= 0 &&
    scoutSuccessValue <= 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Platform breakdown */}
      <div className={panel}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#A53860]/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#A53860]" />
          </div>
          <h3
            className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Platform Breakdown
          </h3>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-24 rounded bg-gray-600/20 animate-pulse" />
                <div className="h-2 w-full rounded-full bg-gray-600/20 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !data?.platforms && (
          <p
            className={`text-sm text-center py-6 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            No platform data available.
          </p>
        )}

        {!isLoading && data?.platforms && (
          <div className="space-y-4">
            {platformEntries.map(([platform, count]) => {
              const pct = totalPlatform > 0 ? (count / totalPlatform) * 100 : 0;
              const color = PLATFORM_COLORS[platform] ?? "#A53860";
              return (
                <div key={platform}>
                  <div className="flex justify-between mb-1">
                    <span
                      className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {platform}
                    </span>
                    <span
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {count.toLocaleString()} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div
                    className={`h-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
                  >
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
            <div
              className={`pt-2 text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              {scoutSuccessIsRate
                ? "Scout success rate:"
                : "Scout success (7d):"}{" "}
              <span className="text-green-500 font-semibold">
                {scoutSuccessValue === undefined
                  ? "—"
                  : scoutSuccessValue > 1
                    ? `${scoutSuccessValue.toLocaleString()}`
                    : `${(scoutSuccessValue * 100).toFixed(1)}%`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 7-day trend */}
      <div className={panel}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#EF88AD]/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#EF88AD]" />
          </div>
          <h3
            className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            7-Day Ingestion Trend
          </h3>
        </div>

        {isLoading && (
          <div className="flex items-end gap-2 h-32">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gray-600/20 animate-pulse"
                style={{ height: `${30 + ((i * 37) % 70)}%` }}
              />
            ))}
          </div>
        )}

        {!isLoading && !data?.trend?.length && (
          <p
            className={`text-sm text-center py-6 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            No trend data available.
          </p>
        )}

        {!isLoading && data?.trend?.length && (
          <div>
            <div className="flex items-end gap-1.5 h-32">
              {data.trend.map((point, i) => {
                const heightPct =
                  maxTrend > 0 ? (point.count / maxTrend) * 100 : 0;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1 group relative"
                  >
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-[#A53860] to-[#EF88AD] transition-all duration-300 group-hover:opacity-80"
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                    />
                    {/* Tooltip */}
                    <div
                      className={`absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10`}
                    >
                      <div
                        className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                          isDarkMode
                            ? "bg-gray-700 text-white"
                            : "bg-gray-900 text-white"
                        }`}
                      >
                        {point.count.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              {data.trend.map((point, i) => (
                <span
                  key={i}
                  className={`text-xs ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
                >
                  {new Date(point.date).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                  })}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
