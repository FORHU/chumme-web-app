"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Video, Image as ImageIcon, Upload, X, FileCheck, Link as LinkIcon } from "lucide-react";
import { useSnackbar } from "@/modules/shared/hooks/useSnackbar";
import { Snackbar } from "@/modules/shared/components/Snackbar";

interface OnboardingContent {
  id: string;
  title: string;
  type: "video" | "image";
  thumbnail: string;
  description?: string;
  url?: string;
}

const MOCK_CONTENTS: OnboardingContent[] = [
  { id: "1", title: "Welcome to Chumme", type: "video", thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop", description: "Introduction to the Chumme platform" },
  { id: "2", title: "Create Your Profile", type: "image", thumbnail: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=300&fit=crop", description: "Step-by-step profile setup guide" },
  { id: "3", title: "Join Communities", type: "video", thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop", description: "Learn how to find and join fan communities" },
];

const OnboardingContentPage = () => {
  const [contents, setContents] = useState<OnboardingContent[]>(MOCK_CONTENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<OnboardingContent | null>(null);
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

  const handleOpenModal = (content?: OnboardingContent) => {
    if (content) {
      setEditingContent(content);
      setTitle(content.title);
      setType(content.type);
      setDescription(content.description || "");
      setUrl(content.url || "");
    } else {
      setEditingContent(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContent(null);
    resetForm();
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
    if (uploadMethod === "file" && !file && !editingContent) { showError(`Please upload a ${type} file`); return; }
    if (uploadMethod === "url" && !url.trim()) { showError(`Please enter a ${type} URL`); return; }

    const thumbnail = file
      ? URL.createObjectURL(file)
      : url || editingContent?.thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop";

    if (editingContent) {
      setContents((prev) => prev.map((content) => content.id === editingContent.id ? { ...content, title: title.trim(), type, description: description.trim(), thumbnail, url: uploadMethod === "url" ? url : undefined } : content));
      showSuccess(`${title} updated successfully`);
    } else {
      setContents((prev) => [...prev, { id: Date.now().toString(), title: title.trim(), type, description: description.trim(), thumbnail, url: uploadMethod === "url" ? url : undefined }]);
      showSuccess(`${title} added to onboarding`);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const contentItem = contents.find((content) => content.id === id);
    setContents((prev) => prev.filter((content) => content.id !== id));
    showSuccess(`${contentItem?.title} removed`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Onboarding Content</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage videos and images for user onboarding experience</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold px-6 h-11 rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Content
        </button>
      </div>

      {/* Grid or Empty */}
      {contents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30 p-16 text-center"
        >
          <div className="max-w-md mx-auto">
            <div className="p-6 rounded-full bg-gray-100 dark:bg-gray-800 w-fit mx-auto mb-6">
              <Video className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No onboarding content yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by adding your first onboarding video or image</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold px-6 h-11 rounded-xl inline-flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add your first content
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {contents.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700/50 rounded-xl overflow-hidden group transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#A53860]/20 to-[#670D2F]/20">
                  <Image src={content.thumbnail} alt={content.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm flex items-center gap-2">
                      {content.type === "video" ? <Video className="w-4 h-4 text-white" /> : <ImageIcon className="w-4 h-4 text-white" />}
                      <span className="text-xs font-medium text-white capitalize">{content.type}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => handleOpenModal(content)} className="p-3 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                      <Edit className="w-5 h-5 text-white" />
                    </button>
                    <button onClick={() => handleDelete(content.id)} className="p-3 rounded-lg bg-red-500/80 backdrop-blur-sm hover:bg-red-600 transition-colors">
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">{content.title}</h3>
                  {content.description && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{content.description}</p>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

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
                  <button onClick={handleSave} className="flex-1 h-11 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold rounded-xl transition-all">
                    {editingContent ? "Save Changes" : "Save Content"}
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
