import { api } from "@/modules/shared/api/api-client";
import type {
  AuthResponse,
  RegisterRequest,
  User,
} from "@/modules/shared/api/api.types";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<Record<string, unknown>>("/api/v1/auth/login", {
      email,
      password,
    });

    if (!response.ok) {
      throw new Error((response.data?.message as string) || response.problem || "Login failed");
    }

    const payload = response.data as {
      data?: { accessToken?: string; requiresVerification?: boolean };
      accessToken?: string;
      requiresVerification?: boolean;
    };
    if (!payload) throw new Error("No response data from server");

    // Handle both { data: { ... } } and { ... } formats
    if (payload.data && typeof payload.data === "object" && "accessToken" in payload.data) {
      return payload.data as unknown as AuthResponse;
    }
    
    if (typeof payload === "object" && "accessToken" in payload) {
      return payload as unknown as AuthResponse;
    }

    // Handle verification required case which might be passed through
    if (payload.data?.requiresVerification || payload.requiresVerification) {
      return (payload.data || payload) as unknown as AuthResponse;
    }

    throw new Error("Invalid response format from server");
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<Record<string, unknown>>("/api/v1/auth/register", data);

    if (!response.ok) {
      throw new Error((response.data?.message as string) || response.problem || "Registration failed");
    }

    const payload = response.data as {
      data?: { accessToken?: string; requiresVerification?: boolean };
      accessToken?: string;
      requiresVerification?: boolean;
    };
    if (!payload) throw new Error("No response data from server");

    if (payload.data && typeof payload.data === "object") {
      return payload.data as unknown as AuthResponse;
    }
    
    return payload as unknown as AuthResponse;
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
        return envelope.data as unknown as User;
      }
    }
    
    if (typeof payload === "object") return payload as unknown as User;
    throw new Error("Failed to fetch user");
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post("/api/v1/auth/logout", { refreshToken });
  },

  loginWithGoogle: async (credential: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/v1/auth/google", {
      credential,
    });
    if (!response.ok || !response.data) {
      throw new Error("Google login failed");
    }
    return response.data;
  },

  loginWithFacebook: async (accessToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/v1/auth/facebook", {
      accessToken,
    });
    if (!response.ok || !response.data) {
      throw new Error("Facebook login failed");
    }
    return response.data;
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
