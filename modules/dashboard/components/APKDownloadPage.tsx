"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Package,
  Calendar,
  FileCheck,
  Smartphone,
  AlertCircle,
  Upload,
  X,
  CheckCircle,
  Loader2,
  FileUp,
} from "lucide-react";
import {
  APK_VERSIONS,
  APK_STATS,
  INSTALL_STEPS,
  type APKVersion,
} from "@/modules/dashboard/constants/apk-versions";
import { api } from "@/modules/shared/api/api-client";

interface APKDownloadPageProps {
  isDark: boolean;
}

interface UploadedFile {
  id: string;
  filename: string;
  fileUrl: string;
}

interface UploadResponse {
  message: string;
  file: UploadedFile;
}

type UploadState = "idle" | "uploading" | "success" | "error";

const getStatusStyle = (status: APKVersion["status"], isDark: boolean) => {
  if (status === "Latest")
    return "bg-linear-to-r from-[#A53860] to-[#670D2F] text-white";
  if (status === "Stable") return "bg-green-100 text-green-800";
  return isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600";
};

const statCards = [
  { icon: Smartphone, label: "Latest Version",  value: APK_STATS.latestVersion  },
  { icon: Download,   label: "Total Downloads", value: APK_STATS.totalDownloads  },
  { icon: Package,    label: "Total Versions",  value: APK_STATS.totalVersions   },
  { icon: Calendar,   label: "Last Updated",    value: APK_STATS.lastUpdated     },
];

export const APKDownloadPage = ({ isDark }: APKDownloadPageProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cardClass = `p-6 rounded-xl border transition-all ${
    isDark ? "bg-gray-800/80 border-gray-700/50" : "bg-white border-gray-200"
  }`;

  const resetUploadModal = () => {
    setUploadState("idle");
    setUploadProgress(0);
    setUploadedFile(null);
    setUploadError(null);
    setSelectedFile(null);
    setIsDragOver(false);
  };

  const handleOpenModal = () => {
    resetUploadModal();
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    resetUploadModal();
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".apk")) {
      setUploadError("Only .apk files are accepted.");
      return;
    }
    setUploadError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadState("uploading");
    setUploadProgress(0);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Simulate progress while the request is in-flight
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 8, 85));
      }, 200);

      const response = await api.axiosInstance.post<UploadResponse>(
        "/api/v1/files/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.status === 201 && response.data?.file) {
        setUploadedFile(response.data.file);
        setUploadState("success");
      } else {
        throw new Error(response.data?.message ?? "Upload failed");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setUploadError(message);
      setUploadState("error");
      setUploadProgress(0);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              APK Download Center
            </h1>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Download and manage Chumme Android application packages
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90 transition-all text-sm shrink-0"
          >
            <Upload className="w-4 h-4" />
            Upload New APK
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statCards.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className={cardClass}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-br from-[#A53860] to-[#670D2F] shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs sm:text-sm truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {label}
                  </p>
                  <p className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Installation Notice */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className={`mb-8 p-4 rounded-xl border flex items-start gap-3 ${
            isDark
              ? "bg-blue-900/20 border-blue-800/40"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 shrink-0 mt-0.5 ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <div>
            <p className={`text-sm font-semibold ${isDark ? "text-blue-300" : "text-blue-900"}`}>
              Important Installation Notice
            </p>
            <p className={`text-sm mt-1 ${isDark ? "text-blue-400" : "text-blue-700"}`}>
              Before installing, ensure you have enabled "Install from Unknown
              Sources" in your Android device settings. APK files are for
              testing and distribution purposes only.
            </p>
          </div>
        </motion.div>

        {/* Version Cards */}
        <div className="space-y-4 mb-8">
          {APK_VERSIONS.map((apk, index) => (
            <motion.div
              key={apk.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
              onClick={() =>
                setSelectedId(apk.id === selectedId ? null : apk.id)
              }
              className={`p-6 rounded-xl border cursor-pointer transition-all ${
                selectedId === apk.id
                  ? isDark
                    ? "bg-gray-800/80 border-[#A53860]/50"
                    : "bg-white border-[#A53860]/50"
                  : isDark
                  ? "bg-gray-800/80 border-gray-700/50 hover:border-[#A53860]/30"
                  : "bg-white border-gray-200 hover:border-[#A53860]/30"
              }`}
            >
              <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                {/* Left — version info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Version {apk.version}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 text-xs rounded-full font-semibold ${getStatusStyle(apk.status, isDark)}`}
                    >
                      {apk.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-5 mb-4">
                    {[
                      { Icon: Package, text: `Build ${apk.build}` },
                      {
                        Icon: Calendar,
                        text: new Date(apk.releaseDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        ),
                      },
                      { Icon: FileCheck, text: apk.size },
                      {
                        Icon: Download,
                        text: `${apk.downloads.toLocaleString()} downloads`,
                      },
                    ].map(({ Icon, text }) => (
                      <div key={text} className="flex items-center gap-1.5">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p
                      className={`text-sm font-semibold mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      What's New:
                    </p>
                    <ul className="space-y-1">
                      {apk.changes.map((change) => (
                        <li
                          key={change}
                          className={`text-sm flex items-start gap-2 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <span className="text-[#A53860] shrink-0 mt-0.5">
                            •
                          </span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right — action buttons */}
                <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href={apk.downloadUrl}
                    download={`chumme-v${apk.version}.apk`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#A53860] to-[#670D2F] text-white font-medium text-sm hover:opacity-90 transition-all whitespace-nowrap">
                      <Download className="w-4 h-4" />
                      Download APK
                    </button>
                  </a>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-sm transition-all whitespace-nowrap ${
                      isDark
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Installation Guide */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className={cardClass}
        >
          <h3 className={`text-lg font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
            Installation Guide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {INSTALL_STEPS.map(({ step, title, description }) => (
              <div key={step}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#A53860] to-[#670D2F] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {step}
                  </div>
                  <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {title}
                  </h4>
                </div>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Upload Modal ── */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className={`fixed inset-0 flex items-center justify-center z-50 p-4`}
            >
              <div
                className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 ${
                  isDark
                    ? "bg-gray-900 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Upload New APK
                    </h2>
                    <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Upload to <code className="text-[#A53860] font-mono text-xs">POST /api/v1/files/upload</code>
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* ── Success state ── */}
                {uploadState === "success" && uploadedFile ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      Upload Successful!
                    </h3>
                    <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {uploadedFile.filename}
                    </p>
                    {uploadedFile.fileUrl && (
                      <p className={`text-xs font-mono break-all mb-6 px-3 py-2 rounded-lg ${
                        isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                      }`}>
                        {uploadedFile.fileUrl}
                      </p>
                    )}
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Now update{" "}
                      <code className="text-[#A53860] text-xs font-mono">
                        modules/dashboard/constants/apk-versions.ts
                      </code>{" "}
                      with the new version details.
                    </p>
                    <button
                      onClick={handleCloseModal}
                      className="mt-6 px-6 py-2.5 rounded-xl bg-linear-to-r from-[#A53860] to-[#670D2F] text-white font-medium text-sm hover:opacity-90 transition-all"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Drop zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-4 ${
                        isDragOver
                          ? "border-[#A53860] bg-[#A53860]/5"
                          : selectedFile
                          ? isDark
                            ? "border-green-500/50 bg-green-900/10"
                            : "border-green-400 bg-green-50"
                          : isDark
                          ? "border-gray-600 hover:border-[#A53860]/50 hover:bg-gray-800/50"
                          : "border-gray-300 hover:border-[#A53860]/50 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".apk"
                        className="hidden"
                        onChange={handleInputChange}
                      />
                      {selectedFile ? (
                        <>
                          <FileUp className="w-10 h-10 text-green-500 mx-auto mb-3" />
                          <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                            {selectedFile.name}
                          </p>
                          <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB — click to change
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className={`w-10 h-10 mx-auto mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                          <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                            Drag & drop your APK here
                          </p>
                          <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            or click to browse — .apk files only
                          </p>
                        </>
                      )}
                    </div>

                    {/* Error message */}
                    {uploadError && (
                      <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="text-sm text-red-500">{uploadError}</p>
                      </div>
                    )}

                    {/* Progress bar */}
                    {uploadState === "uploading" && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            Uploading…
                          </span>
                          <span className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                          <motion.div
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full rounded-full bg-linear-to-r from-[#A53860] to-[#670D2F]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer actions */}
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={handleCloseModal}
                        className={`px-5 py-2.5 rounded-xl border font-medium text-sm transition-all ${
                          isDark
                            ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploadState === "uploading"}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#A53860] to-[#670D2F] text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {uploadState === "uploading" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading…
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Upload APK
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
