"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, Music, Mic, Clock, Disc } from "lucide-react";
import { useTheme } from "next-themes";
import { useKaraokeSongs, useUploadSong, useDeleteSong, useArtists } from "@/modules/collaboration/hooks/useMusic";
import type { KaraokeTabId } from "@/modules/collaboration/types";
import { SearchBar } from "@/modules/shared/components/SearchBar";
import { useDebounce } from "@/modules/shared/hooks/useDebounce";
import { DeleteConfirmationModal } from "@/modules/shared/components/DeleteConfirmationModal";

interface KaraokePageProps {
  isDark?: boolean;
}

export const KaraokePage = ({ isDark: isDarkProp }: KaraokePageProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = isDarkProp ?? resolvedTheme === "dark";

  const [showAddModal, setShowAddModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<KaraokeTabId>("songs");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const limit = 1000; // Large limit for "1 page" experience

  const [songTitle, setSongTitle]     = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState<string>("");
  const [audioFile, setAudioFile]     = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [lyricsFile, setLyricsFile]   = useState<File | null>(null);
  const [videoFile, setVideoFile]     = useState<File | null>(null);
  const [artistError, setArtistError] = useState(false);
  const [mp3Error, setMp3Error] = useState(false);
  const [jsonError, setJsonError] = useState(false);

  const { data, isLoading, isError, refetch } = useKaraokeSongs({ search: debouncedSearch, limit });
  const uploadSong  = useUploadSong(true);
  const deleteSong  = useDeleteSong(true);
  const { data: artists = [] } = useArtists();

  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      const originalMainClass = main.className;
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      // Force everything from the root down to not scroll
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      
      // Make the main container fixed height and flex
      main.classList.add("!h-full", "!overflow-hidden", "!flex", "!flex-col", "!p-0");
      
      // Find the parent div of main (the main column) and make it fixed height
      const mainColumn = main.parentElement;
      if (mainColumn) {
        mainColumn.classList.add("!h-screen", "!overflow-hidden");
      }

      return () => {
        main.className = originalMainClass;
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        if (mainColumn) {
          mainColumn.classList.remove("!h-screen", "!overflow-hidden");
        }
      };
    }
  }, []);

  const songs = data?.data ?? [];

  const labelClass = `block text-sm font-medium mb-2 ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

  const extractDuration = (file: File): Promise<number | null> =>
    new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const audio = document.createElement("audio");
      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(isFinite(audio.duration) ? Math.round(audio.duration) : null);
      };
      audio.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      audio.src = url;
    });

  const resetForm = () => {
    setSongTitle("");
    setSelectedArtistId("");
    setAudioFile(null);
    setAudioDuration(null);
    setLyricsFile(null);
    setVideoFile(null);
    setArtistError(false);
    setMp3Error(false);
    setJsonError(false);
  };

  const handleSave = async () => {
    if (!songTitle.trim() || !audioFile || !lyricsFile) return;
    if (!selectedArtistId) {
      setArtistError(true);
      return;
    }
    setArtistError(false);
    try {
      await uploadSong.mutateAsync({
        file: audioFile,
        lyricsFile,
        videoFile,
        meta: {
          title: songTitle.trim(),
          musicArtistId: selectedArtistId,
          duration: audioDuration ?? undefined,
        },
      });
      resetForm();
      setShowAddModal(false);
    } catch (err: unknown) {
      console.error("[KaraokePage] Upload error:", err);
    }
  };

  const handleDelete = (id: string) => {
    setSongToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (songToDelete) {
      deleteSong.mutate(songToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSongToDelete(null);
        },
      });
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 p-4 lg:p-8">
      {/* Tabs */}
      <div className={`border-b mb-6 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex gap-6">
          {(["songs", "recordings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#A53860] text-[#A53860]"
                  : isDark
                  ? "border-transparent text-gray-400 hover:text-gray-300"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Songs Tab */}
      {activeTab === "songs" && (
        <div className="flex-1 flex flex-col gap-6 min-h-0">
            {/* Header & Stats Container */}
            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
              {/* Action Button */}
              <div className="shrink-0">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white text-sm font-medium hover:opacity-90 flex items-center gap-2 transition-all shadow-md h-12"
                >
                  <Plus className="w-4 h-4" /> Add Karaoke Song
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <SearchBar
                  placeholder="Search for songs or artists..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClear={() => setSearch("")}
                />
              </div>

              {/* Stats Grid - Now smaller and aligned */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                {[
                  { label: "Total Songs", value: data?.meta?.total ?? songs.length },
                  { label: "Active Tracks", value: songs.filter(s => !s.status).length || songs.length },
                  { label: "Most Sung", value: songs[0]?.title ?? "—" },
                  { label: "Recordings", value: "—" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 * i }}
                    className={`p-3.5 rounded-xl border ${
                      isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                    } shadow-sm`}
                  >
                    <p className={`text-[10px] uppercase tracking-wider font-semibold mb-1 truncate ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {stat.label}
                    </p>
                    <p className={`text-lg font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                      {isLoading ? (
                        <span className={`inline-block h-5 w-12 rounded animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                      ) : (
                        stat.value
                      )}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Error State */}
            {isError && (
              <div className={`p-4 rounded-xl border ${
                isDark ? "bg-red-900/20 border-red-800/40 text-red-400" : "bg-red-50 border-red-200 text-red-700"
              }`}>
                Failed to load karaoke songs.{" "}
                <button onClick={() => refetch()} className="underline font-medium">Try again</button>
              </div>
            )}

            {/* Content Area (Loading / Empty / Table) */}
            {isLoading ? (
              <div className={`rounded-xl border p-16 text-center ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <div className="w-10 h-10 border-4 border-[#A53860]/20 border-t-[#A53860] rounded-full animate-spin mx-auto mb-4" />
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Loading karaoke songs...</p>
              </div>
            ) : songs.length === 0 ? (
              <div className={`rounded-xl border p-16 text-center ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <div className="text-5xl mb-4">🎤</div>
                <p className={`text-lg font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>No karaoke songs yet</p>
                <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>Click &quot;Add Karaoke Song&quot; to add your first song</p>
              </div>
            ) : (
              <div className={`flex-1 min-h-0 rounded-2xl border overflow-hidden shadow-xl flex flex-col ${
                isDark ? "bg-gray-900/40 border-gray-700/50 backdrop-blur-xl" : "bg-white/80 border-gray-200 backdrop-blur-md"
              }`}>
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  <table className="w-full text-left border-separate border-spacing-y-2 px-4">
                    <thead className={`sticky top-0 z-20 ${isDark ? "bg-gray-900/90" : "bg-gray-50/90"} backdrop-blur-md`}>
                      <tr>
                        {[
                          { label: "Title", icon: Music },
                          { label: "Artist", icon: Mic },
                          { label: "Duration", icon: Clock },
                          { label: "Type", icon: Disc },
                          { label: "Actions", icon: null }
                        ].map((h) => (
                          <th key={h.label} className={`px-4 py-4 text-[10px] font-semibold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            <div className="flex items-center gap-2">
                              {h.icon && <h.icon className="w-3 h-3" />}
                              {h.label}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence mode="popLayout">
                        {songs.map((song, index) => (
                          <motion.tr
                            key={song.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className={`group transition-all duration-300 rounded-xl overflow-hidden ${
                              isDark 
                                ? "bg-gray-800/30 hover:bg-gray-700/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]" 
                                : "bg-gray-50/50 hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
                            }`}
                          >
                            <td className="px-4 py-4 first:rounded-l-xl">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-white shadow-sm"}`}>
                                  <Music className="w-4 h-4 text-[#A53860]" />
                                </div>
                                <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{song.title}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <span className={isDark ? "text-gray-300" : "text-gray-700"}>{song.musicArtist?.name ?? "—"}</span>
                              </div>
                            </td>
                            <td className={`px-4 py-4 text-sm font-mono ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                              {formatDuration(song.duration)}
                            </td>
                            <td className="px-4 py-4">
                              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white shadow-sm">
                                Karaoke
                              </span>
                            </td>
                            <td className="px-4 py-4 last:rounded-r-xl">
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleDelete(song.id)}
                                  disabled={deleteSong.isPending}
                                  className={`p-2.5 rounded-xl transition-all ${
                                    isDark ? "bg-red-500/10 hover:bg-red-500/20" : "bg-red-50 hover:bg-red-100"
                                  } disabled:opacity-50`}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      {/* Recordings Tab */}
      {activeTab === "recordings" && (
        <div className={`flex-1 rounded-xl border p-16 text-center ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className="text-5xl mb-4">🎵</div>
          <p className={`text-lg font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            No recordings yet
          </p>
          <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Fan recordings will appear here
          </p>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => { setShowAddModal(false); resetForm(); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-2xl p-8 shadow-2xl ${
                isDark
                  ? "bg-[#1a2035] border border-gray-700/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
                Add Karaoke Song
              </h3>

              <div className="space-y-5">
                {/* Title + Artist */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Song Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Butter"
                      value={songTitle}
                      onChange={(e) => setSongTitle(e.target.value)}
                      className={`w-full h-11 px-4 rounded-xl border text-sm outline-none transition-all ${
                        isDark
                          ? "bg-[#243050] border-gray-600/50 text-white placeholder-gray-500 focus:border-[#A53860]"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A53860]"
                      } focus:ring-2 focus:ring-[#A53860]/10`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Artist <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedArtistId}
                      onChange={(e) => {
                        setSelectedArtistId(e.target.value);
                        if (e.target.value) setArtistError(false);
                      }}
                      className={`w-full h-11 px-4 rounded-xl border text-sm outline-none transition-all ${
                        isDark
                          ? "bg-[#243050] border-gray-600/50 text-white focus:border-[#A53860]"
                          : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#A53860]"
                      } focus:ring-2 focus:ring-[#A53860]/10`}
                    >
                      <option value="">Select artist...</option>
                      {artists.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                    {artistError && (
                      <p className="text-red-500 text-xs mt-1">
                        Artist is required
                      </p>
                    )}
                  </div>
                </div>

                {/* Audio File */}
                <div>
                  <label className={labelClass}>
                    Upload Karaoke Audio <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <label className={`flex items-center w-full h-11 px-4 rounded-xl border text-sm cursor-pointer transition-all ${
                      isDark
                        ? "bg-[#243050] border-gray-600/50 text-gray-400 hover:border-[#A53860]/50"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-[#A53860]/50"
                    }`}>
                      <input
                        type="file"
                        accept=".mp3,audio/mpeg"
                        className="sr-only"
                        onChange={async (e) => {
                          const file = e.target.files?.[0] ?? null;
                          if (file && !file.name.toLowerCase().endsWith(".mp3")) {
                            e.target.value = "";
                            setAudioFile(null);
                            setAudioDuration(null);
                            setMp3Error(true);
                            setTimeout(() => setMp3Error(false), 4000);
                            return;
                          }
                          setMp3Error(false);
                          setAudioFile(file);
                          if (file) {
                            const dur = await extractDuration(file);
                            setAudioDuration(dur);
                          } else {
                            setAudioDuration(null);
                          }
                        }}
                      />
                      {audioFile ? (
                        <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {audioFile.name}
                        </span>
                      ) : (
                        <>
                          <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Choose file</span>
                          <span className={`ml-2 text-sm ${isDark ? "text-gray-600" : "text-gray-400"}`}>No file chosen</span>
                        </>
                      )}
                    </label>
                    {audioFile && (
                      <button
                        type="button"
                        onClick={() => setAudioFile(null)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-red-500/20 transition-colors"
                      >
                        <X className={`w-4 h-4 ${isDark ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`} />
                      </button>
                    )}
                  </div>
                  <p className={`text-xs mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    Only .mp3 files are accepted
                  </p>
                  {mp3Error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs mt-1 text-red-500 font-medium flex items-center gap-1"
                    >
                      ✕ Invalid file type. Please upload an MP3 file only.
                    </motion.p>
                  )}
                </div>

                {/* Lyrics File */}
                <div>
                  <label className={labelClass}>
                    Upload Lyrics File (JSON) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <label className={`flex items-center w-full h-11 px-4 rounded-xl border text-sm cursor-pointer transition-all ${
                      isDark
                        ? "bg-[#243050] border-gray-600/50 text-gray-400 hover:border-[#A53860]/50"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-[#A53860]/50"
                    }`}>
                      <input
                        type="file"
                        accept=".json,application/json"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          if (file && !file.name.toLowerCase().endsWith(".json")) {
                            e.target.value = "";
                            setLyricsFile(null);
                            setJsonError(true);
                            setTimeout(() => setJsonError(false), 4000);
                            return;
                          }
                          setJsonError(false);
                          setLyricsFile(file);
                        }}
                      />
                      {lyricsFile ? (
                        <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {lyricsFile.name}
                        </span>
                      ) : (
                        <>
                          <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Choose file</span>
                          <span className={`ml-2 text-sm ${isDark ? "text-gray-600" : "text-gray-400"}`}>No .json file chosen</span>
                        </>
                      )}
                    </label>
                    {lyricsFile && (
                      <button
                        type="button"
                        onClick={() => setLyricsFile(null)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-red-500/20 transition-colors"
                      >
                        <X className={`w-4 h-4 ${isDark ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`} />
                      </button>
                    )}
                  </div>
                  <p className={`text-xs mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    Only .json files are accepted
                  </p>
                  {jsonError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs mt-1 text-red-500 font-medium flex items-center gap-1"
                    >
                      ✕ Invalid file type. Please upload a JSON file only.
                    </motion.p>
                  )}
                </div>

                {/* Video File */}
                <div>
                  <label className={labelClass}>Upload Background Video (Optional)</label>
                  <div className="relative">
                    <label className={`flex items-center w-full h-11 px-4 rounded-xl border text-sm cursor-pointer transition-all ${
                      isDark
                        ? "bg-[#243050] border-gray-600/50 text-gray-400 hover:border-[#A53860]/50"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-[#A53860]/50"
                    }`}>
                      <input
                        type="file"
                        accept="video/*"
                        className="sr-only"
                        onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                      />
                      {videoFile ? (
                        <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {videoFile.name}
                        </span>
                      ) : (
                        <>
                          <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Choose file</span>
                          <span className={`ml-2 text-sm ${isDark ? "text-gray-600" : "text-gray-400"}`}>No file chosen</span>
                        </>
                      )}
                    </label>
                    {videoFile && (
                      <button
                        type="button"
                        onClick={() => setVideoFile(null)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-red-500/20 transition-colors"
                      >
                        <X className={`w-4 h-4 ${isDark ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Error */}
                {uploadSong.isError && (
                  <p className="text-red-500 text-sm">
                    {uploadSong.error instanceof Error ? uploadSong.error.message : "Upload failed. Please try again."}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    disabled={uploadSong.isPending}
                    className={`px-6 h-11 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 ${
                      isDark
                        ? "bg-[#243050] text-gray-300 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={
                      !songTitle.trim() ||
                      !selectedArtistId ||
                      !audioFile ||
                      !lyricsFile ||
                      uploadSong.isPending
                    }
                    className="px-6 h-11 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {uploadSong.isPending ? "Saving..." : "Save Karaoke Song"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <DeleteConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleConfirmDelete}
              isLoading={deleteSong.isPending}
              isDark={isDark}
              title="Delete Song"
              description={`Are you sure you want to delete ${songs.find(s => s.id === songToDelete)?.title ?? "this song"}? This will remove it from the library.`}
            />
    </div>
  );
};
