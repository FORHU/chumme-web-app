"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, RefreshCw } from "lucide-react";
import { useTheme } from "next-themes";
import { useSongs, useUploadSong, useDeleteSong, useArtists } from "@/modules/collaboration/hooks/useMusic";

interface MusicPageProps {
  isDark?: boolean;
}

export const MusicPage = ({ isDark: isDarkProp }: MusicPageProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = isDarkProp ?? resolvedTheme === "dark";

  const [showAddModal, setShowAddModal] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [artistError, setArtistError] = useState(false);

  const { data, isLoading, isError, refetch } = useSongs();
  const { data: artists = [] } = useArtists();
  const uploadSong = useUploadSong(false);
  const deleteSong = useDeleteSong(false);

  const [selectedArtistId, setSelectedArtistId] = useState<string>("");

  const songs = data?.data ?? [];

  const labelClass = `block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"
    }`;

  const resetForm = () => {
    setSongTitle("");
    setArtist("");
    setSelectedArtistId("");
    setAudioFile(null);
    setArtistError(false);
  };

  const handleSave = async () => {
    if (!songTitle.trim() || !audioFile) return;
    if (!selectedArtistId) {
      setArtistError(true);
      return;
    }
    setArtistError(false);
    try {
      await uploadSong.mutateAsync({
        file: audioFile,
        meta: {
          title: songTitle.trim(),
          musicArtistId: selectedArtistId,
        },
      });
      resetForm();
      setShowAddModal(false);
    } catch (err: any) {
      console.error("[MusicPage] Upload error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSong.mutateAsync(id);
    } catch (err: any) {
      console.error("[MusicPage] Delete error:", err);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              Song Management
            </h1>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Manage and upload songs to the platform
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className={`p-2.5 rounded-xl border transition-colors ${isDark
                ? "border-gray-700 hover:bg-gray-800 text-gray-400"
                : "border-gray-200 hover:bg-gray-100 text-gray-600"
              }`}
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Songs", value: data?.meta?.total ?? songs.length },
          { label: "Active Tracks", value: songs.length },
          { label: "Top Artist", value: songs[0]?.musicArtist?.name ?? "—" },
          { label: "Last Uploaded", value: songs[0] ? new Date(songs[0].createdAt).toLocaleDateString() : "—" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * i }}
            className={`p-6 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
          >
            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {isLoading ? (
                <span className={`inline-block h-7 w-16 rounded animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              ) : (
                stat.value
              )}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Song
        </button>
      </div>

      {/* Error */}
      {isError && (
        <div className={`mb-4 p-4 rounded-xl border ${isDark ? "bg-red-900/20 border-red-800/40 text-red-400" : "bg-red-50 border-red-200 text-red-700"
          }`}>
          Failed to load songs.{" "}
          <button onClick={() => refetch()} className="underline">Try again</button>
        </div>
      )}

      {/* Table / States */}
      {isLoading ? (
        <div className={`rounded-xl border p-16 text-center ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
          <div className="w-10 h-10 border-4 border-[#A53860]/20 border-t-[#A53860] rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Loading songs...
          </p>
        </div>
      ) : songs.length === 0 ? (
        <div className={`rounded-xl border p-16 text-center ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
          <div className="text-5xl mb-4">🎵</div>
          <p className={`text-lg font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            No songs yet
          </p>
          <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Click &quot;Add Song&quot; to upload your first song
          </p>
        </div>
      ) : (
        <div className={`rounded-xl border overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
          <table className="w-full">
            <thead className={isDark ? "bg-gray-900" : "bg-gray-50"}>
              <tr>
                {["Title", "Artist", "Album", "Genre", "Duration", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
              {songs.map((song) => (
                <tr
                  key={song.id}
                  className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}
                >
                  <td className={`px-6 py-4 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    {song.title}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {song.musicArtist?.name ?? "—"}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {song.musicAlbum?.album ?? "—"}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {song.musicAlbum?.genre ?? "—"}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {formatDuration(song.duration)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(song.id)}
                      disabled={deleteSong.isPending}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDark ? "hover:bg-red-500/20" : "hover:bg-red-50"
                        }`}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              className={`w-full max-w-lg rounded-2xl p-8 shadow-2xl ${isDark
                  ? "bg-[#1a2035] border border-gray-700/50"
                  : "bg-white border border-gray-200"
                }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Add Song
                </h3>
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                >
                  <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Song Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Dynamite"
                      value={songTitle}
                      onChange={(e) => setSongTitle(e.target.value)}
                      className={`w-full h-11 px-4 rounded-xl border text-sm outline-none transition-all ${isDark
                          ? "bg-[#243050] border-gray-600/50 text-white placeholder-gray-500 focus:border-[#A53860]"
                          : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#A53860]"
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

                <div>
                  <label className={labelClass}>
                    Upload Audio File <span className="text-red-500">*</span>
                  </label>
                  <label className={`flex items-center w-full h-11 px-4 rounded-xl border text-sm cursor-pointer transition-all ${isDark
                      ? "bg-[#243050] border-gray-600/50 text-gray-400 hover:border-[#A53860]/50"
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:border-[#A53860]/50"
                    }`}>
                    <input
                      type="file"
                      accept="audio/*"
                      className="sr-only"
                      onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                    />
                    <span className="text-sm">Choose file</span>
                    <span className={`ml-2 text-sm ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                      {audioFile ? audioFile.name : "No file chosen"}
                    </span>
                  </label>
                </div>

                {uploadSong.isError && (
                  <p className="text-red-500 text-sm">
                    {(uploadSong.error as any)?.message || "Upload failed."}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    disabled={uploadSong.isPending}
                    className={`px-6 h-11 rounded-xl font-semibold text-sm disabled:opacity-50 ${isDark
                        ? "bg-[#243050] text-gray-300 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!songTitle.trim() || !selectedArtistId || !audioFile || uploadSong.isPending}
                    className="px-6 h-11 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {uploadSong.isPending ? "Saving..." : "Save Song"}
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
