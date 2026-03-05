import { api } from "@/modules/shared/api/api-client";
import { ApiResult } from "@/modules/shared/api/api.types";

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  location?: string;
  website?: string;
  createdAt: string;
}

export interface UpdateProfileParams {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export const profileApi = {
  getProfile: (username: string): Promise<ApiResult<UserProfile>> =>
    api.get(`/api/v1/profiles/${username}`),

  getCurrentProfile: (): Promise<ApiResult<UserProfile>> =>
    api.get("/api/v1/profiles/me"),

  updateProfile: (data: UpdateProfileParams): Promise<ApiResult<UserProfile>> =>
    api.patch("/api/v1/profiles/me", data),
};
