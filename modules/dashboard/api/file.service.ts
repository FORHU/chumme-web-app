import { apiClient } from "@/modules/shared/api/api-client";

export interface FileRecord {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  url: string;
  category: string;
}

export const fileService = {
  getAll: async (): Promise<FileRecord[]> => {
    const res = await apiClient.get("/api/v1/files");
    const data = res.data as any;
    return data?.files ?? data?.data ?? data ?? [];
  },

  upload: async (file: File): Promise<FileRecord> => {
    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/files/upload`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
    const json = await res.json();
    return json?.file ?? json?.data ?? json;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/files/${id}`);
  },

  getDownloadUrl: async (id: string): Promise<string> => {
    const res = await apiClient.get(`/api/v1/files/download/${id}`);
    const data = res.data as any;
    return data?.url ?? data?.downloadUrl ?? data;
  },
};
