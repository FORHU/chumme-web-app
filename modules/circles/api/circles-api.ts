import { api } from "@/modules/shared/api/api-client";
import { ApiResult } from "@/modules/shared/api/api.types";

export interface Circle {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  bannerUrl?: string;
  memberCount: number;
  category: string;
  isPrivate: boolean;
  isJoined?: boolean;
  createdAt: string;
}

export interface JoinCircleParams {
  circleId: string;
}

export const circlesApi = {
  getCircles: (params?: {
    category?: string;
    search?: string;
  }): Promise<ApiResult<Circle[]>> => api.get("/api/v1/circles", params),

  getCircleById: (id: string): Promise<ApiResult<Circle>> =>
    api.get(`/api/v1/circles/${id}`),

  joinCircle: (circleId: string): Promise<ApiResult<{ success: boolean }>> =>
    api.post(`/api/v1/circles/${circleId}/join`),

  leaveCircle: (circleId: string): Promise<ApiResult<{ success: boolean }>> =>
    api.post(`/api/v1/circles/${circleId}/leave`),
};
