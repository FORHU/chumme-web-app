"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileCheck, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useRef } from "react";

import { Snackbar } from "@/modules/shared/components/Snackbar";
import { useSnackbar } from "@/modules/shared/hooks/useSnackbar";

interface APKUploadModalProps {
  onClose: () => void;
  onUpload: (
    file: File,
    meta: { versionName: string; versionCode: string; releaseNotes: string },
  ) => void;
}

const APKUploadModal = ({ onClose, onUpload }: APKUploadModalProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const [formData, setFormData] = useState({
    version: "",
    buildNumber: "",
    releaseDate: "",
    minAndroidVersion: "",
    changes: [""],
  });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, dismiss, showError } = useSnackbar();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeInput = (index: number, value: string) => {
    const updated = [...formData.changes];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, changes: updated }));
  };

  const addChangeField = () => {
    setFormData((prev) => ({ ...prev, changes: [...prev.changes, ""] }));
  };

  const removeChangeField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      changes: prev.changes.filter((_, i) => i !== index),
    }));
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;

    const isAPK = selectedFile.name.toLowerCase().endsWith(".apk");
    const maxSizeBytes = 200 * 1024 * 1024; // 200MB
    const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);

    if (!isAPK) {
      showError(
        "Invalid file type",
        `"${selectedFile.name}" is not an .apk file`,
      );
      return;
    }

    if (selectedFile.size > maxSizeBytes) {
      showError(
        "File too large",
        `File is ${fileSizeMB} MB — maximum allowed size is 200MB`,
      );
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const resetAndClose = () => {
    setFile(null);
    setFormData({
      version: "",
      buildNumber: "",
      releaseDate: "",
      minAndroidVersion: "",
      changes: [""],
    });
    onClose();
  };

  const handleSubmit = () => {
    if (!file) {
      showError("No file selected", "Please select an APK file to upload");
      return;
    }
    if (!formData.version || !formData.buildNumber) {
      showError(
        "Missing required fields",
        "Please fill in version and build number",
      );
      return;
    }

    const releaseNotes = formData.changes.filter((c) => c.trim()).join("\n");
    onUpload(file, {
      versionName: formData.version,
      versionCode: formData.buildNumber,
      releaseNotes,
    });
    resetAndClose();
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#A53860] text-sm ${
    isDark
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
  }`;

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={resetAndClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        >
          <div
            className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl pointer-events-auto ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={`sticky top-0 z-10 px-8 py-6 border-b ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-linear-to-br from-[#A53860] to-[#670D2F]">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2
                      className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Upload New APK
                    </h2>
                    <p
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Add a new version to the download center
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetAndClose}
                  className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-8">
              {/* File Upload Zone */}
              <div className="mb-8">
                <label
                  className={`block mb-2 font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  APK File <span className="text-red-500">*</span>
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => !file && fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-[#A53860] bg-[#A53860]/10"
                      : isDark
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-300 bg-gray-50"
                  }`}
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-4">
                      <FileCheck className="w-12 h-12 text-[#A53860]" />
                      <div className="text-left">
                        <p
                          className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          {file.name}
                        </p>
                        <p
                          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className={`ml-auto p-2 rounded-lg ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-200 text-gray-600"}`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload
                        className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      />
                      <p
                        className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        Drop your APK file here, or{" "}
                        <span className="text-[#A53860] cursor-pointer hover:underline">
                          browse
                        </span>
                      </p>
                      <p
                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Supports: .apk files only (Max 200MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".apk"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleFileSelect(e.target.files[0])
                  }
                />
              </div>

              {/* Version + Build Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label
                    className={`block mb-2 font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Version Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) =>
                      handleInputChange("version", e.target.value)
                    }
                    placeholder="e.g., 2.6.0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    className={`block mb-2 font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Build Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.buildNumber}
                    onChange={(e) =>
                      handleInputChange("buildNumber", e.target.value)
                    }
                    placeholder="e.g., 260"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    className={`block mb-2 font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) =>
                      handleInputChange("releaseDate", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    className={`block mb-2 font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Min Android Version
                  </label>
                  <input
                    type="text"
                    value={formData.minAndroidVersion}
                    onChange={(e) =>
                      handleInputChange("minAndroidVersion", e.target.value)
                    }
                    placeholder="e.g., 8.0 (API 26)"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* What's New */}
              <div className="mb-8">
                <label
                  className={`block mb-2 font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  What&apos;s New
                </label>
                <div className="space-y-3">
                  {formData.changes.map((change, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={change}
                        onChange={(e) =>
                          handleChangeInput(index, e.target.value)
                        }
                        placeholder={`Change #${index + 1}`}
                        className={inputClass}
                      />
                      {formData.changes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeChangeField(index)}
                          className={`px-4 py-3 rounded-lg border ${
                            isDark
                              ? "border-gray-700 hover:bg-gray-800 text-gray-400"
                              : "border-gray-300 hover:bg-gray-50 text-gray-600"
                          }`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addChangeField}
                  className={`mt-3 px-4 py-2 rounded-lg border text-sm font-medium ${
                    isDark
                      ? "border-gray-700 hover:bg-gray-800 text-gray-300"
                      : "border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  + Add Another Change
                </button>
              </div>

              {/* Upload Guidelines */}
              <div
                className={`mb-8 p-4 rounded-lg border flex items-start gap-3 ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <AlertCircle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                />
                <div>
                  <p
                    className={`text-sm font-medium ${isDark ? "text-blue-300" : "text-blue-900"}`}
                  >
                    Upload Guidelines
                  </p>
                  <ul
                    className={`text-sm mt-1 space-y-1 list-disc list-inside ${isDark ? "text-blue-400" : "text-blue-700"}`}
                  >
                    <li>File must be a valid signed .apk</li>
                    <li>Maximum file size is 200MB</li>
                    <li>Version Number and Build Number are required</li>
                    <li>
                      The uploaded release will be set to &quot;Stable&quot; by
                      default
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={
                    !file ||
                    !formData.version.trim() ||
                    !formData.buildNumber.trim()
                  }
                  className="flex-1 py-3 px-6 rounded-lg font-medium transition-opacity text-white flex items-center justify-center gap-2 bg-linear-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-5 h-5" />
                  Upload APK
                </button>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className={`px-6 py-3 rounded-lg border font-medium ${
                    isDark
                      ? "border-gray-700 hover:bg-gray-800 text-gray-300"
                      : "border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <Snackbar messages={messages} onDismiss={dismiss} />
      </>
    </AnimatePresence>
  );
};

export default APKUploadModal;
