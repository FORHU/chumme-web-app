"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Square, Users, Eye, Activity, Wifi, Clock,
  Zap, X, Maximize2, Pause
} from "lucide-react";
import { useSnackbar } from "@/modules/shared/hooks/useSnackbar";
import { Snackbar } from "@/modules/shared/components/Snackbar";

interface Stream {
  id: string;
  title: string;
  streamId: string;
  thumbnail: string;
  status: "live" | "paused" | "offline";
  viewers: number;
  bitrate: number;
  latency: number;
  uptime: number;
  health: "healthy" | "warning" | "critical";
}

const MOCK_STREAMS: Stream[] = [
  {
    id: "1",
    title: "Global K-Pop Concert 2026",
    streamId: "stream_kpop_live_01",
    thumbnail: "https://images.unsplash.com/photo-1540039155733-d7696d00cbcb?w=800&q=80",
    status: "live",
    viewers: 125430,
    bitrate: 8500,
    latency: 1.2,
    uptime: 14500,
    health: "healthy",
  },
  {
    id: "2",
    title: "Indie Rock Festival - Day 2",
    streamId: "stream_indie_rock_02",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    status: "live",
    viewers: 45200,
    bitrate: 6200,
    latency: 2.1,
    uptime: 8200,
    health: "warning",
  },
  {
    id: "3",
    title: "Acoustic Sessions: Local Artists",
    streamId: "stream_acoustic_03",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    status: "offline",
    viewers: 0,
    bitrate: 0,
    latency: 0,
    uptime: 0,
    health: "critical",
  },
  {
    id: "4",
    title: "DJ Set: Neon Nights",
    streamId: "stream_dj_neon_04",
    thumbnail: "https://images.unsplash.com/photo-1571266028243-cb40fce7573f?w=800&q=80",
    status: "live",
    viewers: 89000,
    bitrate: 7800,
    latency: 1.5,
    uptime: 21000,
    health: "healthy",
  },
];

const STATS = [
  { label: "Active Streams", value: "3", icon: Play, color: "text-green-500" },
  { label: "Total Viewers", value: "259.6K", icon: Users, color: "text-blue-500" },
  { label: "Avg. Bitrate", value: "7.5 Mbps", icon: Activity, color: "text-purple-500" },
  { label: "Avg. Latency", value: "1.6s", icon: Wifi, color: "text-yellow-500" },
];

export default function LiveVideoAPIPage() {
  const [streams, setStreams] = useState<Stream[]>(MOCK_STREAMS);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const { messages, showSuccess, showError, dismiss } = useSnackbar();

  const handleStreamAction = (streamId: string, action: "start" | "stop") => {
    setStreams((prevStreams) =>
      prevStreams.map((s) => {
        if (s.id !== streamId) return s;
        if (action === "start") {
          showSuccess("Stream started");
          return { ...s, status: "live" as const };
        }
        showError("Stream stopped");
        return { ...s, status: "offline" as const, uptime: 0 };
      })
    );
    setSelectedStream((prev) => {
      if (!prev || prev.id !== streamId) return prev;
      if (action === "start") return { ...prev, status: "live" as const };
      return { ...prev, status: "offline" as const, uptime: 0 };
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Live Video API Dashboard
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Monitor and manage all active streams in real-time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700/50 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream, index) => (
          <motion.div
            key={stream.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedStream(stream)}
            className="bg-white border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700/50 rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg transition-all flex flex-col"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-900 overflow-hidden shrink-0">
              <img
                src={stream.thumbnail}
                alt={stream.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {stream.status === "live" ? (
                  <span className="px-2.5 py-1 rounded-md bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-gray-600/80 text-white text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider backdrop-blur-md">
                    OFFLINE
                  </span>
                )}
                {stream.status === "live" && (
                  <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 shadow-lg">
                    <Eye className="w-3.5 h-3.5 text-gray-300" />
                    {(stream.viewers / 1000).toFixed(1)}K
                  </span>
                )}
              </div>

              {stream.status === "live" && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    stream.health === "healthy" ? "bg-green-500" :
                    stream.health === "warning" ? "bg-yellow-500" : "bg-red-500"
                  } shadow-[0_0_8px_currentColor]`} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 bg-white dark:bg-transparent flex-1 flex flex-col border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-bold mb-3 line-clamp-1 text-gray-900 dark:text-white">
                {stream.title}
              </h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1 flex items-center gap-1"><Activity className="w-3 h-3 text-gray-400 dark:text-gray-500" /> Bitrate</p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {stream.status === "live" ? `${(stream.bitrate / 1000).toFixed(1)} Mbps` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1 flex items-center gap-1"><Wifi className="w-3 h-3 text-gray-400 dark:text-gray-500" /> Latency</p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {stream.status === "live" ? `${stream.latency}s` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" /> Uptime</p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {stream.status === "live" ? `${Math.floor(stream.uptime / 3600)}h ${Math.floor((stream.uptime % 3600) / 60)}m` : "-"}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700/50 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-500 font-mono tracking-tight">ID: {stream.streamId}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stream Management Modal */}
      <AnimatePresence>
        {selectedStream && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStream(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto pointer-events-auto flex flex-col"
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    Stream Management
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      selectedStream.status === "live" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-gray-500/10 text-gray-500 border border-gray-500/20"
                    }`}>
                      {selectedStream.status}
                    </span>
                  </h2>
                  <button
                    onClick={() => setSelectedStream(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col lg:flex-row gap-6">
                  {/* Left Column: Player & Info */}
                  <div className="flex-[2] space-y-6">
                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-6 relative aspect-video bg-black flex items-center justify-center">
                      {selectedStream.status === "live" ? (
                        <>
                          <img src={selectedStream.thumbnail} alt="Stream preview" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 bg-black/20" />
                          <button className="absolute p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all transform hover:scale-110">
                            <Play className="w-8 h-8 fill-current" />
                          </button>
                          <button className="absolute bottom-4 right-4 p-2 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors">
                            <Maximize2 className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-gray-500">
                          <Square className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>Stream is currently offline</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Stream Information</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Title</p>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedStream.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Stream Key / ID</p>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-300 font-mono">
                              {selectedStream.streamId}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Health & Metrics */}
                  <div className="flex-1 space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        Health Metrics
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500 dark:text-gray-400">Stream Health</span>
                            <span className={`font-medium capitalize ${
                              selectedStream.health === "healthy" ? "text-green-500" :
                              selectedStream.health === "warning" ? "text-yellow-500" : "text-red-500"
                            }`}>{selectedStream.health}</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <div className={`h-full rounded-full ${
                              selectedStream.health === "healthy" ? "bg-green-500 w-full" :
                              selectedStream.health === "warning" ? "bg-yellow-500 w-3/4" : "bg-red-500 w-1/4"
                            }`} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500 dark:text-gray-400">Bitrate</span>
                            <span className="font-medium text-gray-900 dark:text-white">{(selectedStream.bitrate / 1000).toFixed(1)} Mbps</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full w-3/4" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500 dark:text-gray-400">Latency</span>
                            <span className="font-medium text-gray-900 dark:text-white">{selectedStream.latency}s</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full w-1/4" />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500 dark:text-gray-400">Viewers</span>
                            <span className="font-medium text-gray-900 dark:text-white">{selectedStream.viewers.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-4 bg-gray-50/50 dark:bg-gray-900/50">
                  <button
                    onClick={() => handleStreamAction(selectedStream.id, "start")}
                    disabled={selectedStream.status === "live"}
                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      selectedStream.status === "live" 
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed" 
                        : "bg-[#A53860] hover:bg-[#8A2E50] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    }`}
                  >
                    <Play className="w-5 h-5" />
                    Start Stream
                  </button>
                  <button
                    onClick={() => handleStreamAction(selectedStream.id, "stop")}
                    disabled={selectedStream.status !== "live"}
                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      selectedStream.status !== "live" 
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed" 
                        : "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30"
                    }`}
                  >
                    <Square className="w-5 h-5" />
                    Stop Stream
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      <Snackbar messages={messages} onDismiss={dismiss} />
    </div>
  );
}
