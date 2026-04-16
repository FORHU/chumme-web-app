"use client";
import { create } from "zustand";

import { setCachedAccessToken } from "@/modules/shared/api/api-client";
import {
  AuthResponse,
  User,
  RegisterRequest,
} from "@/modules/shared/api/api.types";
import { authService } from "@/modules/shared/api/auth.service";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  USER,
} from "@/modules/shared/constants/storage-keys";
import {
  getStorageData,
  setStorageData,
  removeStorageData,
  type StorageType,
} from "@/modules/shared/utils/storage";

type VerificationRequiredResult = {
  requiresVerification: true;
  user: User;
};

type LoginResult =
  | { success: true }
  | { error: true; message: string }
  | VerificationRequiredResult;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isVerificationRequiredResult(
  value: unknown,
): value is VerificationRequiredResult {
  if (!isRecord(value)) return false;
  if (value.requiresVerification !== true) return false;
  return isRecord(value.user);
}

function isAuthResponse(value: unknown): value is AuthResponse {
  if (!isRecord(value)) return false;
  return (
    typeof value.accessToken === "string" &&
    typeof value.refreshToken === "string" &&
    isRecord(value.user)
  );
}

function extractApiErrorMessage(err: unknown): string | undefined {
  if (isRecord(err)) {
    const response = err.response;
    if (isRecord(response)) {
      const data = response.data;
      if (isRecord(data) && typeof data.message === "string")
        return data.message;
      if (typeof data === "string") return data;
    }

    if (typeof err.message === "string") return err.message;
  }

  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return undefined;
}

async function persistAuth(
  res: AuthResponse,
  rememberMe: boolean,
  commit: () => void,
) {
  const type: StorageType = rememberMe ? "local" : "session";

  console.info(`[useAuthStore] Persisting auth state. RememberMe: ${rememberMe}, Storage: ${type}`);

  // Sanitize user object to ensure no sensitive data is stored
  const sanitizedUser = { ...res.user };
  // @ts-ignore - removing potentially existing sensitive fields
  delete sanitizedUser.password;
  // @ts-ignore
  delete sanitizedUser.token;

  await Promise.all([
    setStorageData(ACCESS_TOKEN, res.accessToken, type),
    setStorageData(REFRESH_TOKEN, res.refreshToken, type),
    setStorageData(USER, sanitizedUser, type),
  ]);
  setCachedAccessToken(res.accessToken);
  commit();
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Internal actions
  _init: () => Promise<void>;
  _forceLogout: () => void;

  // Public actions
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<LoginResult>;
  loginWithGoogle: (
    credential: string,
    rememberMe?: boolean,
  ) => Promise<LoginResult>;
  loginWithFacebook: (
    accessToken: string,
    rememberMe?: boolean,
  ) => Promise<LoginResult>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  async _init() {
    if (typeof window === "undefined") return;

    try {
      const [storedUser, token] = await Promise.all([
        getStorageData<User>(USER),
        getStorageData<string>(ACCESS_TOKEN),
      ]);

      if (storedUser && token) {
        setCachedAccessToken(token);
        set({ user: storedUser, isAuthenticated: true });

        // Try to refresh user data in the background
        try {
          const freshUser = await authService.getCurrentUser();
          await setStorageData(USER, freshUser);
          set({ user: freshUser });
        } catch (e) {
          console.warn("[useAuthStore] Background user refresh failed", e);
        }
      }
    } catch (e) {
      console.error("[useAuthStore] Initialization error", e);
    } finally {
      set({ isLoading: false });
    }
  },

  _forceLogout() {
    set({ user: null, isAuthenticated: false });
  },

  async login(email, password, rememberMe = false) {
    set({ isLoading: true });
    try {
      console.info("[useAuthStore] Attempting login for:", email);
      const res: unknown = await authService.login(email, password);
      console.info("[useAuthStore] Login service response:", res);

      if (isVerificationRequiredResult(res)) {
        console.info("[useAuthStore] Verification required");
        return { requiresVerification: true, user: res.user };
      }

      if (!isAuthResponse(res)) {
        console.error("[useAuthStore] Response validation failed. Received:", res);
        throw new Error("Invalid login response format");
      }

      await persistAuth(res, rememberMe, () =>
        set({ user: res.user, isAuthenticated: true }),
      );
      console.info("[useAuthStore] Login successful, state updated");
      return { success: true };
    } catch (err: unknown) {
      console.error("[useAuthStore] Login failed:", err);
      const message = extractApiErrorMessage(err) || "Invalid credentials";
      return { error: true, message };
    } finally {
      set({ isLoading: false });
    }
  },

  async loginWithGoogle(credential, rememberMe = true) {
    set({ isLoading: true });
    try {
      const loginWithGoogle = (
        authService as unknown as {
          loginWithGoogle?: (credential: string) => Promise<unknown>;
        }
      ).loginWithGoogle;

      if (typeof loginWithGoogle !== "function") {
        throw new Error("Google login is not available");
      }

      const res: unknown = await loginWithGoogle(credential);

      if (isVerificationRequiredResult(res)) {
        return { requiresVerification: true, user: res.user };
      }

      if (!isAuthResponse(res)) {
        throw new Error("Login failed");
      }

      await persistAuth(res, rememberMe, () =>
        set({ user: res.user, isAuthenticated: true }),
      );
      return { success: true };
    } catch (err: unknown) {
      const message = extractApiErrorMessage(err) || "Invalid credentials";
      return { error: true, message };
    } finally {
      set({ isLoading: false });
    }
  },

  async loginWithFacebook(accessToken, rememberMe = true) {
    set({ isLoading: true });
    try {
      const loginWithFacebook = (
        authService as unknown as {
          loginWithFacebook?: (accessToken: string) => Promise<unknown>;
        }
      ).loginWithFacebook;

      if (typeof loginWithFacebook !== "function") {
        throw new Error("Facebook login is not available");
      }

      const res: unknown = await loginWithFacebook(accessToken);

      if (isVerificationRequiredResult(res)) {
        return { requiresVerification: true, user: res.user };
      }

      if (!isAuthResponse(res)) {
        throw new Error("Login failed");
      }

      await persistAuth(res, rememberMe, () =>
        set({ user: res.user, isAuthenticated: true }),
      );
      return { success: true };
    } catch (err: unknown) {
      const message = extractApiErrorMessage(err) || "Invalid credentials";
      return { error: true, message };
    } finally {
      set({ isLoading: false });
    }
  },

  async register(data) {
    set({ isLoading: true });
    try {
      await authService.register(data);
    } finally {
      set({ isLoading: false });
    }
  },

  async logout() {
    set({ isLoading: true });
    try {
      const rt = await getStorageData<string>(REFRESH_TOKEN);
      if (rt) {
        await authService.logout(rt);
      }
    } catch (e) {
      console.warn("[useAuthStore] Logout API call failed", e);
    } finally {
      await Promise.all([
        removeStorageData(ACCESS_TOKEN),
        removeStorageData(REFRESH_TOKEN),
        removeStorageData(USER),
      ]);
      setCachedAccessToken(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser(data) {
    const currentUser = get().user;
    if (currentUser) {
      const updated = { ...currentUser, ...data };
      
      // Sanitize before storage
      // @ts-ignore
      delete updated.password;
      
      set({ user: updated });

      // Determine where the user is currently stored to maintain consistency
      const isLocal = !!localStorage.getItem(USER);
      console.debug(`[useAuthStore] Updating user in ${isLocal ? "localStorage" : "sessionStorage"}`);
      setStorageData(USER, updated, isLocal ? "local" : "session");
    }
  },
}));
