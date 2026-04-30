"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X, Upload, Edit, Trash2, Music } from "lucide-react";
import Image from "next/image";
import { useArtists, useCreateArtist, useUpdateArtist, useDeleteArtist } from "@/modules/collaboration/hooks/useMusic";
import { useDebounce } from "@/modules/shared/hooks/useDebounce";
import { Pagination } from "@/modules/shared/components/Pagination";
import { DeleteConfirmationModal } from "@/modules/shared/components/DeleteConfirmationModal";
import { useTheme } from "next-themes";

interface Artist {
  id: string;
  name: string;
  genre: string;
  description: string;
  imageUrl?: string;
}

const GENRES = ["Pop", "Rock", "Hip-Hop", "R&B", "Country", "K-Pop", "Jazz", "Classical", "Electronic", "Folk"];

const ArtistPage = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const createArtist = useCreateArtist();
  const updateArtist = useUpdateArtist();
  const deleteArtist = useDeleteArtist();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const { data: fetchedArtists = [], isLoading } = useArtists({ search: debouncedQuery });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<string | null>(null);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState({ name: "", genre: "", description: "", imageUrl: "" });

  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the debounced search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);
  const limit = 6;

  const artists: Artist[] = fetchedArtists.map(fetchedArtist => ({
    id: fetchedArtist.id,
    name: fetchedArtist.name || "Unknown Artist",
    genre: ((fetchedArtist as unknown as Record<string, unknown>).genre as string) || "", 
    description: ((fetchedArtist as unknown as Record<string, unknown>).bio as string) || "",
    imageUrl: fetchedArtist.imageUrl || undefined
  }));

  const handleOpenModal = (artist?: Artist) => {
    if (artist) {
      setEditingArtist(artist);
      setFormData({ name: artist.name, genre: artist.genre, description: artist.description, imageUrl: artist.imageUrl || "" });
    } else {
      setEditingArtist(null);
      setFormData({ name: "", genre: "", description: "", imageUrl: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArtist(null);
    setFormData({ name: "", genre: "", description: "", imageUrl: "" });
  };

  const handleSaveArtist = () => {
    if (!formData.name.trim()) return;
    
    const payload = {
      name: formData.name,
      platform: "YOUTUBE", // Required by backend
      bio: formData.description,
      imageUrl: formData.imageUrl,
      genre: formData.genre,
    };

    if (editingArtist) {
      updateArtist.mutate(
        { id: editingArtist.id, data: payload },
        { onSuccess: handleCloseModal }
      );
    } else {
      createArtist.mutate(payload, { onSuccess: handleCloseModal });
    }
  };

  const handleDeleteArtist = (id: string) => {
    setArtistToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (artistToDelete) {
      deleteArtist.mutate(artistToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setArtistToDelete(null);
        },
      });
    }
  };

  const filteredArtists = artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      artist.genre.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArtists.length / limit);
  const paginatedArtists = filteredArtists.slice((page - 1) * limit, page * limit);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Artists</h1>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Manage your music artists</p>
        </div>
      </div>

      {/* Search and Add Artist Section */}
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input Container */}
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search artists by name or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500 rounded-xl text-sm focus:border-[#A53860] focus:ring-1 focus:ring-[#A53860] transition-all outline-none"
              />
            </div>
          {/* Add Artist Button */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold px-6 h-11 rounded-xl transition-all w-full sm:w-auto whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Add Artist</span>
          </button>
        </div>

      {/* Artist Grid or Empty State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20">
          <div className="w-12 h-12 border-4 border-[#A53860]/20 border-t-[#A53860] rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Loading artists...</p>
        </div>
      ) : filteredArtists.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700/50 rounded-xl p-16 text-center"
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <Music className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              {searchQuery ? "No artists found" : "No artists added yet"}
            </h3>
            <p className="text-sm mb-6 text-gray-500 dark:text-gray-400">
              {searchQuery ? "Try adjusting your search query" : "Start building your artist collection by adding your first artist"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => handleOpenModal()}
                className="bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold px-6 h-11 rounded-xl transition-all"
              >
                Add your first artist
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:bg-gray-800 rounded-xl p-6 transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full border-2 border-[#A53860] bg-gradient-to-br from-[#A53860] to-[#670D2F] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {artist.imageUrl ? (
                      <Image
                        src={artist.imageUrl}
                        alt={artist.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      (artist.name || "??").substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1 truncate text-gray-900 dark:text-white">{artist.name}</h3>
                    {artist.genre && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#A53860]/20 text-[#EF88AD]">
                        {artist.genre}
                      </span>
                    )}
                  </div>
                </div>
                {artist.description && (
                  <p className="text-sm mb-4 line-clamp-2 text-gray-500 dark:text-gray-400">{artist.description}</p>
                )}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700/30">
                  <button
                    onClick={() => handleOpenModal(artist)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteArtist(artist.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isDark={isDark}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingArtist ? "Edit Artist" : "Add New Artist"}</h2>
                  <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-gray-900 dark:text-white">
                      Artist Name <span className="text-[#A53860]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter artist name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl text-sm bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500 focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-gray-900 dark:text-white">Genre</label>
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl text-sm bg-white border border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 transition-all outline-none"
                    >
                      <option value="">Select a genre</option>
                      {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-gray-900 dark:text-white">Profile Image URL</label>
                    <div className="relative">
                      <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full h-12 pl-12 pr-4 rounded-xl text-sm bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500 focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-gray-900 dark:text-white">Description</label>
                    <textarea
                      placeholder="Enter a short description about the artist..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl text-sm bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500 focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 transition-all resize-none outline-none"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 h-11 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveArtist}
                    disabled={!formData.name.trim()}
                    className="flex-1 h-11 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingArtist ? "Update Artist" : "Save Artist"}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteArtist.isPending}
        isDark={isDark}
        title="Delete Artist"
        description={`Are you sure you want to delete ${artists.find(a => a.id === artistToDelete)?.name ?? "this artist"}? This will remove all their associated data.`}
      />
    </div>
  );
};

export default ArtistPage;
