"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, File, FileText, Image as ImageIcon, FileCode,
  Download, Eye, Trash2, Search, X, AlertCircle,
  ZoomIn, ZoomOut, FileCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSnackbar } from "@/modules/shared/hooks/useSnackbar";
import { Snackbar } from "@/modules/shared/components/Snackbar";
import { useFiles, useUploadFile, useDeleteFile, useFileDownloadUrl } from "../hooks/useFiles";
import { FileRecord } from "../api/file.service";

const CACHE_KEY = "chumme_file_cache";
const ALLOWED_TYPES = ["image/jpeg","image/png","image/gif","image/svg+xml","image/webp","application/pdf","text/plain","text/markdown","application/json","text/csv","application/xml"];
const MAX_SIZE = 10 * 1024 * 1024;
const CATEGORIES = ["All", "Images", "Documents", "Data"];

const formatSize = (bytes: number) => {
  if (typeof bytes !== "number" || isNaN(bytes)) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const getFileIcon = (type: string) => {
  if (type?.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
  if (type?.includes("pdf")) return <FileText className="w-5 h-5" />;
  if (type?.includes("json") || type?.includes("text")) return <FileCode className="w-5 h-5" />;
  return <File className="w-5 h-5" />;
};

const FileViewerPage = () => {
  const { data: apiFiles = [], isLoading, isError, refetch } = useFiles();
  const uploadMutation = useUploadFile();
  const deleteMutation = useDeleteFile();
  const downloadMutation = useFileDownloadUrl();

  const [mounted, setMounted] = useState(false);
  const [localFiles, setLocalFiles] = useState<FileRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(100);
  const [textContent, setTextContent] = useState("");
  const { resolvedTheme } = useTheme();
  const { messages, dismiss, showSuccess, showError } = useSnackbar();

  // ─── LOCAL PERSISTENCE (CLIENT-ONLY) ───────────────────────────────────────
  
  useEffect(() => {
    setMounted(true);
    // Only load from localStorage on the client after mount
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setLocalFiles(JSON.parse(cached));
      }
    } catch (e) {
      console.error("Failed to load local file cache", e);
    }
  }, []);

  const saveToLocal = (files: FileRecord[]) => {
    setLocalFiles(files);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(files));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }
  };

  // ─── DATA MERGING ──────────────────────────────────────────────────────────

  const isDark = mounted ? resolvedTheme === "dark" : true;
  
  // Combine API results with local storage files (prefer API for same IDs)
  const combinedFiles = Array.from(new Map(
    [...localFiles, ...(Array.isArray(apiFiles) ? apiFiles : [])].map(f => [f.id, f])
  ).values());

  const sortedFiles = combinedFiles.sort((a, b) => 
    new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  );

  const filteredFiles = sortedFiles.filter((f) => {
    if (!f) return false;
    const name = f.name || "Untitled";
    const category = f.category || "Other";
    const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "All" || category === selectedCategory;
    return matchSearch && matchCat;
  });

  // ─── HANDLERS ──────────────────────────────────────────────────────────────

  const handleFileSelect = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) { showError("Unsupported file type"); return; }
    if (file.size > MAX_SIZE) { showError("File too large. Max 10MB"); return; }
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) { showError("No file selected"); return; }
    uploadMutation.mutate(selectedFile, {
      onSuccess: (newFile) => {
        showSuccess(`${selectedFile.name} uploaded successfully`);
        saveToLocal([newFile, ...localFiles]);
        setSelectedFile(null);
        setUploadModalOpen(false);
      },
      onError: (err: any) => {
        showError(err.message || "Upload failed");
      },
    });
  };

  const handlePreview = (file: FileRecord) => {
    setZoom(100);
    setTextContent("");
    setPreviewFile(file);
    if (file.type.includes("text") || file.type.includes("json")) {
      if (file.url?.startsWith("data:")) {
        setTextContent(decodeURIComponent(file.url.split(",")[1] || ""));
      } else if (file.url) {
        fetch(file.url).then((r) => r.text()).then(setTextContent).catch(() => setTextContent("Error loading content"));
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showSuccess("File removed");
        saveToLocal(localFiles.filter(f => f.id !== id));
      },
      onError: () => {
        // Even if server fails, remove from local UI
        saveToLocal(localFiles.filter(f => f.id !== id));
        showSuccess("File removed locally");
      }
    });
  };

  const formatJSON = (text: string) => {
    try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text; }
  };

  // Safe Render Guard
  if (!mounted) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#A53860] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>File Viewer</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Upload and manage your assets</p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold px-6 h-11 rounded-xl transition-all"
        >
          <Upload className="w-5 h-5" />
          Upload File
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Files", value: combinedFiles.length, icon: File },
          { label: "Images", value: combinedFiles.filter((f) => f.category === "Images").length, icon: ImageIcon },
          { label: "Documents", value: combinedFiles.filter((f) => f.category === "Documents").length, icon: FileText },
          { label: "Data Files", value: combinedFiles.filter((f) => f.category === "Data").length, icon: FileCode },
        ].map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl p-5 flex items-center gap-4 border transition-all ${
              isDark ? "bg-gray-800/50 border-gray-700/50" : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#A53860] to-[#670D2F]">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full h-12 pl-12 pr-4 border rounded-xl text-sm transition-all outline-none focus:ring-1 focus:ring-[#A53860] ${
              isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white"
                  : isDark ? "bg-gray-800 text-gray-400 hover:text-white" : "bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* File List */}
      {isLoading && combinedFiles.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#A53860] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {filteredFiles.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`border rounded-xl p-16 text-center ${isDark ? "bg-gray-800/50 border-gray-700/50" : "bg-white border-gray-200"}`}>
          <File className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>No files found</h3>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>{searchQuery ? "Try adjusting your search" : "Upload your first file to get started"}</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filteredFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.04 }}
              className={`border transition-all rounded-xl p-4 flex items-center justify-between group ${
                isDark ? "bg-gray-800/50 border-gray-700/50 hover:border-[#A53860]/50" : "bg-white border-gray-200 hover:border-[#A53860]/50 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`p-3 rounded-xl flex-shrink-0 ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-500"}`}>
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>{file.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{formatSize(file.size)}</span>
                    <span className="text-gray-400">•</span>
                    <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {(() => {
                        try { return file.uploadDate ? new Date(file.uploadDate).toLocaleDateString() : "Recently"; } catch { return "Recently"; }
                      })()}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{file.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handlePreview(file)} className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`} title="Preview"><Eye className="w-5 h-5" /></button>
                <button 
                  onClick={() => downloadMutation.mutate(file.id, { onSuccess: (url) => window.open(url, "_blank"), onError: () => showError("Download failed") })} 
                  className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`} title="Download"
                ><Download className="w-5 h-5" /></button>
                <button onClick={() => handleDelete(file.id)} className={`p-2 rounded-lg ${isDark ? "hover:bg-red-900/30 text-red-400" : "hover:bg-red-50 text-red-600"}`} title="Delete"><Trash2 className="w-5 h-5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setUploadModalOpen(false); setSelectedFile(null); }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className={`border shadow-2xl w-full max-w-lg transition-all rounded-2xl ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} onClick={(e) => e.stopPropagation()}>
                <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <h2 className="text-xl font-bold">Upload File</h2>
                  <button onClick={() => { setUploadModalOpen(false); setSelectedFile(null); }} className="p-2 rounded-lg hover:bg-gray-500/10"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-5">
                  <div
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${dragOver ? "border-[#A53860] bg-[#A53860]/10" : isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-4">
                        <FileCheck className="w-10 h-10 text-[#A53860]" />
                        <div className="text-left">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm opacity-60">{formatSize(selectedFile.size)}</p>
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="ml-auto p-2 opacity-40 hover:opacity-100"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <>
                        <Upload className={`w-12 h-12 mx-auto mb-4 opacity-40`} />
                        <p className="font-medium">Drag file here, or <label className="text-[#A53860] cursor-pointer hover:underline">browse<input type="file" onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])} className="hidden" /></label></p>
                        <p className="text-[10px] opacity-40 mt-2 uppercase tracking-wider">Supports: PNG, JPG, GIF, WEBP, PDF, JSON, CSV, TXT</p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleUpload} disabled={uploadMutation.isPending} className="flex-1 h-11 bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-semibold rounded-xl disabled:opacity-50 transition-all">{uploadMutation.isPending ? "Uploading..." : "Upload File"}</button>
                    <button onClick={() => { setUploadModalOpen(false); setSelectedFile(null); }} className="px-6 h-11 rounded-xl border font-medium">Cancel</button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewFile(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`border shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`} onClick={(e) => e.stopPropagation()}>
                <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <div className="min-w-0 flex-1">
                    <h2 className={`text-xl font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{previewFile.name}</h2>
                    <p className={`text-sm opacity-60`}>{previewFile.type} • {formatSize(previewFile.size)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {previewFile.type.startsWith("image/") && (
                       <>
                         <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="p-2 hover:bg-gray-500/10"><ZoomOut className="w-5 h-5" /></button>
                         <span className="text-sm w-12 text-center">{zoom}%</span>
                         <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className="p-2 hover:bg-gray-500/10"><ZoomIn className="w-5 h-5" /></button>
                       </>
                    )}
                    <button onClick={() => setPreviewFile(null)} className="p-2 hover:bg-gray-500/10"><X className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className={`flex-1 overflow-auto ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
                  {previewFile.type.startsWith("image/") && (
                    <div className="flex items-center justify-center min-h-full p-8">
                      <img src={previewFile.url} alt={previewFile.name} style={{ transform: `scale(${zoom / 100})` }} className="max-w-full h-auto transition-transform" />
                    </div>
                  )}
                  {previewFile.type.includes("pdf") && (
                    <iframe src={previewFile.url} className="w-full min-h-[600px] border-none" />
                  )}
                  {(previewFile.type.includes("text") || previewFile.type.includes("json")) && (
                    <div className="p-6">
                      <pre className={`p-6 rounded-xl border font-mono text-sm overflow-x-auto ${isDark ? "bg-gray-900 text-gray-300" : "bg-white text-gray-700"}`}>
                        {previewFile.type.includes("json") ? formatJSON(textContent) : textContent}
                      </pre>
                    </div>
                  )}
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

export default FileViewerPage;
