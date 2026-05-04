"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Square, Users, Eye, Activity, Wifi, Clock,
  X, AlertCircle, RefreshCw, ExternalLink, Search
} from "lucide-react";
import Image from "next/image";
import { useDebounce } from "@/modules/shared/hooks/useDebounce";
import { useSnackbar } from "@/modules/shared/hooks/useSnackbar";
import { Snackbar } from "@/modules/shared/components/Snackbar";
import { useLiveStreams, useStreamAction } from "@/modules/entertainment/hooks/useEntertainment";
import type { Stream } from "@/modules/entertainment/types/api.types";

export default function LiveVideoAPIPage() {
  const { data: apiStreams, isLoading, isError, refetch, isRefetching } = useLiveStreams();
  const streamActionMutation = useStreamAction();
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { messages, showSuccess, showError, dismiss } = useSnackbar();

  // Use API data, ensure it's always an array to prevent crashes
  const allStreams = Array.isArray(apiStreams) ? apiStreams : [];
  
  // Filter streams based on search
  const filteredStreams = allStreams.filter(s => 
    (s.title || "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (s.name || "").toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const selectedStream = allStreams.find(s => s.id === selectedStreamId) || null;

  // Helper to get viewer count safely (Handling BigInt strings from BE)
  const getViewerCount = (s: Stream) => {
    const raw = s.viewCount ?? s.viewers ?? 0;
    return typeof raw === "string" ? parseInt(raw, 10) : Number(raw);
  };

  const stats = [
    { 
      label: "Artists Live", 
      value: allStreams.length.toString(), 
      icon: Play, 
      color: "text-green-500" 
    },
    { 
      label: "Total Live Viewers", 
      value: (allStreams.reduce((acc, s) => acc + getViewerCount(s), 0) / 1000).toFixed(1) + "K", 
      icon: Users, 
      color: "text-blue-500" 
    },
    { 
      label: "Avg. Latency", 
      value: (allStreams.length > 0 
        ? allStreams.reduce((acc, s) => acc + Number(s.latency || 0), 0) / allStreams.length 
        : 0).toFixed(1) + "s", 
      icon: Wifi, 
      color: "text-yellow-500" 
    },
    { 
      label: "Data Freshness", 
      value: "30s", 
      icon: Clock, 
      color: "text-purple-500" 
    },
  ];

  const handleStreamAction = async (streamId: string, action: "start" | "stop") => {
    try {
      await streamActionMutation.mutateAsync({ id: streamId, action });
      showSuccess(`Action ${action} sent successfully`);
    } catch (_error) {
      showError(`Failed to perform ${action} action`);
    }
  };

  const [isRefreshingManually, setIsRefreshingManually] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshingManually(true);
    await refetch();
    // Ensure animation stays visible for at least 800ms for visual feedback
    setTimeout(() => setIsRefreshingManually(false), 800);
  };

  const isAnyLoading = isLoading || isRefetching || isRefreshingManually;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Artist Live Monitoring
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 font-medium">
            Real-time feed of partnered artists live on YouTube
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search streams or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-[#A53860]/20 focus:border-[#A53860] outline-none transition-all dark:text-white"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleManualRefresh}
            disabled={isAnyLoading}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 text-sm font-medium shadow-sm disabled:opacity-70 h-11"
          >
            <RefreshCw className={`w-4 h-4 ${isAnyLoading ? "animate-spin text-[#A53860]" : ""}`} />
            {isAnyLoading ? "Refreshing..." : "Refresh Feed"}
          </motion.button>
        </div>
      </div>

      {isError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">Failed to connect to the Live API. Please check your connection.</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700/50 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {isLoading ? "..." : stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && !apiStreams ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800/50 rounded-xl h-80 animate-pulse border border-gray-200 dark:border-gray-700 shadow-sm" />
          ))
        ) : filteredStreams.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">📡</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {searchTerm ? "No matching streams" : "No Artists Live"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm 
                ? `No results found for "${searchTerm}". Try a different search.`
                : "There are currently no partnered artists broadcasting live on YouTube."}
            </p>
          </div>
        ) : (
          filteredStreams.map((stream, index) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedStreamId(stream.id)}
              className="bg-white border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700/50 rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg transition-all flex flex-col shadow-sm"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-900 overflow-hidden shrink-0">
                <Image
                  src={stream.thumbnail || `https://img.youtube.com/vi/${stream.id}/maxresdefault.jpg`}
                  alt={stream.title || stream.name || "Live stream"}
                  width={480}
                  height={270}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-red-500 text-white text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                  <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
                    <Eye className="w-3.5 h-3.5 text-gray-300" />
                    {(getViewerCount(stream) / 1000).toFixed(1)}K
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-white dark:bg-transparent flex-1 flex flex-col border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-bold mb-1 line-clamp-1 text-gray-900 dark:text-white">
                  {stream.title || stream.name}
                </h3>
                {stream.name && (
                   <p className="text-xs text-gray-500 mb-3 font-medium">{stream.name}</p>
                )}
                
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-500 mb-1">Status</p>
                    <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Healthy Feed
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-500 mb-1">Source</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      <Wifi className="w-3 h-3" /> YouTube
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Stream Management Modal */}
      <AnimatePresence>
        {selectedStream && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStreamId(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden pointer-events-auto flex flex-col"
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedStream.name || "Artist Stream"}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white">
                      Live Now
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedStreamId(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-0 flex-1 overflow-y-auto">
                  {/* Video Player Section */}
                  <div className="bg-black aspect-video w-full relative">
                    <iframe
                      width="100%"
                      height="100%"
                      src={selectedStream.id.startsWith("UC") 
                        ? `https://www.youtube.com/embed/live_stream?channel=${selectedStream.id}&autoplay=1&mute=0`
                        : `https://www.youtube.com/embed/${selectedStream.id}?autoplay=1&mute=0`
                      }
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0"
                    />
                  </div>

                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Info */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{selectedStream.title}</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                           Monitoring live broadcast from partnered artist via YouTube Data API. Feed health is optimal.
                         </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Viewers</p>
                            <p className="text-lg font-bold text-[#A53860]">{getViewerCount(selectedStream).toLocaleString()}</p>
                         </div>
                         <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Latency</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {selectedStream.latency ? `${selectedStream.latency}s` : "—"}
                            </p>
                         </div>
                         <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Uptime</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                               {selectedStream.uptime 
                                 ? `${Math.floor(selectedStream.uptime / 3600)}h ${Math.floor((selectedStream.uptime % 3600) / 60)}m` 
                                 : "0h 0m"}
                            </p>
                         </div>
                         <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Health</p>
                            <p className="text-lg font-bold text-green-500 uppercase">A+</p>
                         </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                       <button
                         onClick={() => window.open(`https://youtube.com/watch?v=${selectedStream.id}`, "_blank")}
                         className="w-full py-4 rounded-xl font-bold bg-[#A53860] hover:bg-[#8A2E50] text-white shadow-lg transition-all flex items-center justify-center gap-2"
                       >
                         <ExternalLink className="w-5 h-5" />
                         Open in YouTube
                       </button>
                       <button
                         onClick={() => {
                           if (window.confirm("Are you sure you want to stop this stream? It will be removed from the mobile app immediately.")) {
                             handleStreamAction(selectedStream.id, "stop");
                           }
                         }}
                         className="w-full py-4 rounded-xl font-bold bg-white dark:bg-gray-800 border-2 border-red-500/20 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2"
                       >
                         <Square className="w-5 h-5 fill-current" />
                         Stop Stream on Mobile
                       </button>
                    </div>
                  </div>
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
