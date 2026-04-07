"use client";

import { ChevronDown, ChevronUp, Cpu } from "lucide-react";
import { useState } from "react";

interface Props {
  data: Record<string, unknown> | null | undefined;
  isLoading: boolean;
  isDarkMode: boolean;
}

export function WorkerHealthPanel({ data, isLoading, isDarkMode }: Props) {
  const [expanded, setExpanded] = useState(false);

  const panel = `rounded-2xl border backdrop-blur-xl ${
    isDarkMode
      ? "bg-gray-800/50 border-gray-700/50"
      : "bg-white/80 border-gray-200/50"
  }`;

  const metric = (label: string, value: unknown, unit = "") => (
    <div
      key={label}
      className={`flex items-center justify-between py-3 border-b last:border-0 ${
        isDarkMode ? "border-gray-700/50" : "border-gray-100"
      }`}
    >
      <span
        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
      >
        {value !== undefined && value !== null ? `${value}${unit}` : "—"}
      </span>
    </div>
  );

  return (
    <div className={`${panel} mb-6`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`w-full flex items-center justify-between px-6 py-4 ${
          isDarkMode ? "hover:bg-gray-700/30" : "hover:bg-gray-50"
        } transition-colors rounded-2xl`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#670D2F]/20 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-[#A53860]" />
          </div>
          <span
            className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Worker Health Details
          </span>
          {data && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-500 font-medium">
              Live
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp
            className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          />
        ) : (
          <ChevronDown
            className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-32 rounded bg-gray-600/20 animate-pulse" />
                  <div className="h-4 w-16 rounded bg-gray-600/20 animate-pulse" />
                </div>
              ))}
            </div>
          )}
          {!isLoading && !data && (
            <p
              className={`text-sm text-center py-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              No worker metrics available. Worker may be offline.
            </p>
          )}
          {!isLoading && data && (
            <div>
              {metric(
                "Success Rate",
                typeof data.successRate === "number"
                  ? `${(data.successRate * 100).toFixed(1)}`
                  : null,
                "%",
              )}
              {metric(
                "Failure Rate",
                typeof data.failureRate === "number"
                  ? `${(data.failureRate * 100).toFixed(1)}`
                  : null,
                "%",
              )}
              {metric(
                "Throughput",
                typeof data.throughput === "number"
                  ? `${data.throughput.toFixed(1)}`
                  : null,
                " jobs/min",
              )}
              {/* Render any other fields dynamically */}
              {Object.entries(data)
                .filter(
                  ([k]) =>
                    !["successRate", "failureRate", "throughput"].includes(k),
                )
                .map(([k, v]) =>
                  metric(
                    k
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase()),
                    typeof v === "object" && v !== null ? JSON.stringify(v) : v,
                  ),
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
