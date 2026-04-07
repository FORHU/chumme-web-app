import { ApiResponse } from "apisauce";

import { api } from "@/modules/shared/api/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScheduleMode = "AUTO" | "MANUAL";

export interface SocialIngestionSchedule {
  id: string;
  socialIngestionTargetId: string;
  mode: ScheduleMode;
  exactTime?: string | null;
  intervalHours?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  target?: SocialIngestionTarget;
}

export interface SocialIngestionTarget {
  id: string;
  platform: "YOUTUBE" | "FACEBOOK" | "INSTAGRAM" | "TIKTOK";
  externalHandle: string;
  lastCrawledAt?: string | null;
  crawlIntervalHours: number;
  crawlPriority: number;
  isActive: boolean;
  quotaLimitHitAt?: string | null;
  nextPageToken?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChainStatus {
  isActive: boolean;
  currentStep: string;
  nextStep: string;
  chain: string[];
  pendingJobs: number;
}

export interface PipelineStatus {
  status: "active" | "unknown";
  worker?: {
    successRate?: number;
    failureRate?: number;
    throughput?: number;
    [key: string]: unknown;
  } | null;
  rabbitmq: { connected: boolean };
  database: {
    recentIngestions24h: number;
    recentSnapshots24h: number;
  };
  timestamp: string;
}

export type PlatformBreakdown =
  | Record<string, number>
  | Array<{
      platform?: string;
      name?: string;
      key?: string;
      count?: number;
      value?: number;
    }>;

export type ScoutSuccess =
  | number
  | { discoveredTalents7d?: number; [key: string]: unknown }
  | null;

export interface AnalyticsTrends {
  platforms?: PlatformBreakdown;
  trend?: Array<{ date: string; count: number }>;
  scoutSuccess?: ScoutSuccess;
}

export interface CreateScheduleParams {
  socialIngestionTargetId: string;
  mode?: ScheduleMode;
  exactTime?: string | null;
  intervalHours?: number | null;
  isActive?: boolean;
}

export interface UpdateScheduleParams {
  mode?: ScheduleMode;
  exactTime?: string | null;
  intervalHours?: number | null;
  isActive?: boolean;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const ingestionApi = {
  // ── Schedules ──────────────────────────────────────────────────────────────

  /**
   * GET /api/v1/ingestion-schedules/target/:targetId
   * Returns all schedules for a given ingestion target.
   */
  getSchedulesByTarget: (
    targetId: string,
  ): Promise<
    ApiResponse<{ success: boolean; data: SocialIngestionSchedule[] }>
  > => api.get(`/api/v1/ingestion-schedules/target/${targetId}`),

  /**
   * POST /api/v1/ingestion-schedules
   * Creates a new schedule for a target.
   */
  createSchedule: (
    params: CreateScheduleParams,
  ): Promise<
    ApiResponse<{
      success: boolean;
      message: string;
      data: SocialIngestionSchedule;
    }>
  > => api.post("/api/v1/ingestion-schedules", params),

  /**
   * PUT /api/v1/ingestion-schedules/:id
   * Updates an existing schedule.
   */
  updateSchedule: (
    id: string,
    params: UpdateScheduleParams,
  ): Promise<
    ApiResponse<{
      success: boolean;
      message: string;
      data: SocialIngestionSchedule;
    }>
  > => api.put(`/api/v1/ingestion-schedules/${id}`, params),

  /**
   * DELETE /api/v1/ingestion-schedules/:id
   * Deletes a schedule.
   */
  deleteSchedule: (
    id: string,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> =>
    api.delete(`/api/v1/ingestion-schedules/${id}`),

  /**
   * POST /api/v1/ingestion-schedules/:id/trigger
   * Manually triggers a crawl for a specific schedule.
   */
  triggerSchedule: (
    id: string,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> =>
    api.post(`/api/v1/ingestion-schedules/${id}/trigger`, {}),

  /**
   * GET /api/v1/ingestion-schedules/chain/status
   * Returns current chain state — active step, pending jobs, full chain order.
   */
  getChainStatus: (): Promise<
    ApiResponse<{ success: boolean; data: ChainStatus }>
  > => api.get("/api/v1/ingestion-schedules/chain/status"),

  /**
   * POST /api/v1/ingestion-schedules/chain/start
   * Starts the sequential crawl chain from the beginning.
   */
  startChain: (): Promise<ApiResponse<{ success: boolean; message: string }>> =>
    api.post("/api/v1/ingestion-schedules/chain/start", {}),

  /**
   * POST /api/v1/ingestion-schedules/chain/skip
   * Skips the current platform step and advances to the next.
   */
  skipChainStep: (): Promise<
    ApiResponse<{ success: boolean; message: string }>
  > => api.post("/api/v1/ingestion-schedules/chain/skip", {}),

  // ── Monitoring ─────────────────────────────────────────────────────────────

  /**
   * GET /api/v1/monitoring/pipeline
   * Returns global pipeline status (worker, RabbitMQ, DB).
   */
  getPipelineStatus: (): Promise<
    ApiResponse<{ message: string; data: PipelineStatus }>
  > => api.get("/api/v1/monitoring/pipeline"),

  /**
   * GET /api/v1/monitoring/trigger-crawl?force=true
   * Manually runs the full scheduler loop immediately.
   */
  triggerManualCrawl: (
    force = true,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> =>
    api.get(`/api/v1/monitoring/trigger-crawl?force=${force}`),

  /**
   * GET /api/v1/monitoring/worker/health
   * Returns detailed worker health metrics from Redis.
   */
  getWorkerHealth: (): Promise<
    ApiResponse<{ message: string; data: Record<string, unknown> | null }>
  > => api.get("/api/v1/monitoring/worker/health"),

  /**
   * GET /api/v1/monitoring/analytics/trends
   * Returns platform breakdown, 7-day trend, scout success rate.
   */
  getAnalyticsTrends: (): Promise<
    ApiResponse<{ message: string; data: AnalyticsTrends }>
  > => api.get("/api/v1/monitoring/analytics/trends"),
};
