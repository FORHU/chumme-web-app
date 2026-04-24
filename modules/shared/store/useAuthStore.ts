"use client";
import { create } from "zustand";

import { setCachedAccessToken } from "@/modules/shared/api/token-cache";
import { useSnackbarStore } from "@/modules/shared/store/useSnackbarStore";
import {
  AuthResponse,
  User,
  RegisterRequest,
} from "@/modules/shared/api/api.types";
import { authService } from "@/modules/shared/api/auth.service";
import { STORAGE_KEYS } from "@/modules/shared/constants/storage-keys";
import {
  getStorageData,
  setStorageData,
  removeStorageData,
  getCookie,
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

function extractApiErrorMessage(error: unknown): string | undefined {
  if (isRecord(error)) {
    const response = error.response;
    if (isRecord(response)) {
      const data = response.data;
      if (isRecord(data) && typeof data.message === "string")
        return data.message;
      if (typeof data === "string") return data;
    }

    if (typeof error.message === "string") return error.message;
  }

  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return undefined;
}

async function persistAuth(
  response: AuthResponse,
  rememberMe: boolean,
  commit: () => void,
) {
  const type: StorageType = rememberMe ? "local" : "session";

  // Sanitize user object to ensure no sensitive data is stored
  const sanitizedUser = { ...response.user };
  // @ts-expect-error - removing potentially existing sensitive fields
  delete sanitizedUser.password;
  // @ts-expect-error - token field may not exist on User type but should be removed if present
  delete sanitizedUser.token;

  await Promise.all([
    setStorageData(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken, type),
    setStorageData(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken, type),
    setStorageData(STORAGE_KEYS.USER, sanitizedUser, type),
  ]);
  setCachedAccessToken(response.accessToken);
  commit();
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Internal actions
  initialize: () => Promise<void>;
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

export const useAuthStore = create<AuthState>((set, get) => {
  // Synchronous initialization for client-side to prevent hydration/redirect flashes
  let initialUser: User | null = null;
  let initialAuthenticated = false;
  let initialLoading = true;

  if (typeof window !== "undefined") {
    try {
      // Robust multi-source sync check
      const getUser = () => getCookie(STORAGE_KEYS.USER) || localStorage.getItem(STORAGE_KEYS.USER) || sessionStorage.getItem(STORAGE_KEYS.USER);
      const getToken = () => getCookie(STORAGE_KEYS.ACCESS_TOKEN) || localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const getRefresh = () => getCookie(STORAGE_KEYS.REFRESH_TOKEN) || localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      const userStr = getUser();
      const token = getToken();
      const refreshToken = getRefresh();

      if (userStr && (token || refreshToken)) {
        try {
          initialUser = JSON.parse(userStr);
          initialAuthenticated = true;
          initialLoading = false;
          if (token) setCachedAccessToken(token);
        } catch (e) {
          console.warn("[useAuthStore] Sync parse failed", e);
        }
      }
    } catch (e) {
      console.warn("[useAuthStore] Sync init error", e);
    }
  }

  return {
    user: initialUser,
    isLoading: initialLoading,
    isAuthenticated: initialAuthenticated,

    async initialize() {
      if (typeof window === "undefined") return;

      // Consolidate data if we found something in sync but want to ensure it's in Cookies
      if (get().isAuthenticated) {
        try {
          const user = get().user;
          const token = getCookie(STORAGE_KEYS.ACCESS_TOKEN) || localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          const refresh = getCookie(STORAGE_KEYS.REFRESH_TOKEN) || localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          
          if (user && token && refresh) {
            // Ensure they are in cookies for next time
            const isInLocal = !!localStorage.getItem(STORAGE_KEYS.USER) || !!getCookie(STORAGE_KEYS.USER);
            const storageType: StorageType = isInLocal ? "local" : "session";
            await setStorageData(STORAGE_KEYS.USER, user, storageType);
            await setStorageData(STORAGE_KEYS.ACCESS_TOKEN, token, storageType);
            await setStorageData(STORAGE_KEYS.REFRESH_TOKEN, refresh, storageType);
          }

          const freshUser = await authService.getCurrentUser();
          const sanitizedUser = { ...freshUser };
          // @ts-expect-error - removing potentially existing sensitive fields
          delete sanitizedUser.password;
          // @ts-expect-error - token field may not exist on User type but should be removed if present
          delete sanitizedUser.token;

          const isInLocal = !!localStorage.getItem(STORAGE_KEYS.USER) || !!getCookie(STORAGE_KEYS.USER);
          await setStorageData(STORAGE_KEYS.USER, sanitizedUser, isInLocal ? "local" : "session");
          set({ user: freshUser });
        } catch (e) {
          console.warn("[useAuthStore] Background user refresh failed", e);
        } finally {
          set({ isLoading: false });
        }
        return;
      }

      // If not authenticated, do a full exhaustive check
      try {
        const [storedUser, token, refreshToken] = await Promise.all([
          getStorageData<User>(STORAGE_KEYS.USER),
          getStorageData<string>(STORAGE_KEYS.ACCESS_TOKEN),
          getStorageData<string>(STORAGE_KEYS.REFRESH_TOKEN),
        ]);

        if (storedUser && (token || refreshToken)) {
          if (token) setCachedAccessToken(token);
          set({ user: storedUser, isAuthenticated: true });
          
          // Consolidation
          const isInLocal = !!localStorage.getItem(STORAGE_KEYS.USER);
          await setStorageData(STORAGE_KEYS.USER, storedUser, isInLocal ? "local" : "session");
        }
      } catch (e) {
        console.error("[useAuthStore] Initialization error", e);
      } finally {
        set({ isLoading: false });
      }
    },

    _forceLogout() {
      set({ user: null, isAuthenticated: false, isLoading: false });
      useSnackbarStore.getState().show({
        type: "info",
        title: "Session Ended",
        description: "You have been signed out. Please sign in again.",
      });
    },

    async login(email, password, rememberMe = true) {
      set({ isLoading: true });
      try {
        const response: unknown = await authService.login(email, password);

        if (isVerificationRequiredResult(response)) {
          return { requiresVerification: true, user: response.user };
        }

        if (!isAuthResponse(response)) {
          throw new Error("Invalid login response format");
        }

        await persistAuth(response, rememberMe, () =>
          set({ user: response.user, isAuthenticated: true }),
        );
        useSnackbarStore.getState().show({
          type: "success",
          title: "Signed in",
          description: `Welcome back${response.user?.displayName ? `, ${response.user.displayName}` : ""}!`,
        });
        return { success: true };
      } catch (error: unknown) {
        const message = extractApiErrorMessage(error) || "Invalid credentials";
        useSnackbarStore.getState().show({
          type: "error",
          title: "Login Failed",
          description: message,
        });
        return { error: true, message };
      } finally {
        set({ isLoading: false });
      }
    },

    async loginWithGoogle(credential, rememberMe = true) {
      set({ isLoading: true });
      try {
        const response: unknown = await authService.loginWithGoogle(credential);

        if (isVerificationRequiredResult(response)) {
          return { requiresVerification: true, user: response.user };
        }

        if (!isAuthResponse(response)) {
          throw new Error("Login failed");
        }

        await persistAuth(response, rememberMe, () =>
          set({ user: response.user, isAuthenticated: true }),
        );
        useSnackbarStore.getState().show({
          type: "success",
          title: "Signed in with Google",
          description: `Welcome back${response.user?.displayName ? `, ${response.user.displayName}` : ""}!`,
        });
        return { success: true };
      } catch (error: unknown) {
        const message = extractApiErrorMessage(error) || "Invalid credentials";
        return { error: true, message };
      } finally {
        set({ isLoading: false });
      }
    },

    async loginWithFacebook(accessToken, rememberMe = true) {
      set({ isLoading: true });
      try {
        const response: unknown = await authService.loginWithFacebook(accessToken);

        if (isVerificationRequiredResult(response)) {
          return { requiresVerification: true, user: response.user };
        }

        if (!isAuthResponse(response)) {
          throw new Error("Login failed");
        }

        await persistAuth(response, rememberMe, () =>
          set({ user: response.user, isAuthenticated: true }),
        );
        useSnackbarStore.getState().show({
          type: "success",
          title: "Signed in with Facebook",
          description: `Welcome back${response.user?.displayName ? `, ${response.user.displayName}` : ""}!`,
        });
        return { success: true };
      } catch (error: unknown) {
        const message = extractApiErrorMessage(error) || "Invalid credentials";
        return { error: true, message };
      } finally {
        set({ isLoading: false });
      }
    },

    async register(data) {
      set({ isLoading: true });
      try {
        await authService.register(data);
        useSnackbarStore.getState().show({
          type: "success",
          title: "Account Created",
          description: "Please verify your email to get started!",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    async logout() {
      set({ isLoading: true });
      try {
        const refreshToken = await getStorageData<string>(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          await authService.logout(refreshToken);
        }
      } catch (error) {
        console.warn("[useAuthStore] Logout API call failed", error);
      } finally {
        await Promise.all([
          removeStorageData(STORAGE_KEYS.ACCESS_TOKEN),
          removeStorageData(STORAGE_KEYS.REFRESH_TOKEN),
          removeStorageData(STORAGE_KEYS.USER),
        ]);
        setCachedAccessToken(null);
        set({ user: null, isAuthenticated: false, isLoading: false });
        useSnackbarStore.getState().show({
          type: "info",
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      }
    },

    updateUser(data) {
      const currentUser = get().user;
      if (currentUser) {
        const updated = { ...currentUser, ...data };
        
        // Sanitize before storage
        // @ts-expect-error - password field may not exist on User type but should be removed if present
        delete updated.password;
        // @ts-expect-error - token field may not exist on User type but should be removed if present
        delete updated.token;
        
        set({ user: updated });

        // Determine storage consistency
        const isInLocal = !!localStorage.getItem(STORAGE_KEYS.USER) || !!getCookie(STORAGE_KEYS.USER);
        const storageType: StorageType = isInLocal ? "local" : "session";
        
        void setStorageData(STORAGE_KEYS.USER, updated, storageType);
      }
    },
  };
});
