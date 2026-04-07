"use client";
import { create } from "apisauce";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  USER,
} from "@/modules/shared/constants/storage-keys";
import { useAuthStore } from "@/modules/shared/store/useAuthStore";
import {
  getStorageData,
  setStorageData,
  removeStorageData,
} from "@/modules/shared/utils/storage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

// In-memory token cache to avoid hitting localStorage on every request
let _cachedAccessToken: string | null = null;

export const setCachedAccessToken = (token: string | null) => {
  _cachedAccessToken = token;
};

export const api = create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor — attach auth token
api.axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!_cachedAccessToken && typeof window !== "undefined") {
      _cachedAccessToken = await getStorageData<string>(ACCESS_TOKEN);
    }
    if (_cachedAccessToken) {
      config.headers.Authorization = `Bearer ${_cachedAccessToken}`;
    }
    return config;
  },
);

// Response interceptor — handle 401 with token refresh
api.axiosInstance.interceptors.response.use(
  (response) => response,
  async (
    error: AxiosError & {
      config?: InternalAxiosRequestConfig & { _retry?: boolean };
    },
  ) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const rt = await getStorageData<string>(REFRESH_TOKEN);
      if (rt) {
        try {
          const refreshRes = await fetch(
            `${API_BASE_URL}/api/v1/auth/refresh-token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken: rt }),
            },
          );

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            if (data?.accessToken) {
              await setStorageData(ACCESS_TOKEN, data.accessToken);
              _cachedAccessToken = data.accessToken;

              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
              return api.axiosInstance(originalRequest);
            }
          }
        } catch (refreshError) {
          console.warn(
            "[api-client] Token refresh network error:",
            refreshError,
          );
        }
      }

      // Both tokens invalid — cleanup and potentially redirect
      console.warn("[api-client] Token refresh failed. Cleaning up session.");
      await removeStorageData(ACCESS_TOKEN);
      await removeStorageData(REFRESH_TOKEN);
      await removeStorageData(USER);
      _cachedAccessToken = null;
      useAuthStore.getState()._forceLogout();

      // Dispatch a custom event for the UI to respond to if needed
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("unauthorized"));
      }
    }

    return Promise.reject(error);
  },
);

api.addMonitor((response) => {
  if (process.env.NODE_ENV === "development") {
    console.warn(`API Call: ${response.config?.url} [${response.status}]`);
  }
});
