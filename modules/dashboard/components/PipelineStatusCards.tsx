"use client";

import { Activity, Database, Radio, Zap } from "lucide-react";
import type { PipelineStatus } from "@/modules/platform-ingestion/api/ingestion-api";

interface Props {
  data: PipelineStatus | undefined;
  isLoading: boolean;
  isDarkMode: boolean;
}

export function PipelineStatusCards({ data, isLoading, isDarkMode }: Props) {
  const card = `rounded-2xl p-6 border backdrop-blur-xl ${
    isDarkMode
      ? "bg-gray-800/50 border-gray-700/50"
      : "bg-white/80 border-gray-200/50"
  }`;

  const skeleton = "inline-block w-16 h-7 bg-gray-600/20 rounded animate-pulse";

  const statusColor =
    data?.status === "active" ? "text-green-500" : "text-yellow-500";
  const statusBg =
    data?.status === "active" ? "bg-green-500/20" : "bg-yellow-500/20";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Pipeline status */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-lg ${statusBg} flex items-center justify-center`}
          >
            <Activity className={`w-5 h-5 ${statusColor}`} />
          </div>
          <span
            className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Pipeline
          </span>
        </div>
        <p className={`text-2xl font-bold capitalize ${statusColor}`}>
          {isLoading ? <span className={skeleton} /> : (data?.status ?? "—")}
        </p>
        <p
          className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          {data?.timestamp
            ? new Date(data.timestamp).toLocaleTimeString()
            : "—"}
        </p>
      </div>

      {/* RabbitMQ */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-lg ${
              data?.rabbitmq?.connected ? "bg-green-500/20" : "bg-red-500/20"
            } flex items-center justify-center`}
          >
            <Radio
              className={`w-5 h-5 ${
                data?.rabbitmq?.connected ? "text-green-500" : "text-red-500"
              }`}
            />
          </div>
          <span
            className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            RabbitMQ
          </span>
        </div>
        <p
          className={`text-2xl font-bold ${
            data?.rabbitmq?.connected ? "text-green-500" : "text-red-500"
          }`}
        >
          {isLoading ? (
            <span className={skeleton} />
          ) : data?.rabbitmq?.connected ? (
            "Connected"
          ) : (
            "Offline"
          )}
        </p>
        <p
          className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          Message broker
        </p>
      </div>

      {/* DB ingestions 24h */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#A53860]/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-[#A53860]" />
          </div>
          <span
            className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Ingestions (24h)
          </span>
        </div>
        <p
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          {isLoading ? (
            <span className={skeleton} />
          ) : (
            (data?.database?.recentIngestions24h ?? 0).toLocaleString()
          )}
        </p>
        <p
          className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          Items ingested
        </p>
      </div>

      {/* DB snapshots 24h */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#EF88AD]/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#EF88AD]" />
          </div>
          <span
            className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Snapshots (24h)
          </span>
        </div>
        <p
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          {isLoading ? (
            <span className={skeleton} />
          ) : (
            (data?.database?.recentSnapshots24h ?? 0).toLocaleString()
          )}
        </p>
        <p
          className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          Analytics snapshots
        </p>
      </div>
    </div>
  );
}
