"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, File, FileText, Image as ImageIcon, FileCode,
  Download, Eye, Trash2, Search, X, AlertCircle,
  ZoomIn, ZoomOut, FileCheck, FolderOpen,
} from "lucide-react";
import { useSnackbar } from "@/modules/shared/hooks/useSnackbar";
import { Snackbar } from "@/modules/shared/components/Snackbar";
import { useFiles, useUploadFile, useDeleteFile, useFileDownloadUrl } from "../hooks/useFiles";
import { FileRecord } from "../api/file.service";



const ALLOWED_TYPES = ["image/jpeg","image/png","image/gif","image/svg+xml","image/webp","application/pdf","text/plain","text/markdown","application/json","text/csv","application/xml"];
const MAX_SIZE = 10 * 1024 * 1024;
const CATEGORIES = ["All", "Images", "Documents", "Data"];

const getFileCategory = (type: string) => {
  if (type.startsWith("image/")) return "Images";
  if (type.includes("pdf") || type.includes("text")) return "Documents";
  if (type.includes("json") || type.includes("csv")) return "Data";
  return "Other";
};

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
  if (type.includes("pdf")) return <FileText className="w-5 h-5" />;
  if (type.includes("json") || type.includes("text")) return <FileCode className="w-5 h-5" />;
  return <File className="w-5 h-5" />;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const FileViewerPage = () => {
  const { data: files = [], isLoading } = useFiles();
  const uploadMutation = useUploadFile();
  const deleteMutation = useDeleteFile();
  const downloadMutation = useFileDownloadUrl();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(100);
  const [textContent, setTextContent] = useState("");
  const { messages, dismiss, showSuccess, showError } = useSnackbar();

  const filteredFiles = files.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "All" || f.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleFileSelect = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) { showError("Unsupported file type"); return; }
    if (file.size > MAX_SIZE) { showError("File too large. Max 10MB"); return; }
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) { showError("No file selected"); return; }
    uploadMutation.mutate(selectedFile, {
      onSuccess: () => {
        showSuccess(`${selectedFile.name} uploaded successfully`);
        setSelectedFile(null);
        setUploadModalOpen(false);
      },
      onError: () => showError("Upload failed"),
    });
  };

  const handlePreview = (file: FileRecord) => {
    setZoom(100);
    setTextContent("");
    setPreviewFile(file);
    if (file.type.includes("text") || file.type.includes("json")) {
      if (file.url.startsWith("data:")) {
        setTextContent(decodeURIComponent(file.url.split(",")[1] || ""));
      } else {
        fetch(file.url).then((r) => r.text()).then(setTextContent).catch(() => setTextContent("Error loading content"));
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => showSuccess("File deleted"),
      onError: () => showError("Delete failed"),
    });
  };

  const formatJSON = (text: string) => {
    try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text; }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">File Viewer</h1>
          <p className="text-sm mt-1 text-gray-400">Upload, preview, and manage your files</p>
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
          { label: "Total Files", value: files.length, icon: File },
          { label: "Images", value: files.filter((f) => f.category === "Images").length, icon: ImageIcon },
          { label: "Documents", value: files.filter((f) => f.category === "Documents").length, icon: FileText },
          { label: "Data Files", value: files.filter((f) => f.category === "Data").length, icon: FileCode },
        ].map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#A53860] to-[#670D2F]">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
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
            className="w-full h-12 pl-12 pr-4 bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 rounded-xl text-sm focus:border-[#A53860] focus:ring-1 focus:ring-[#A53860] transition-all outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* File List */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#A53860] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {filteredFiles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-16 text-center"
        >
          <File className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-bold text-white mb-2">No files found</h3>
          <p className="text-gray-400">{searchQuery ? "Try adjusting your search" : "Upload your first file to get started"}</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filteredFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.04 }}
              className="bg-gray-800/50 border border-gray-700/50 hover:border-[#A53860]/50 rounded-xl p-4 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="p-3 rounded-xl bg-gray-700 text-gray-300 flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{file.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">{formatSize(file.size)}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-xs text-gray-400">
                      {new Date(file.uploadDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300">{file.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handlePreview(file)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors" title="Preview">
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    downloadMutation.mutate(file.id, {
                      onSuccess: (url) => window.open(url, "_blank"),
                      onError: () => showError("Download failed"),
                    })
                  }
                  className="p-2 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(file.id)} className="p-2 rounded-lg hover:bg-red-900/30 text-red-400 transition-colors" title="Delete">
                  <Trash2 className="w-5 h-5" />
                </button>
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
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-[#A53860] to-[#670D2F]">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Upload File</h2>
                  </div>
                  <button onClick={() => { setUploadModalOpen(false); setSelectedFile(null); }} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  <div
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${dragOver ? "border-[#A53860] bg-[#A53860]/10" : "border-gray-700 bg-gray-800"}`}
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-4">
                        <FileCheck className="w-10 h-10 text-[#A53860]" />
                        <div className="text-left">
                          <p className="font-medium text-white">{selectedFile.name}</p>
                          <p className="text-sm text-gray-400">{formatSize(selectedFile.size)}</p>
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="ml-auto p-2 rounded-lg hover:bg-gray-700 text-gray-400">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                        <p className="text-white font-medium mb-1">
                          Drop your file here, or{" "}
                          <label className="text-[#EF88AD] cursor-pointer hover:underline">
                            browse
                            <input type="file" accept=".jpg,.jpeg,.png,.gif,.svg,.webp,.pdf,.txt,.md,.json,.csv,.xml" onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])} className="hidden" />
                          </label>
                        </p>
                        <p className="text-sm text-gray-500">Max file size: 10MB</p>
                      </>
                    )}
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-400">
                      <p className="font-medium text-blue-300 mb-1">Supported File Types</p>
                      <p><strong className="text-gray-300">Images:</strong> JPG, PNG, GIF, SVG, WebP</p>
                      <p><strong className="text-gray-300">Documents:</strong> PDF, TXT, MD</p>
                      <p><strong className="text-gray-300">Data:</strong> JSON, CSV, XML</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpload}
                      disabled={uploadMutation.isPending}
                      className="flex-1 h-11 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadMutation.isPending ? "Uploading..." : "Upload File"}
                    </button>
                    <button onClick={() => { setUploadModalOpen(false); setSelectedFile(null); }} className="px-6 h-11 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-medium transition-all">
                      Cancel
                    </button>
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
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-white truncate">{previewFile.name}</h2>
                    <p className="text-sm text-gray-400">{previewFile.type} • {formatSize(previewFile.size)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {previewFile.type.startsWith("image/") && (
                      <>
                        <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="p-2 rounded-lg hover:bg-gray-800 text-gray-300"><ZoomOut className="w-5 h-5" /></button>
                        <span className="text-sm text-gray-400 w-12 text-center">{zoom}%</span>
                        <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className="p-2 rounded-lg hover:bg-gray-800 text-gray-300"><ZoomIn className="w-5 h-5" /></button>
                        <div className="w-px h-6 bg-gray-700 mx-1" />
                      </>
                    )}
                    <button onClick={() => window.open(previewFile.url, "_blank")} className="p-2 rounded-lg hover:bg-gray-800 text-gray-300"><Download className="w-5 h-5" /></button>
                    <button onClick={() => setPreviewFile(null)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"><X className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto bg-gray-950">
                  {previewFile.type.startsWith("image/") && (
                    <div className="flex items-center justify-center min-h-full p-8">
                      <img src={previewFile.url} alt={previewFile.name} style={{ transform: `scale(${zoom / 100})` }} className="max-w-full h-auto object-contain transition-transform duration-200" />
                    </div>
                  )}
                  {previewFile.type.includes("pdf") && (
                    <iframe src={previewFile.url} className="w-full min-h-[600px]" title={previewFile.name} />
                  )}
                  {(previewFile.type.includes("text") || previewFile.type.includes("json")) && (
                    <div className="p-6">
                      <pre className="p-6 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 font-mono text-sm overflow-x-auto">
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
