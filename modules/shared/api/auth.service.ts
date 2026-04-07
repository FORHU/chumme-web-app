import { api } from "@/modules/shared/api/api-client";
import type {
  AuthResponse,
  RegisterRequest,
  User,
  ApiEnvelope,
} from "@/modules/shared/api/api.types";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiEnvelope<AuthResponse>>(
      "/api/v1/auth/login",
      { email, password },
    );
    if (!response.ok) {
      throw new Error(response.data?.message || "Login failed");
    }
    if (!response.data?.data) {
      throw new Error(response.data?.message || "Login failed");
    }
    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiEnvelope<AuthResponse>>(
      "/api/v1/auth/register",
      data,
    );
    if (!response.ok) {
      throw new Error(response.data?.message || "Registration failed");
    }
    if (!response.data?.data) {
      throw new Error(response.data?.message || "Registration failed");
    }
    return response.data.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<unknown>("/api/v1/users/me");
    if (!response.ok) {
      const message =
        typeof (response.data as { message?: unknown } | null)?.message ===
        "string"
          ? (response.data as { message: string }).message
          : "Failed to fetch user";
      throw new Error(message);
    }

    const payload = response.data;
    if (!payload) throw new Error("Failed to fetch user");

    if (typeof payload === "object" && "data" in payload) {
      const envelope = payload as { data?: unknown };
      if (envelope.data && typeof envelope.data === "object") {
        return envelope.data as User;
      }
    }

    if (typeof payload === "object") return payload as User;
    throw new Error("Failed to fetch user");
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post("/api/v1/auth/logout", { refreshToken });
  },

  refreshAccessToken: async (
    refreshToken: string,
  ): Promise<{ accessToken: string; user: User }> => {
    const response = await api.post<{ accessToken: string; user: User }>(
      "/api/v1/auth/refresh-token",
      { refreshToken },
    );
    if (!response.ok || !response.data) {
      throw new Error("Refresh token failed");
    }
    return response.data;
  },
};
