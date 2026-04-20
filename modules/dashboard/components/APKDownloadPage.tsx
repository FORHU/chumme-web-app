"use client";

import { motion } from "framer-motion";
import {
  Download,
  Package,
  Calendar,
  Smartphone,
  AlertCircle,
  Upload,
} from "lucide-react";
import { useState } from "react";

import APKUploadModal from "@/modules/dashboard/components/APKUploadModal";
import { INSTALL_STEPS } from "@/modules/dashboard/constants/apk-versions";
import {
  useAPKReleases,
  useAPKUpload,
  useAPKDownloadUrl,
  useAPKDelete,
  useAPKSetLatest,
  useAPKSetStable,
} from "@/modules/dashboard/hooks/useAPK";
import { Snackbar } from "@/modules/shared/components/Snackbar";
import { useSnackbar } from "@/modules/shared/hooks/useSnackbar";

interface APKDownloadPageProps {
  isDark: boolean;
}

const formatFileSize = (size?: number | string): string => {
  if (!size && size !== 0) return "—";
  const bytes = typeof size === "string" ? parseFloat(size) : size;
  if (isNaN(bytes) || bytes === 0) return "—";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const APKDownloadPage = ({ isDark }: APKDownloadPageProps) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<Record<string, string>>(
    {},
  );
  const { messages, dismiss, showSuccess, showError, showUpload } =
    useSnackbar();

  const { data: releases, isLoading, isError } = useAPKReleases();
  const uploadMutation = useAPKUpload();
  const downloadMutation = useAPKDownloadUrl();
  const deleteMutation = useAPKDelete();
  const setLatestMutation = useAPKSetLatest();
  const setStableMutation = useAPKSetStable();

  const latestRelease = releases?.find((r) => r.isLatest);
  const totalDownloads =
    releases?.reduce((sum, r) => sum + (r.downloadCount ?? 0), 0) ?? 0;
  const totalVersions = releases?.length ?? 0;
  const lastUpdated = releases?.[0]?.updatedAt
    ? new Date(releases[0].updatedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    : "—";

  const cardClass = `p-6 rounded-xl border transition-all ${isDark ? "bg-gray-800/80 border-gray-700/50" : "bg-white border-gray-200"
    }`;

  const handleUpload = async (
    file: File,
    meta: { versionName: string; versionCode: string; releaseNotes: string },
  ) => {
    try {
      await uploadMutation.mutateAsync({ file, meta });
      showSuccess("APK Uploaded", `${meta.versionName} uploaded successfully`);
    } catch (err: unknown) {
      showError("Upload Failed", (err as Error).message);
    }
  };

  const handleDownload = async (id: string, version: string) => {
    try {
      showUpload("Preparing download...");
      const result = await downloadMutation.mutateAsync(id);
      const url = result;
      if (!url) return showError("Download URL not available");

      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch APK");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `chumme v${version}.apk`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      showSuccess("Download started");
    } catch {
      showError("Failed to download APK");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      showSuccess("Deleted", "APK release removed successfully");
    } catch (err: unknown) {
      showError("Delete Failed", (err as Error).message);
    }
  };

  const handleSetLatest = async (id: string) => {
    setLoadingAction((prev) => ({ ...prev, [id]: "latest" }));
    try {
      await setLatestMutation.mutateAsync(id);
      showSuccess("Updated", "Marked as Latest");
    } catch (err: unknown) {
      showError("Failed", (err as Error).message);
    } finally {
      setLoadingAction((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleSetStable = async (id: string) => {
    setLoadingAction((prev) => ({ ...prev, [id]: "stable" }));
    try {
      await setStableMutation.mutateAsync(id);
      showSuccess("Updated", "Marked as Stable");
    } catch (err: unknown) {
      showError("Failed", (err as Error).message);
    } finally {
      setLoadingAction((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1
            className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            APK Download Center
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Download and manage Chumme Android application packages
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          disabled={uploadMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90 transition-all text-sm shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          {uploadMutation.isPending ? "Uploading…" : "Upload New APK"}
        </button>
      </div>

      {/* Upload in-progress banner */}
      {uploadMutation.isPending && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl border flex items-center gap-4 ${isDark
              ? "bg-gray-800/80 border-gray-700/50"
              : "bg-white border-gray-200"
            }`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="shrink-0"
          >
            <Upload
              className={`w-5 h-5 ${isDark ? "text-[#EF88AD]" : "text-[#A53860]"}`}
            />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium mb-1.5 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Uploading APK…
            </p>
            <div
              className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-full w-1/2 bg-linear-to-r from-[#A53860] to-[#670D2F] rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Stat Cards — derived from live data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[
          {
            icon: Smartphone,
            label: "Latest Version",
            value: latestRelease?.versionName ?? "—",
          },
          {
            icon: Download,
            label: "Total Downloads",
            value: totalDownloads.toLocaleString(),
          },
          { icon: Package, label: "Total Versions", value: totalVersions },
          { icon: Calendar, label: "Last Updated", value: lastUpdated },
        ].map(({ icon: Icon, label, value }, i) => (
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
                <p
                  className={`text-xs sm:text-sm truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {label}
                </p>
                <p
                  className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
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
        className={`mb-8 p-4 rounded-xl border flex items-start gap-3 ${isDark
            ? "bg-blue-900/20 border-blue-800/40"
            : "bg-blue-50 border-blue-200"
          }`}
      >
        <AlertCircle
          className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? "text-blue-400" : "text-blue-600"
            }`}
        />
        <div>
          <p
            className={`text-sm font-semibold ${isDark ? "text-blue-300" : "text-blue-900"}`}
          >
            Important Installation Notice
          </p>
          <p
            className={`text-sm mt-1 ${isDark ? "text-blue-400" : "text-blue-700"}`}
          >
            Before installing, ensure you have enabled &quot;Install from
            Unknown Sources&quot; in your Android device settings. APK files are
            for testing and distribution purposes only.
          </p>
        </div>
      </motion.div>

      {/* Version Cards */}
      <div className="space-y-4 mb-8">
        {isLoading && (
          <div
            className={`p-8 rounded-xl border text-center ${isDark ? "bg-gray-800/80 border-gray-700/50 text-gray-400" : "bg-white border-gray-200 text-gray-500"}`}
          >
            Loading releases…
          </div>
        )}
        {isError && (
          <div
            className={`p-8 rounded-xl border text-center ${isDark ? "bg-red-900/20 border-red-800/40 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`}
          >
            Failed to load APK releases. The backend endpoint may not be
            available yet.
          </div>
        )}
        {!isLoading && !isError && releases?.length === 0 && (
          <div
            className={`p-8 rounded-xl border text-center ${isDark ? "bg-gray-800/80 border-gray-700/50 text-gray-400" : "bg-white border-gray-200 text-gray-500"}`}
          >
            No APK releases found.
          </div>
        )}
        {(releases ?? []).map((release) => {
          const isActioning = !!loadingAction[release.id];
          const changesList: string[] = Array.isArray(release.whatIsNew)
            ? release.whatIsNew.filter((c: string) => c.trim())
            : typeof (release as unknown as { releaseNotes?: string })
              .releaseNotes === "string"
              ? (release as unknown as { releaseNotes: string }).releaseNotes
                .split("\n")
                .filter((c: string) => c.trim())
              : [];

          return (
            <div
              key={release.id}
              className={`relative rounded-2xl border overflow-hidden transition-all ${release.isLatest
                  ? "border-[#A53860]/60 bg-white/5"
                  : release.isStable
                    ? "border-green-500/40 bg-white/5"
                    : "border-white/10 bg-white/5"
                }`}
            >
              {/* Left accent bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${release.isLatest
                    ? "bg-linear-to-b from-[#A53860] to-[#D3427B]"
                    : release.isStable
                      ? "bg-linear-to-b from-green-500 to-green-400"
                      : "bg-white/10"
                  }`}
              />

              <div className="flex items-start justify-between px-8 py-6 gap-6">
                {/* Left — version info */}
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-white font-bold text-xl">
                      Version {release.versionName}
                    </span>

                    {release.isLatest && (
                      <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#A53860] text-white shadow-lg shadow-[#A53860]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Latest
                      </span>
                    )}
                    {!release.isLatest && release.isStable && (
                      <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border border-green-500 text-green-400 bg-green-500/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Stable
                      </span>
                    )}
                    {!release.isLatest && !release.isStable && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-white/30 border border-white/10">
                        Untagged
                      </span>
                    )}
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-5 text-sm text-white/50 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Build {release.buildNumber ?? "—"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {release.createdAt
                        ? new Date(release.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )
                        : "—"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {formatFileSize(release.fileSize)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      {release.downloadCount ?? 0} downloads
                    </span>
                  </div>

                  {/* What's New */}
                  {changesList.length > 0 && (
                    <div className="mt-1">
                      <p className="text-white/80 text-sm font-semibold mb-1.5">
                        What{"'"}s New:
                      </p>
                      <ul className="flex flex-col gap-1">
                        {changesList.map((change: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-white/50"
                          >
                            <span className="text-[#A53860] mt-0.5">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right — action buttons */}
                <div className="flex flex-col gap-2 min-w-[160px]">
                  <button
                    onClick={() =>
                      handleDownload(release.id, release.versionName)
                    }
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#A53860] hover:bg-[#D3427B] text-white text-sm font-semibold transition-colors shadow-lg shadow-[#A53860]/20"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download APK
                  </button>

                  {!release.isLatest && (
                    <button
                      onClick={() => handleSetLatest(release.id)}
                      disabled={isActioning}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/20 text-white/70 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {loadingAction[release.id] === "latest"
                        ? "Updating..."
                        : "Mark as Latest"}
                    </button>
                  )}

                  {!release.isStable && (
                    <button
                      onClick={() => handleSetStable(release.id)}
                      disabled={isActioning}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/20 text-white/70 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {loadingAction[release.id] === "stable"
                        ? "Updating..."
                        : "Mark as Stable"}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(release.id)}
                    disabled={isActioning}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete Release
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className={cardClass}
      >
        <h3
          className={`text-lg font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Installation Guide
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {INSTALL_STEPS.map(({ step, title, description }) => (
            <div key={step}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#A53860] to-[#670D2F] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {step}
                </div>
                <h4
                  className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {title}
                </h4>
              </div>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {showUploadModal && (
        <APKUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}

      <Snackbar messages={messages} onDismiss={dismiss} />
    </motion.div>
  );
};
