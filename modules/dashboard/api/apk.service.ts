import { api, getApiBaseUrl } from "@/modules/shared/api/api-client";
import { STORAGE_KEYS } from "@/modules/shared/constants/storage-keys";
import { getStorageData } from "@/modules/shared/utils/storage";

export interface APKRelease {
  id: string;
  versionName: string;
  buildNumber: number | string;
  fileUrl?: string;
  fileSize?: number | string;
  whatIsNew?: string[];
  isLatest: boolean;
  isStable: boolean;
  downloadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface APKListResponse {
  data: APKRelease[];
}

export interface APKUploadMeta {
  versionName: string;
  versionCode: string;
  releaseNotes?: string;
}

export const apkService = {
  getAll: async (): Promise<APKRelease[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.get<any>("/api/v1/apk");
    if (!response.ok)
      throw new Error(
        (response.data as { message?: string })?.message ||
          "Failed to fetch APK releases",
      );
    const data = response.data;
    const releases = Array.isArray(data?.releases)
      ? data.releases
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

    return releases as APKRelease[];
  },

  upload: async (file: File, meta: APKUploadMeta): Promise<APKRelease> => {
    const formData = new FormData();
    formData.append("apk", file); // field name must be "apk"
    formData.append("versionName", meta.versionName);
    formData.append("buildNumber", String(meta.versionCode));
    if (meta.releaseNotes?.trim()) {
      formData.append("releaseNotes", meta.releaseNotes);
    }

    // Use fetch directly — apisauce can strip Content-Type boundary on FormData
    const baseUrl = getApiBaseUrl();

    const token = await getStorageData<string>(STORAGE_KEYS.ACCESS_TOKEN);


    const response = await fetch(`${baseUrl}/api/v1/apk/upload`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Do NOT set Content-Type — browser sets it automatically with boundary
      },
      body: formData,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      // Log full backend error for debugging
      console.error("APK upload 400 details:", JSON.stringify(jsonResponse, null, 2));
      throw new Error(
        jsonResponse?.message || jsonResponse?.error || jsonResponse?.details || "Upload failed",
      );
    }

    return jsonResponse?.data ?? jsonResponse;
  },

  update: async (
    id: string,
    meta: Partial<APKUploadMeta>,
  ): Promise<APKRelease> => {
    const response = await api.put<{ data: APKRelease }>(`/api/v1/apk/${id}`, meta);
    if (!response.ok)
      throw new Error(
        (response.data as { message?: string })?.message || "Update failed",
      );
    return (response.data as { data: APKRelease }).data;
  },

  setLatest: async (id: string): Promise<APKRelease> => {
    const baseUrl = getApiBaseUrl();

    const token = await getStorageData<string>(STORAGE_KEYS.ACCESS_TOKEN);


    const response = await fetch(`${baseUrl}/api/v1/apk/${id}/set-latest`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({}),
    });

    const jsonResponse = await response.json();
    if (!response.ok) throw new Error(jsonResponse?.message || "Failed to set latest");
    return jsonResponse?.data ?? jsonResponse;
  },

  setStable: async (id: string): Promise<APKRelease> => {
    const baseUrl = getApiBaseUrl();

    const token = await getStorageData<string>(STORAGE_KEYS.ACCESS_TOKEN);


    const response = await fetch(`${baseUrl}/api/v1/apk/${id}/set-stable`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({}),
    });

    const jsonResponse = await response.json();
    if (!response.ok) throw new Error(jsonResponse?.message || "Failed to set stable");
    return jsonResponse?.data ?? jsonResponse;
  },

  getDownloadUrl: async (id: string): Promise<string> => {
    const baseUrl = getApiBaseUrl();

    const token = await getStorageData<string>(STORAGE_KEYS.ACCESS_TOKEN);


    const response = await fetch(`${baseUrl}/api/v1/apk/download/${id}`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const jsonResponse = await response.json();
    if (!response.ok)
      throw new Error(jsonResponse?.message || "Failed to get download URL");

    // Handle all possible response shapes
    const url =
      jsonResponse?.url ??
      jsonResponse?.data?.url ??
      jsonResponse?.downloadUrl ??
      jsonResponse?.data?.downloadUrl ??
      jsonResponse?.presignedUrl ??
      jsonResponse?.data?.presignedUrl ??
      null;

    if (!url) throw new Error("Download URL not found in response");
    return url;
  },

  remove: async (id: string): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.delete<any>(`/api/v1/apk/${id}`);
    if (!response.ok)
      throw new Error(
        (response.data as { message?: string })?.message || "Delete failed",
      );
  },
};
