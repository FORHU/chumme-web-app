import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  ChummeCategory,
  ChummeSubCategory,
} from "@/modules/community/api/communities-api";
import {
  communitiesKeys,
  useCreateCommunitiesCategory,
  useCreateSubCategory,
  useGetSubcategoriesByCategoryId,
} from "@/modules/community/hooks/useCommunities";
import { api } from "@/modules/shared/api/api-client";
import { useApiQuery } from "@/modules/shared/hooks/useApiQuery";

export {
  communitiesKeys,
  useCreateCommunitiesCategory,
  useCreateSubCategory,
  useGetSubcategoriesByCategoryId,
};

export const useGetCommunitiesCategories = () => {
  return useApiQuery<{ categories: ChummeCategory[] }>(
    [...communitiesKeys.categories()],
    "/api/v1/chumme-categories/communities",
  );
};

export const useDeleteCommunitiesCategory = (options?: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await api.delete(`/api/v1/chumme-categories/${id}`);
      if (!res.ok)
        throw new Error(
          (res.data as { message?: string })?.message || "Delete failed",
        );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communitiesKeys.categories() });
      options?.onSuccess?.();
    },
  });
};

export const useUpdateCommunitiesCategory = (options?: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      name: string;
      [key: string]: unknown;
    }) => {
      // TODO: re-add color to payload once backend Joi schema is updated
      // Backend fix needed in: chumme-api/src/controllers/chumme-category.controller.ts
      const payload: Record<string, unknown> = { name: params.name };
      if (params.color) {
        payload.colorSet = { primary: params.color };
      }
      const res = await api.put(
        `/api/v1/chumme-categories/${params.id}`,
        payload,
      );
      if (!res.ok)
        throw new Error(
          (res.data as { message?: string })?.message || "Update failed",
        );
      return res.data as ChummeCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communitiesKeys.categories() });
      options?.onSuccess?.();
    },
  });
};

export const useDeleteSubCategory = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await api.delete(`/api/v1/chumme-subcategories/${id}`);
      if (!res.ok)
        throw new Error(
          (res.data as { message?: string })?.message || "Delete failed",
        );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communitiesKeys.all });
      options?.onSuccess?.();
    },
  });
};

export const useUpdateSubCategory = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      name: string;
      [key: string]: unknown;
    }) => {
      // TODO: re-add color to payload once backend Joi schema is updated
      // Backend fix needed in: chumme-api/src/controllers/chumme-category.controller.ts
      const payload: Record<string, unknown> = { name: params.name };
      if (params.color) {
        payload.colorSet = { primary: params.color };
      }
      const res = await api.put(
        `/api/v1/chumme-subcategories/${params.id}`,
        payload,
      );
      if (!res.ok)
        throw new Error(
          (res.data as { message?: string })?.message || "Update failed",
        );
      return res.data as ChummeSubCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communitiesKeys.all });
      options?.onSuccess?.();
    },
  });
};
