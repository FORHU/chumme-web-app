const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
const getToken = () => localStorage.getItem("access_token");

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
  // Fetch all system assets
  getAll: async (): Promise<OnboardingContent[]> => {
    console.log("[Onboarding] getAll → GET", `${BASE_URL}/api/v1/system-assets`);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/system-assets`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log("[Onboarding] getAll ← status:", res.status);
      if (!res.ok) return [];
      const json = await res.json();
      console.log("[Onboarding] getAll response:", json);
      const assets = json?.assets ?? json?.data ?? (Array.isArray(json) ? json : []);
      // Filter out deleted assets
      return assets.filter((a: OnboardingContent) => !a.isDeleted);
    } catch (err) {
      console.error("[Onboarding] getAll exception:", err);
      return [];
    }
  },

  // Upload file — always uses multipart upload endpoint
  // Backend upserts by key so this works for both create and update
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
    console.log("[Onboarding] upload → POST", `${BASE_URL}/api/v1/system-assets/upload`);
    console.log("[Onboarding] upload fields:", { key, type, title, description });
    console.log("[Onboarding] file:", file.name, file.type, `${(file.size / 1024 / 1024).toFixed(2)}MB`);

    const formData = new FormData();
    formData.append("key", key);
    formData.append("type", type);
    formData.append("file", file);
    if (title) formData.append("title", title);
    if (description) formData.append("description", description);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/system-assets/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      console.log("[Onboarding] upload ← status:", res.status);
      const text = await res.text();
      console.log("[Onboarding] upload raw response:", text);

      const json = JSON.parse(text);
      if (!res.ok) throw new Error(json?.message ?? "Upload failed");
      return json?.asset ?? json?.data ?? json;
    } catch (err) {
      console.error("[Onboarding] upload exception:", err);
      throw err;
    }
  },

  // Update existing asset by ID — rename key, url, type, title, description
  update: async ({
    id,
    type,
    title,
    description,
    url,
  }: {
    id: string;
    key?: string; // accepted but NOT sent to backend — key is immutable
    type?: string;
    title?: string;
    description?: string;
    url?: string;
  }): Promise<OnboardingContent> => {
    // Never include key in PATCH — it must not change
    const payload: Record<string, any> = {};
    if (type !== undefined) payload.type = type;
    if (title !== undefined) payload.title = title;
    if (description !== undefined) payload.description = description;
    if (url !== undefined) payload.url = url;

    console.log("[Onboarding] update → PATCH", `${BASE_URL}/api/v1/system-assets/${id}`);
    console.log("[Onboarding] update payload (no key):", payload);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/system-assets/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log("[Onboarding] update ← status:", res.status);
      const text = await res.text();
      console.log("[Onboarding] update raw response:", text);
      const json = JSON.parse(text);
      if (!res.ok) throw new Error(json?.message ?? "Update failed");
      return json?.asset ?? json?.data ?? json;
    } catch (err) {
      console.error("[Onboarding] update exception:", err);
      throw err;
    }
  },

  // Delete asset by ID
  delete: async (id: string): Promise<void> => {
    console.log("[Onboarding] delete → DELETE", `${BASE_URL}/api/v1/system-assets/${id}`);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/system-assets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log("[Onboarding] delete ← status:", res.status);
      if (!res.ok) {
        const text = await res.text();
        console.error("[Onboarding] delete failed:", text);
        throw new Error("Delete failed");
      }
      console.log("[Onboarding] delete success");
    } catch (err) {
      console.error("[Onboarding] delete exception:", err);
      throw err;
    }
  },
};