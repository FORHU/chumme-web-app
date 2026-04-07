import { useApiQuery } from "@/modules/shared/hooks/useApiQuery";
import { useApiMutation } from "@/modules/shared/hooks/useApiMutation";
import type {
  SocialIngestionSchedule,
  ChainStatus,
  PipelineStatus,
  AnalyticsTrends,
  CreateScheduleParams,
  UpdateScheduleParams,
} from "../api/ingestion-api";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const ingestionKeys = {
  all: ["ingestion"] as const,
  pipeline: () => [...ingestionKeys.all, "pipeline"] as const,
  workerHealth: () => [...ingestionKeys.all, "worker-health"] as const,
  trends: () => [...ingestionKeys.all, "trends"] as const,
  schedules: (targetId: string) =>
    [...ingestionKeys.all, "schedules", targetId] as const,
};

// ─── Monitoring hooks ─────────────────────────────────────────────────────────

/**
 * GET /api/v1/monitoring/pipeline
 * Global pipeline status — worker, RabbitMQ, DB counts.
 */
export const useGetPipelineStatus = () => {
  return useApiQuery<{ message: string; data: PipelineStatus }>(
    [...ingestionKeys.pipeline()],
    "/api/v1/monitoring/pipeline",
  );
};

/**
 * GET /api/v1/monitoring/worker/health
 * Detailed Redis worker health metrics.
 */
export const useGetWorkerHealth = () => {
  return useApiQuery<{ message: string; data: Record<string, unknown> | null }>(
    [...ingestionKeys.workerHealth()],
    "/api/v1/monitoring/worker/health",
  );
};

/**
 * GET /api/v1/monitoring/analytics/trends
 * Platform breakdown, 7-day trend, scout success rate.
 */
export const useGetAnalyticsTrends = () => {
  return useApiQuery<{ message: string; data: AnalyticsTrends }>(
    [...ingestionKeys.trends()],
    "/api/v1/monitoring/analytics/trends",
  );
};

/**
 * GET /api/v1/ingestion-schedules/chain/status
 */
export const useGetChainStatus = () => {
  return useApiQuery<{ success: boolean; data: ChainStatus }>(
    [...ingestionKeys.all, "chain-status"],
    "/api/v1/ingestion-schedules/chain/status",
  );
};

/**
 * POST /api/v1/ingestion-schedules/chain/start
 */
export const useStartChain = (
  options?: Parameters<
    typeof useApiMutation<
      { success: boolean; message: string },
      Error,
      Record<string, never>
    >
  >[0],
) => {
  return useApiMutation<
    { success: boolean; message: string },
    Error,
    Record<string, never>
  >(options);
};

/**
 * POST /api/v1/ingestion-schedules/chain/skip
 */
export const useSkipChainStep = (
  options?: Parameters<
    typeof useApiMutation<
      { success: boolean; message: string },
      Error,
      Record<string, never>
    >
  >[0],
) => {
  return useApiMutation<
    { success: boolean; message: string },
    Error,
    Record<string, never>
  >(options);
};

// ─── Schedule hooks ───────────────────────────────────────────────────────────

/**
 * GET /api/v1/ingestion-schedules/target/:targetId
 * All schedules for a given ingestion target.
 */
export const useGetSchedulesByTarget = (
  targetId: string,
  options?: { enabled?: boolean },
) => {
  return useApiQuery<{ success: boolean; data: SocialIngestionSchedule[] }>(
    [...ingestionKeys.schedules(targetId)],
    `/api/v1/ingestion-schedules/target/${targetId}`,
    { enabled: !!targetId && (options?.enabled ?? true) },
  );
};

// ─── Mutation hooks ───────────────────────────────────────────────────────────

/**
 * POST /api/v1/ingestion-schedules/:id/trigger
 * Triggers a crawl for a specific schedule.
 */
export const useTriggerSchedule = (
  options?: Parameters<
    typeof useApiMutation<
      { success: boolean; message: string },
      Error,
      { id: string }
    >
  >[0],
) => {
  return useApiMutation<
    { success: boolean; message: string },
    Error,
    { id: string }
  >(options);
};

/**
 * POST /api/v1/monitoring/trigger-crawl?force=true
 * Triggers the full scheduler loop manually.
 * Uses POST via mutation since it's an action, not a query.
 * Note: backend accepts GET but we use POST wrapper to fit useApiMutation.
 */
export const useTriggerManualCrawl = (
  options?: Parameters<
    typeof useApiMutation<
      { success: boolean; message: string },
      Error,
      { force?: boolean }
    >
  >[0],
) => {
  return useApiMutation<
    { success: boolean; message: string },
    Error,
    { force?: boolean }
  >(options);
};

/**
 * POST /api/v1/ingestion-schedules
 */
export const useCreateSchedule = (
  options?: Parameters<
    typeof useApiMutation<
      { success: boolean; message: string; data: SocialIngestionSchedule },
      Error,
      CreateScheduleParams
    >
  >[0],
) => {
  return useApiMutation<
    { success: boolean; message: string; data: SocialIngestionSchedule },
    Error,
    CreateScheduleParams
  >(options);
};

/**
 * PUT /api/v1/ingestion-schedules/:id
 */
export const useUpdateSchedule = (
  options?: Parameters<
    typeof useApiMutation<
      { success: boolean; message: string; data: SocialIngestionSchedule },
      Error,
      UpdateScheduleParams & { id?: string }
    >
  >[0],
) => {
  return useApiMutation<
    { success: boolean; message: string; data: SocialIngestionSchedule },
    Error,
    UpdateScheduleParams & { id?: string }
  >(options);
};

/**
 * DELETE /api/v1/ingestion-schedules/:id
 */
export const useDeleteSchedule = (
  options?: Parameters<
    typeof useApiMutation<
      { success: boolean; message: string },
      Error,
      { id: string }
    >
  >[0],
) => {
  return useApiMutation<
    { success: boolean; message: string },
    Error,
    { id: string }
  >(options);
};
