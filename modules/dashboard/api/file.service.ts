import { api, getApiBaseUrl } from "@/modules/shared/api/api-client";
import { STORAGE_KEYS } from "@/modules/shared/constants/storage-keys";
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
type RawFileResponse = Record<string, unknown>;

const normalizeFile = (raw: RawFileResponse, fallbackFile?: File): FileRecord => {
  const getCategory = (mime: string) => {
    if (mime?.startsWith("image/")) return "Images";
    if (mime?.includes("pdf") || mime?.includes("text")) return "Documents";
    if (mime?.includes("json") || mime?.includes("csv")) return "Data";
    return "Other";
  };

  let name = (raw?.filename ?? raw?.name ?? fallbackFile?.name ?? "Untitled") as string;

  // If name is too short (1 or 2 letters), complete it
  if (name.length > 0 && name.length < 3) {
    const extension = (raw?.type as string)?.split("/")[1] || "file";
    name = `${name} (File).${extension}`;
  }

  let url = (raw?.fileUrl ?? raw?.url ?? "") as string;
  if (url && url.startsWith("/")) {
    url = `${getApiBaseUrl()}${url}`;
  }

  return {
    id: (raw?.id ?? `file-${Date.now()}`) as string,
    name,
    type: (raw?.type ?? fallbackFile?.type ?? "application/octet-stream") as string,
    size: (raw?.size ?? fallbackFile?.size ?? 0) as number,
    uploadDate: (raw?.createdAt ?? raw?.uploadDate ?? new Date().toISOString()) as string,
    url,
    category: (raw?.category ?? getCategory((raw?.type ?? fallbackFile?.type ?? "") as string)) as string,
  };
};

/**
 * fileService handles uploads to the server and provides a fallback
 * for listing files since the backend GET endpoint is not yet implemented.
 */
export const fileService = {
  /**
   * Fetches files from the server.
   */
  getAll: async (): Promise<FileRecord[]> => {
    try {
      const response = await api.get("/api/v1/files");
      if (response.ok) {
        const data = response.data as RawFileResponse;
        const rawFiles = (data?.files ?? data?.data ?? data) as RawFileResponse[];
        if (Array.isArray(rawFiles)) {
          return rawFiles.map((f: RawFileResponse) => normalizeFile(f));
        }
      }
    } catch (_error) {
      // Silent fail - UI uses local cache
    }
    return [];
  },

  /**
   * Uploads a file to the server and returns a normalized record.
   */
  upload: async (file: File): Promise<FileRecord> => {
    const baseUrl = getApiBaseUrl();
    const token = await getStorageData<string>(STORAGE_KEYS.ACCESS_TOKEN);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${baseUrl}/api/v1/files/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const jsonResponse = await response.json();
    if (!response.ok) {
      throw new Error(jsonResponse?.message || jsonResponse?.error || "Upload failed");
    }

    const raw = (jsonResponse?.file ?? jsonResponse?.data ?? jsonResponse) as RawFileResponse;
    return normalizeFile(raw, file);
  },

  delete: async (id: string): Promise<void> => {
    // Attempt deletion but don't crash if endpoint is 404
    try {
      await api.delete(`/api/v1/files/${id}`);
    } catch (_error) {
      console.warn("Server deletion failed, removing locally only.");
    }
  },

  getDownloadUrl: async (id: string): Promise<string> => {
    const response = await api.get(`/api/v1/files/download/${id}`);
    const data = response.data as Record<string, unknown>;
    // Fallback logic for various URL shapes
    let downloadUrl = (data?.url ?? data?.fileUrl ?? data?.downloadUrl ?? data) as string;
    
    if (downloadUrl && typeof downloadUrl === 'string' && downloadUrl.startsWith("/")) {
      downloadUrl = `${getApiBaseUrl()}${downloadUrl}`;
    }
    
    return downloadUrl;
  },
};
