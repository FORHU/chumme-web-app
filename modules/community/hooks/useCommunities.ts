import {
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

import { api } from "@/modules/shared/api/api-client";
import { useApiQuery } from "@/modules/shared/hooks/useApiQuery";

import type { ChummeCategory, ChummeSubCategory } from "../api/communities-api";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const communitiesKeys = {
  all: ["communities"] as const,
  categories: () => [...communitiesKeys.all, "categories"] as const,
  subcategories: (categoryId: string) =>
    [...communitiesKeys.all, "subcategories", categoryId] as const,
};

// ─── View hooks ───────────────────────────────────────────────────────────────

/**
 * Fetches all Communities categories (the "Countries" in the UI).
 * GET /api/v1/chumme-categories/specialized/COMMUNITIES
 * Response: { categories: ChummeCategory[] }
 */
export const useGetCommunitiesCategories = () => {
  return useApiQuery<{ categories: ChummeCategory[] }>(
    [...communitiesKeys.categories()],
    "/api/v1/chumme-categories/communities",
  );
};

/**
 * Fetches subcategories under a given Communities category.
 * GET /api/v1/chumme-subcategories/category/:categoryId
 * Response: { subCategories: ChummeSubCategory[] }
 */
export const useGetSubcategoriesByCategoryId = (
  categoryId: string,
  options?: Partial<UseQueryOptions<{ subCategories: ChummeSubCategory[] }>>,
) => {
  return useApiQuery<{ subCategories: ChummeSubCategory[] }>(
    [...communitiesKeys.subcategories(categoryId)],
    `/api/v1/chumme-subcategories/category/${categoryId}`,
    {
      enabled: !!categoryId && (options?.enabled ?? true),
      refetchInterval: 30_000,
      ...options,
    },
  );
};

// ─── Mutation hooks ───────────────────────────────────────────────────────────

/**
 * Creates a new top-level Communities category ("Add Country" in the UI).
 * POST /api/v1/chumme-categories/create
 */
export const useCreateCommunitiesCategory = (options?: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      chummeTrait?: string;
      traits?: string;
      isAd: boolean;
      [key: string]: unknown;
    }) => {
      // TODO: re-add color to payload once backend Joi schema is updated
      // Backend fix needed in: chumme-api/src/controllers/chumme-category.controller.ts
      const res = await api.post("/api/v1/chumme-categories/create", {
        name: params.name,
        chummeTrait: params.chummeTrait || params.traits || "COMMUNITIES",
        isAd: params.isAd,
      });
      if (!res.ok)
        throw new Error(
          (res.data as { message?: string })?.message || "Create failed",
        );
      return res.data as ChummeCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communitiesKeys.categories() });
      options?.onSuccess?.();
    },
  });
};

/**
 * Creates a subcategory under a Communities category ("Create Category" in the UI).
 * POST /api/v1/chumme-subcategories/create
 */
export const useCreateSubCategory = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      chummeCategoryId: string;
      isAd: boolean;
      note?: string;
      [key: string]: unknown;
    }) => {
      // TODO: re-add color to payload once backend Joi schema is updated
      // Backend fix needed in: chumme-api/src/controllers/chumme-category.controller.ts
      const res = await api.post("/api/v1/chumme-subcategories/create", {
        name: params.name,
        chummeCategoryId: params.chummeCategoryId,
        isAd: params.isAd,
        note: params.note,
      });
      if (!res.ok)
        throw new Error(
          (res.data as { message?: string })?.message || "Create failed",
        );
      return res.data as ChummeSubCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communitiesKeys.all });
      options?.onSuccess?.();
    },
  });
};
