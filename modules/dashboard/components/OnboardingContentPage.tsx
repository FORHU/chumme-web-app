"use client";

import { useState } from "react";
import Image from "next/image";
import { useOnboardingContents, useUploadOnboardingContent, useUpdateOnboardingContent, useDeleteOnboardingContent } from "../hooks/useOnboarding";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Video, Image as ImageIcon, Upload, X, FileCheck, Link as LinkIcon, Plus } from "lucide-react";
import { useSnackbar } from "@/modules/shared/hooks/useSnackbar";
import { Snackbar } from "@/modules/shared/components/Snackbar";

interface OnboardingContent {
  id: string;
  key?: string;
  title?: string;
  type: "video" | "image";
  thumbnail?: string;
  description?: string;
  url?: string;
}

const ONBOARDING_SLOTS = [
  { key: "onboarding_video_1", fallbackLabel: "Slot 1" },
  { key: "onboarding_video_2", fallbackLabel: "Slot 2" },
  { key: "onboarding_video_3", fallbackLabel: "Slot 3" },
  { key: "onboarding_video_4", fallbackLabel: "Slot 4" },
];

const LIVE_KEYS = ["onboarding_video_1", "onboarding_video_2", "onboarding_video_3", "onboarding_video_4"];

const OnboardingContentPage = () => {
  const { data: contents = [], isLoading, refetch } = useOnboardingContents();
  const uploadMutation = useUploadOnboardingContent();
  const updateMutation = useUpdateOnboardingContent();
  const deleteMutation = useDeleteOnboardingContent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<OnboardingContent | null>(null);
  const [activeSlot, setActiveSlot] = useState<typeof ONBOARDING_SLOTS[0] | null>(null);
  const { messages, dismiss, showSuccess, showError } = useSnackbar();

  // Modal form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"video" | "image">("video");
  const [description, setDescription] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const resetForm = () => {
    setTitle(""); setType("video"); setDescription("");
    setUploadMethod("file"); setUrl(""); setFile(null);
  };

  const handleOpenModal = (content?: OnboardingContent, slot?: typeof ONBOARDING_SLOTS[0]) => {
    if (slot) setActiveSlot(slot);
    if (content) {
      setEditingContent(content);
      setTitle(content.title ?? "");           // ← real title from API
      setType(content.type ?? "video");
      setDescription(content.description ?? ""); // ← real description from API
      setUrl(content.url ?? "");
      setUploadMethod("file");
      setFile(null);
    } else {
      setEditingContent(null);
      setTitle("");
      setDescription("");
      setType("video");
      setUploadMethod("file");
      setFile(null);
      setUrl("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContent(null);
    setActiveSlot(null);
    resetForm();
  };

  const handleInsertMedia = () => {
    const emptySlot = ONBOARDING_SLOTS.find(slot => !contents.some(c => c.key === slot.key));
    if (emptySlot) {
      handleOpenModal(undefined, emptySlot);
    } else {
      showError("All onboarding slots are full. Please delete an existing content first.");
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const allowed = type === "video"
      ? ["video/mp4", "video/webm", "video/ogg"]
      : ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(selectedFile.type)) { showError(`Invalid file type for ${type}`); return; }
    const max = type === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (selectedFile.size > max) { showError(`File too large. Max ${type === "video" ? "100MB" : "10MB"}`); return; }
    setFile(selectedFile);
  };

  const handleSave = () => {
    if (!title.trim()) { showError("Title is required"); return; }

    const slotKey = activeSlot?.key ?? editingContent?.key ?? `onboarding_${type}_${Date.now()}`;

    if (file) {
      uploadMutation.mutate(
        { file, key: slotKey, type, title: title.trim(), description: description.trim() },
        {
          onSuccess: () => {
            showSuccess(`${title} saved`);
            handleCloseModal();
            setTimeout(() => refetch(), 500);
          },
          onError: (err: Error) => showError(`Upload failed: ${err.message}`),
        }
      );
      return;
    }

    if (editingContent?.id) {
      updateMutation.mutate(
        {
          id: editingContent.id,
          type,
          title: title.trim(),
          description: description.trim(),
          url: url.trim() || editingContent.url,
        },
        {
          onSuccess: () => {
            showSuccess(`${title} updated`);
            handleCloseModal();
            setTimeout(() => refetch(), 500);
          },
          onError: (err: Error) => showError(`Update failed: ${err.message}`),
        }
      );
      return;
    }

    showError("Please select a file to upload");
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showSuccess("Content removed");
        setTimeout(() => refetch(), 500);
      },
      onError: () => showError("Delete failed"),
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Onboarding Content</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage videos and images for user onboarding experience</p>
        </div>
        <button
          onClick={handleInsertMedia}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold rounded-xl shadow-lg transition-all whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Insert Media
        </button>
      </div>

      {/* Live Status Summary */}
      <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 dark:bg-gray-800/50 dark:border-gray-700/50 bg-white border-gray-200">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-green-400"
          />
          <span className="text-sm font-semibold text-white dark:text-white text-gray-900">
            {contents.filter(c => c.key && LIVE_KEYS.includes(c.key)).length} / 4 Slots Live
          </span>
        </div>
        <div className="h-4 w-px bg-gray-700 dark:bg-gray-700 bg-gray-300" />
        <span className="text-xs text-gray-400 dark:text-gray-400 text-gray-500">
          Mobile app onboarding updates instantly when a slot is uploaded
        </span>
        {/* Progress bar */}
        <div className="flex-1 h-2 bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded-full overflow-hidden ml-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(contents.filter(c => c.key && LIVE_KEYS.includes(c.key)).length / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-[#A53860] to-green-400 rounded-full"
          />
        </div>
      </div>

      {/* Grid or Empty */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#A53860] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ONBOARDING_SLOTS.map((slot, index) => {
          const uploaded = contents.find((c) => c.key === slot.key);

          // Use real API data — title and description come from the uploaded asset
          const displayLabel = uploaded?.title ?? slot.fallbackLabel;
          const displayDescription = uploaded?.description ?? "No description yet";

          return (
            <motion.div
              key={slot.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800/50 border border-gray-700/50 dark:bg-gray-800/50 dark:border-gray-700/50 bg-white border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Video or Placeholder */}
              <div className="relative aspect-video bg-gray-900">
                {uploaded?.url ? (
                  <>
                    {uploaded.type === "video" ? (
                      <video
                        key={uploaded.url} // force remount when URL changes
                        src={uploaded.url}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <Image
                        src={uploaded.url}
                        alt={displayLabel}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      onClick={() => handleDelete(uploaded.id)}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(uploaded, slot)}
                      className="absolute top-3 left-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleOpenModal(undefined, slot)}
                    className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <Upload className="w-10 h-10" />
                    <span className="text-sm font-medium">Upload Content</span>
                  </button>
                )}
              </div>

              {/* Slot Info — shows REAL data */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-[#A53860] to-[#670D2F] flex-shrink-0">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-white dark:text-white text-gray-900">{displayLabel}</h3>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-400 text-gray-500">{displayDescription}</p>
                <p className="text-xs text-gray-600 dark:text-gray-600 mt-1 font-mono">{slot.key}</p>

                {/* Status */}
                <div className="mt-3">
                  {uploaded ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-green-400">Live on Mobile App</p>
                        <p className="text-xs text-green-400/70">Onboarding screen {index + 1}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/30 border border-gray-700/50">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-400">Not Uploaded</p>
                        <p className="text-xs text-gray-500">Mobile app showing default content</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(event) => event.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#A53860] to-[#670D2F]">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingContent ? "Edit Content" : "Add Content"}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{editingContent ? "Update onboarding content" : "Create new onboarding content"}</p>
                    </div>
                  </div>
                  <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-6 overflow-y-auto flex-1">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Title <span className="text-red-500">*</span></label>
                    <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter content title" className="w-full h-12 px-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#A53860] focus:ring-1 focus:ring-[#A53860] outline-none transition-all" />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">Content Type <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-4">
                      {(["video", "image"] as const).map((contentType) => (
                        <button key={contentType} type="button" onClick={() => setType(contentType)} className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${type === contentType ? "border-[#A53860] bg-[#A53860]/10" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"}`}>
                          <div className={`p-2 rounded-lg ${type === contentType ? "bg-[#A53860]" : "bg-gray-100 dark:bg-gray-700"}`}>
                            {contentType === "video" ? <Video className={`w-5 h-5 ${type === contentType ? "text-white" : "text-gray-400 dark:text-gray-500"}`} /> : <ImageIcon className={`w-5 h-5 ${type === contentType ? "text-white" : "text-gray-400 dark:text-gray-500"}`} />}
                          </div>
                          <span className={`font-medium capitalize ${type === contentType ? "text-[#A53860] dark:text-[#EF88AD]" : "text-gray-600 dark:text-gray-300"}`}>{contentType}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload Method */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">Upload Method</label>
                    <div className="flex gap-3 mb-4">
                      {(["file", "url"] as const).map((method) => (
                        <button key={method} type="button" onClick={() => setUploadMethod(method)} className={`flex-1 px-4 py-2 rounded-xl border font-medium transition-all ${uploadMethod === method ? "border-[#A53860] bg-[#A53860] text-white" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                          {method === "file" ? "Upload File" : "Use URL"}
                        </button>
                      ))}
                    </div>
                    {uploadMethod === "file" ? (
                      <div onDrop={(event) => { event.preventDefault(); setIsDragging(false); const file = event.dataTransfer.files[0]; if (file) handleFileSelect(file); }} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? "border-[#A53860] bg-[#A53860]/10" : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"}`}>
                        {file ? (
                          <div className="flex items-center justify-center gap-4">
                            <FileCheck className="w-10 h-10 text-[#A53860]" />
                            <div className="text-left">
                              <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                              <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <button type="button" onClick={() => setFile(null)} className="ml-auto p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"><X className="w-5 h-5" /></button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                            <p className="font-medium text-gray-900 dark:text-white mb-1">Drop your {type} here, or <label className="text-[#A53860] dark:text-[#EF88AD] cursor-pointer hover:underline">browse<input type="file" accept={type === "video" ? "video/*" : "image/*"} onChange={(event) => event.target.files && handleFileSelect(event.target.files[0])} className="hidden" /></label></p>
                            <p className="text-sm text-gray-500">Max: {type === "video" ? "100MB" : "10MB"}</p>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder={`Enter ${type} URL`} className="w-full h-12 pl-12 pr-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#A53860] outline-none transition-all" />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Description <span className="text-sm font-normal text-gray-400">(Optional)</span></label>
                    <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add a brief description" rows={3} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#A53860] focus:ring-1 focus:ring-[#A53860] outline-none transition-all resize-none" />
                  </div>
                </div>

                {/* Actions */}
                <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-800 flex gap-4">
                  <button
                    onClick={() => {
                      handleSave();
                    }}
                    disabled={uploadMutation.isPending || updateMutation.isPending}
                    className="flex-1 h-11 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                  >
                    {uploadMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingContent ? "Save Changes" : "Save Content"}
                  </button>
                  <button onClick={handleCloseModal} className="px-6 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-all">
                    Cancel
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
};

export default OnboardingContentPage;
