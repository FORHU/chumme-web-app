import { api, getApiBaseUrl } from "@/modules/shared/api/api-client";
import { ACCESS_TOKEN } from "@/modules/shared/constants/storage-keys";
import { getStorageData } from "@/modules/shared/utils/storage";

export interface FileRecord {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  url: string;
  category: string;
}

/**
 * fileService handles uploads to the server and provides a fallback
 * for listing files since the backend GET endpoint is not yet implemented.
 */
export const fileService = {
  /**
   * Fetches files from the server. Currently returns empty array 
   * since the backend listing endpoint is not yet active.
   */
  getAll: async (): Promise<FileRecord[]> => {
    try {
      // We try the standard path, but ignore failures for the UI's sake
      const res = await api.get("/api/v1/files");
      if (res.ok) {
        const data = res.data as any;
        const result = data?.files ?? data?.data ?? data;
        return Array.isArray(result) ? result : [];
      }
    } catch (err) {
      // Silent fail - UI uses local cache
    }
    return [];
  },

  /**
   * Uploads a file to the server and returns a normalized record.
   */
  upload: async (file: File): Promise<FileRecord> => {
    const baseUrl = getApiBaseUrl();
    const token = await getStorageData<string>(ACCESS_TOKEN);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${baseUrl}/api/v1/files/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.message || json?.error || "Upload failed");
    }

    // Backend returns { message, file: { id, filename, fileUrl, ... } }
    const raw = json?.file ?? json?.data ?? json;
    
    const getCategory = (mime: string) => {
      if (mime?.startsWith("image/")) return "Images";
      if (mime?.includes("pdf") || mime?.includes("text")) return "Documents";
      if (mime?.includes("json") || mime?.includes("csv")) return "Data";
      return "Other";
    };

    return {
      id: raw?.id ?? `file-${Date.now()}`,
      name: raw?.filename ?? raw?.name ?? file.name,
      type: raw?.type ?? file.type,
      size: raw?.size ?? file.size,
      uploadDate: raw?.createdAt ?? raw?.uploadDate ?? new Date().toISOString(),
      url: raw?.fileUrl ?? raw?.url ?? "",
      category: raw?.category ?? getCategory(raw?.type ?? file.type),
    };
  },

  delete: async (id: string): Promise<void> => {
    // Attempt deletion but don't crash if endpoint is 404
    try {
      await api.delete(`/api/v1/files/${id}`);
    } catch (e) {
      console.warn("Server deletion failed, removing locally only.");
    }
  },

  getDownloadUrl: async (id: string): Promise<string> => {
    const res = await api.get(`/api/v1/files/download/${id}`);
    const data = res.data as any;
    // Fallback logic for various URL shapes
    return data?.url ?? data?.fileUrl ?? data?.downloadUrl ?? data;
  },
};
