import { api } from "@/modules/shared/api/api-client";
import type { Stream } from "@/modules/entertainment/types/api.types";

export const entertainmentService = {
  // ── Categories ──────────────────────────────────────────────────────────

  getEntertainmentCategories: async () => {
    const res = await api.get<{ categories: Record<string, unknown>[] }>(
      "/api/v1/chumme-categories/entertainment",
    );
    if (!res.ok) throw new Error("Failed to fetch entertainment categories");

    const rawCategories = res.data?.categories || [];

    // Map nested visual design emojiIcon to imageUrl for UI compatibility at all levels
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return rawCategories.map((cat: any) => ({
      ...cat,
      imageUrl: cat.chummeVisualDesign?.emojiIcon || cat.imageUrl,
      chummeSubCategories: cat.chummeSubCategories?.map((sub: any) => ({
        ...sub,
        imageUrl: sub.chummeVisualDesign?.emojiIcon || sub.imageUrl,
        chummeTopicCategories: sub.chummeTopicCategories?.map((topic: any) => ({
          ...topic,
          imageUrl: topic.chummeVisualDesign?.emojiIcon || topic.imageUrl,
        })),
      })),
    }));
    /* eslint-enable @typescript-eslint/no-explicit-any */
  },

  createCategory: async (data: {
    name: string;
    note?: string;
    isAd: boolean;
    chummeTrait: "ENTERTAINMENT";
  }) => {
    const res = await api.post("/api/v1/chumme-categories/create", data);

    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message ||
        "Failed to create category",
      );
    return res.data;
  },

  updateCategory: async (
    id: string,
    data: {
      name?: string;
      note?: string;
      discoveryKeywords?: string[];
    },
  ) => {
    const payload = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.note !== undefined && { note: data.note }),
      ...(data.discoveryKeywords !== undefined && {
        discoveryKeywords: data.discoveryKeywords,
      }),
    };
    const res = await api.put(`/api/v1/chumme-categories/${id}`, payload);
    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message ||
        "Failed to update category",
      );
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res = await api.delete(`/api/v1/chumme-categories/${id}`);

    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message ||
        "Failed to delete category",
      );
    return res.data;
  },

  // ── Subcategories ────────────────────────────────────────────────────────

  createSubCategory: async (data: {
    name: string;
    chummeCategoryId: string;
    note?: string;
    isAd: boolean;
  }) => {
    const res = await api.post("/api/v1/chumme-subcategories/create", data);

    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message ||
        "Failed to create subcategory",
      );
    return res.data;
  },

  updateSubCategory: async (
    id: string,
    data: {
      name?: string;
      note?: string;
      discoveryKeywords?: string[];
    },
  ) => {
    const payload = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.note !== undefined && { note: data.note }),
      ...(data.discoveryKeywords !== undefined && {
        discoveryKeywords: data.discoveryKeywords,
      }),
    };
    const res = await api.put(`/api/v1/chumme-subcategories/${id}`, payload);
    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message ||
        "Failed to update subcategory",
      );
    return res.data;
  },

  deleteSubCategory: async (id: string) => {
    const res = await api.delete(`/api/v1/chumme-subcategories/${id}`);

    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message ||
        "Failed to delete subcategory",
      );
    return res.data;
  },

  // ── Topic Categories ─────────────────────────────────────────────────────

  createTopicCategory: async (data: {
    name: string;
    chummeSubCategoryId: string;
    note?: string;
    isAd: boolean;
    imageUrl?: string;
  }) => {
    const payload = {
      name: data.name,
      chummeSubCategoryId: data.chummeSubCategoryId,
      note: data.note,
      isAd: data.isAd,
      emojiIcon: data.imageUrl,
    };
    const res = await api.post("/api/v1/chumme-topic-categories", payload);

    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message || "Failed to create topic",
      );
    return res.data;
  },

  updateTopicCategory: async (
    id: string,
    data: { name?: string; note?: string; imageUrl?: string },
  ) => {
    const payload = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.note !== undefined && { note: data.note }),
      ...(data.imageUrl !== undefined && { emojiIcon: data.imageUrl }),
    };

    const res = await api.patch(`/api/v1/chumme-topic-categories/${id}`, payload);

    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message || "Failed to update topic",
      );
    return res.data;
  },

  deleteTopicCategory: async (id: string) => {
    const res = await api.delete(`/api/v1/chumme-topic-categories/${id}`);

    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message || "Failed to delete topic",
      );
    return res.data;
  },

  // ── Streams ──────────────────────────────────────────────────────────────

  getLiveStreams: async (): Promise<Stream[]> => {
    const res = await api.get<{ data?: Stream[]; artists?: Stream[]; streams?: Stream[] }>(
      "/api/v1/artists/live",
    );
    if (!res.ok) throw new Error("Failed to fetch live streams");

    // Support multiple formats: direct array, { data: [] }, or { artists: [] }
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.artists && Array.isArray(data.artists)) return data.artists;
    if (data?.streams && Array.isArray(data.streams)) return data.streams;

    return [];
  },

  updateStreamAction: async (artistId: string, action: "start" | "stop" | "pause") => {
    // There is no dedicated /action endpoint; we update the artist's isLive status instead.
    const res = await api.put(`/api/v1/artists/${artistId}`, {
      isLive: action === "start",
    });
    if (!res.ok)
      throw new Error(
        (res.data as { message?: string })?.message ||
        `Failed to ${action} stream`,
      );
    return res.data;
  },
};
