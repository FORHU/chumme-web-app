import { api } from "@/modules/shared/api/api-client";

export const entertainmentService = {
  // ── Categories ──────────────────────────────────────────────────────────

  getEntertainmentCategories: async () => {
    const res = await api.get<{ categories: unknown[] }>(
      "/api/v1/chumme-categories/entertainment",
    );
    if (!res.ok) throw new Error("Failed to fetch entertainment categories");
    return res.data!.categories;
  },

  createCategory: async (data: {
    name: string;
    note?: string;
    isAd: boolean;
    chummeTrait: "ENTERTAINMENT";
  }) => {
    const res = await api.post("/api/v1/chumme-categories/create", data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!res.ok)
      throw new Error(
        (res.data as any)?.message || "Failed to create category",
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
        (res.data as any)?.message || "Failed to update category",
      );
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res = await api.delete(`/api/v1/chumme-categories/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!res.ok)
      throw new Error(
        (res.data as any)?.message || "Failed to delete category",
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!res.ok)
      throw new Error(
        (res.data as any)?.message || "Failed to create subcategory",
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
        (res.data as any)?.message || "Failed to update subcategory",
      );
    return res.data;
  },

  deleteSubCategory: async (id: string) => {
    const res = await api.delete(`/api/v1/chumme-subcategories/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!res.ok)
      throw new Error(
        (res.data as any)?.message || "Failed to delete subcategory",
      );
    return res.data;
  },

  // ── Topic Categories ─────────────────────────────────────────────────────

  createTopicCategory: async (data: {
    name: string;
    chummeSubCategoryId: string;
    note?: string;
    isAd: boolean;
  }) => {
    const res = await api.post("/api/v1/chumme-topic-categories", data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!res.ok)
      throw new Error((res.data as any)?.message || "Failed to create topic");
    return res.data;
  },

  updateTopicCategory: async (
    id: string,
    data: { name?: string; note?: string },
  ) => {
    const res = await api.patch(`/api/v1/chumme-topic-categories/${id}`, data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!res.ok)
      throw new Error((res.data as any)?.message || "Failed to update topic");
    return res.data;
  },

  deleteTopicCategory: async (id: string) => {
    const res = await api.delete(`/api/v1/chumme-topic-categories/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!res.ok)
      throw new Error((res.data as any)?.message || "Failed to delete topic");
    return res.data;
  },
};
