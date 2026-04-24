"use client";
import { create } from "apisauce";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

import { STORAGE_KEYS } from "@/modules/shared/constants/storage-keys";
import {
  getCachedAccessToken,
  setCachedAccessToken,
} from "@/modules/shared/api/token-cache";
import {
  getStorageData,
  setStorageData,
  removeStorageData,
} from "@/modules/shared/utils/storage";

export const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // If we have an explicit API URL in env, always use it
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  // Otherwise, determine based on environment
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return ""; // Relative URL for Vercel/proxies
  }

  return "http://localhost:3002";
};

const API_BASE_URL = getApiBaseUrl();


// setCachedAccessToken is now imported from token-cache.ts

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
    let token = getCachedAccessToken();
    if (!token && typeof window !== "undefined") {
      token = await getStorageData<string>(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) setCachedAccessToken(token);
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

      const refreshToken = await getStorageData<string>(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(
            `${API_BASE_URL}/api/v1/auth/refresh-token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken: refreshToken }),
            },
          );

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            if (data?.accessToken) {
              const isInLocal = !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
              await setStorageData(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken, isInLocal ? "local" : "session");
              setCachedAccessToken(data.accessToken);

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
      await removeStorageData(STORAGE_KEYS.ACCESS_TOKEN);
      await removeStorageData(STORAGE_KEYS.REFRESH_TOKEN);
      await removeStorageData(STORAGE_KEYS.USER);
      setCachedAccessToken(null);
      // We no longer call useAuthStore directly to avoid circular dependencies.
      // Instead, we rely on the event below.

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
