"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, Zap, AlertTriangle, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import {
  useGetPipelineStatus,
  useGetWorkerHealth,
  useGetAnalyticsTrends,
  useGetChainStatus,
  useGetSchedulesByTarget,
  useTriggerSchedule,
  useTriggerManualCrawl,
  useUpdateSchedule,
  useDeleteSchedule,
  useStartChain,
  useSkipChainStep,
  ingestionKeys,
} from "@/modules/platform-ingestion/hooks/useIngestion";

import { AnalyticsTrendsPanel } from "./AnalyticsTrendsPanel";
import { ChainStatusPanel } from "./ChainStatusPanel";
import { PipelineStatusCards } from "./PipelineStatusCards";
import { SchedulesTable } from "./SchedulesTable";
import { WorkerHealthPanel } from "./WorkerHealthPanel";

// NOTE: SocialIngestionTarget has no dedicated list endpoint — targets are created
// automatically via the auto-sync flow. To browse schedules, you query by targetId.
// For this UI we use a known targetId input or list from a future endpoint.
const PLACEHOLDER_TARGET_ID = "";

export function PlatformIngestionCenter() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const queryClient = useQueryClient();

  const [targetId, setTargetId] = useState(PLACEHOLDER_TARGET_ID);
  const [targetIdInput, setTargetIdInput] = useState("");
  const [triggeringId, setTriggeringId] = useState<string | null>(null);
  const [deleteTargetScheduleId, setDeleteTargetScheduleId] = useState<
    string | null
  >(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // ─── Data ──────────────────────────────────────────────────────────────────

  const {
    data: pipelineData,
    isLoading: pipelineLoading,
    refetch: refetchPipeline,
  } = useGetPipelineStatus();

  const {
    data: workerData,
    isLoading: workerLoading,
    refetch: refetchWorker,
  } = useGetWorkerHealth();

  const {
    data: trendsData,
    isLoading: trendsLoading,
    refetch: refetchTrends,
  } = useGetAnalyticsTrends();

  const { data: schedulesData, isLoading: schedulesLoading } =
    useGetSchedulesByTarget(targetId, { enabled: !!targetId });

  const schedules = schedulesData?.data ?? [];

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const { mutate: triggerSchedule } = useTriggerSchedule({
    onSuccess: (result) => {
      setTriggeringId(null);
      const message =
        result &&
        typeof result === "object" &&
        "message" in result &&
        typeof (result as { message?: unknown }).message === "string"
          ? (result as { message: string }).message
          : "Crawl triggered successfully";
      showToast(message, "success");
    },
    onError: () => {
      setTriggeringId(null);
      showToast("Failed to trigger crawl", "error");
    },
  });

  const { mutate: triggerManualCrawl, isPending: manualCrawlPending } =
    useTriggerManualCrawl({
      onSuccess: () =>
        showToast("Manual crawl triggered successfully", "success"),
      onError: () => showToast("Failed to trigger manual crawl", "error"),
    });

  const { mutate: updateSchedule } = useUpdateSchedule({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingestionKeys.all });
      showToast("Schedule updated", "success");
    },
    onError: () => showToast("Failed to update schedule", "error"),
  });

  const { mutate: deleteSchedule, isPending: deletingSchedule } =
    useDeleteSchedule({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ingestionKeys.all });
        setShowDeleteConfirm(false);
        setDeleteTargetScheduleId(null);
        showToast("Schedule deleted", "success");
      },
      onError: () => showToast("Failed to delete schedule", "error"),
    });

  const {
    data: chainData,
    isLoading: chainLoading,
    refetch: refetchChain,
  } = useGetChainStatus();

  const { mutate: startChain, isPending: startingChain } = useStartChain({
    onSuccess: () => {
      showToast("Chain started successfully", "success");
      refetchChain();
    },
    onError: () => showToast("Failed to start chain", "error"),
  });

  const { mutate: skipChainStep, isPending: skippingChain } = useSkipChainStep({
    onSuccess: () => {
      showToast("Step skipped — advancing to next platform", "success");
      refetchChain();
    },
    onError: () => showToast("Failed to skip chain step", "error"),
  });

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRefreshAll = () => {
    refetchPipeline();
    refetchWorker();
    refetchTrends();
    refetchChain();
  };

  const handleTrigger = (id: string) => {
    setTriggeringId(id);
    triggerSchedule({
      endpoint: `/api/v1/ingestion-schedules/${id}/trigger`,
      method: "POST",
    });
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateSchedule({
      endpoint: `/api/v1/ingestion-schedules/${id}`,
      method: "PUT",
      data: { id, isActive },
    });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetScheduleId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetScheduleId) return;
    deleteSchedule({
      endpoint: `/api/v1/ingestion-schedules/${deleteTargetScheduleId}`,
      method: "DELETE",
    });
  };

  const handleStartChain = () => {
    startChain({
      endpoint: "/api/v1/ingestion-schedules/chain/start",
      method: "POST",
    });
  };

  const handleSkipChainStep = () => {
    skipChainStep({
      endpoint: "/api/v1/ingestion-schedules/chain/skip",
      method: "POST",
    });
  };

  const handleManualCrawl = () => {
    triggerManualCrawl({
      endpoint: "/api/v1/monitoring/trigger-crawl?force=true",
      method: "POST",
    });
  };

  const handleTargetSearch = () => {
    if (targetIdInput.trim()) setTargetId(targetIdInput.trim());
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h2
            className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Platform Ingestion
          </h2>
          <p
            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Monitor and control the content ingestion pipeline across all
            platforms.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleRefreshAll}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isDarkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleManualCrawl}
            disabled={manualCrawlPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-linear-to-r from-[#A53860] to-[#670D2F] text-white hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {manualCrawlPending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {manualCrawlPending ? "Running..." : "Force Crawl All"}
          </button>
        </div>
      </div>

      {/* Pipeline Status Cards */}
      <PipelineStatusCards
        data={pipelineData?.data}
        isLoading={pipelineLoading}
        isDarkMode={isDarkMode}
      />

      {/* Worker Health */}
      <WorkerHealthPanel
        data={workerData?.data}
        isLoading={workerLoading}
        isDarkMode={isDarkMode}
      />

      <ChainStatusPanel
        data={chainData?.data}
        isLoading={chainLoading}
        isDarkMode={isDarkMode}
        isStarting={startingChain}
        isSkipping={skippingChain}
        onStart={handleStartChain}
        onSkip={handleSkipChainStep}
        onRefresh={refetchChain}
      />

      {/* Analytics Trends */}
      <AnalyticsTrendsPanel
        data={trendsData?.data}
        isLoading={trendsLoading}
        isDarkMode={isDarkMode}
      />

      {/* Schedules Table */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Ingestion Schedules
          </h3>
        </div>

        {/* Target ID search */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter Ingestion Target ID to view its schedules..."
            value={targetIdInput}
            onChange={(e) => setTargetIdInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTargetSearch()}
            className={`flex-1 h-11 px-4 rounded-xl text-sm border transition-all ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
            } focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10`}
          />
          <button
            onClick={handleTargetSearch}
            disabled={!targetIdInput.trim()}
            className="px-4 h-11 rounded-xl text-sm font-medium bg-linear-to-r from-[#A53860] to-[#670D2F] text-white disabled:opacity-50 hover:shadow-md transition-all"
          >
            Search
          </button>
        </div>

        <SchedulesTable
          schedules={schedules}
          isLoading={schedulesLoading && !!targetId}
          isDarkMode={isDarkMode}
          triggeringId={triggeringId}
          onTrigger={handleTrigger}
          onToggleActive={handleToggleActive}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl ${
                isDarkMode ? "bg-gray-900" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3
                  className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  Delete Schedule
                </h3>
              </div>
              <p
                className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Are you sure you want to delete this schedule? This will stop
                automatic crawling for this target.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTargetScheduleId(null);
                  }}
                  disabled={deletingSchedule}
                  className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deletingSchedule}
                  className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deletingSchedule ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)}>
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
