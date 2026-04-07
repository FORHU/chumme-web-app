import { api } from "@/modules/shared/api/api-client";

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
    const res = await api.get<any>("/api/v1/apk");
    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message ||
          "Failed to fetch APK releases",
      );
    const data = res.data;
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
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";
    // Token is stored under "access_token" (see modules/shared/constants/storage-keys.ts)
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    const response = await fetch(`${baseUrl}/api/v1/apk/upload`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Do NOT set Content-Type — browser sets it automatically with boundary
      },
      body: formData,
    });

    const json = await response.json();

    if (!response.ok) {
      // Log full backend error for debugging
      console.error("APK upload 400 details:", JSON.stringify(json, null, 2));
      throw new Error(
        json?.message || json?.error || json?.details || "Upload failed",
      );
    }

    return json?.data ?? json;
  },

  update: async (
    id: string,
    meta: Partial<APKUploadMeta>,
  ): Promise<APKRelease> => {
    const res = await api.put<{ data: APKRelease }>(`/api/v1/apk/${id}`, meta);
    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message || "Update failed",
      );
    return (res.data as { data: APKRelease }).data;
  },

  setLatest: async (id: string): Promise<APKRelease> => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(`${baseUrl}/api/v1/apk/${id}/set-latest`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({}),
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || "Failed to set latest");
    return json?.data ?? json;
  },

  setStable: async (id: string): Promise<APKRelease> => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(`${baseUrl}/api/v1/apk/${id}/set-stable`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({}),
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json?.message || "Failed to set stable");
    return json?.data ?? json;
  },

  getDownloadUrl: async (id: string): Promise<string> => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(`${baseUrl}/api/v1/apk/download/${id}`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const json = await response.json();
    if (!response.ok)
      throw new Error(json?.message || "Failed to get download URL");

    // Handle all possible response shapes
    const url =
      json?.url ??
      json?.data?.url ??
      json?.downloadUrl ??
      json?.data?.downloadUrl ??
      json?.presignedUrl ??
      json?.data?.presignedUrl ??
      null;

    if (!url) throw new Error("Download URL not found in response");
    return url;
  },

  remove: async (id: string): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await api.delete<any>(`/api/v1/apk/${id}`);
    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message || "Delete failed",
      );
  },
};
