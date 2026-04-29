import { api } from "@/modules/shared/api/api-client";

export interface OnboardingContent {
  id: string;
  key: string;
  url: string;
  type: "video" | "image";
  title?: string;
  description?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const onboardingService = {
  // Fetch all system assets — GET /api/v1/system-assets
  getAll: async (): Promise<OnboardingContent[]> => {
    const response = await api.get("/api/v1/system-assets");
    if (response.ok) {
      const data = response.data as any;
      const assets = data?.assets ?? data?.data ?? (Array.isArray(data) ? data : []);
      // Filter out soft-deleted assets
      return assets.filter((a: OnboardingContent) => !a.isDeleted);
    }
    console.error("[Onboarding] getAll error:", response.problem, response.status);
    return [];
  },

  // Upload file via multipart — POST /api/v1/system-assets/upload
  // Backend upserts by key so this works for both create and replace
  upload: async ({
    file,
    key,
    type,
    title,
    description,
  }: {
    file: File;
    key: string;
    type: string;
    title?: string;
    description?: string;
  }): Promise<OnboardingContent> => {
    const formData = new FormData();
    formData.append("key", key);
    formData.append("type", type);
    formData.append("file", file);
    if (title) formData.append("title", title);
    if (description) formData.append("description", description);

    // Use native fetch for multipart — apisauce can interfere with FormData boundaries
    const token = localStorage.getItem("access_token");
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

    const res = await fetch(`${baseUrl}/api/v1/system-assets/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message ?? "Upload failed");
    return json?.asset ?? json?.data ?? json;
  },

  // Update metadata only — PATCH /api/v1/system-assets/:id
  // Key is intentionally never sent — it must not change
  update: async ({
    id,
    type,
    title,
    description,
    url,
  }: {
    id: string;
    key?: string; // received but ignored — key is immutable
    type?: string;
    title?: string;
    description?: string;
    url?: string;
  }): Promise<OnboardingContent> => {
    const payload: Record<string, any> = {};
    if (type !== undefined) payload.type = type;
    if (title !== undefined) payload.title = title;
    if (description !== undefined) payload.description = description;
    if (url !== undefined) payload.url = url;

    const response = await api.patch(`/api/v1/system-assets/${id}`, payload);

    if (response.ok) {
      const data = response.data as any;
      return data?.asset ?? data?.data ?? data;
    }

    console.error("[Onboarding] update error:", response.problem, response.status, response.data);
    throw new Error((response.data as any)?.message ?? "Update failed");
  },

  // Delete asset — DELETE /api/v1/system-assets/:id
  delete: async (id: string): Promise<void> => {
    const response = await api.delete(`/api/v1/system-assets/${id}`);

    if (!response.ok) {
      console.error("[Onboarding] delete error:", response.problem, response.status);
      throw new Error((response.data as any)?.message ?? "Delete failed");
    }
  },
};