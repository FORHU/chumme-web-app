import { useApiQuery } from "@/modules/shared/hooks/useApiQuery";
import { useApiMutation } from "@/modules/shared/hooks/useApiMutation";
import type {
  ChummeCategory,
  ChummeSubCategory,
  UpdateCommunitiesCategoryParams,
  UpdateSubCategoryParams,
} from "@/modules/community/api/communities-api";
import {
  communitiesKeys,
  useCreateCommunitiesCategory,
  useCreateSubCategory,
  useGetSubcategoriesByCategoryId,
} from "@/modules/community/hooks/useCommunities";

export {
  communitiesKeys,
  useCreateCommunitiesCategory,
  useCreateSubCategory,
  useGetSubcategoriesByCategoryId,
};

export const useGetCommunitiesCategories = () => {
  return useApiQuery<{ categories: ChummeCategory[] }>(
    [...communitiesKeys.categories()],
    "/api/v1/chumme-categories/COMMUNITIES"
  );
};

export const useDeleteCommunitiesCategory = (
  options?: Parameters<
    typeof useApiMutation<{ message: string }, Error, { id: string }>
  >[0]
) => {
  return useApiMutation<{ message: string }, Error, { id: string }>(options);
};

export const useUpdateCommunitiesCategory = (
  options?: Parameters<
    typeof useApiMutation<
      ChummeCategory,
      Error,
      UpdateCommunitiesCategoryParams & { id: string }
    >
  >[0]
) => {
  return useApiMutation<
    ChummeCategory,
    Error,
    UpdateCommunitiesCategoryParams & { id: string }
  >(options);
};

export const useDeleteSubCategory = (
  options?: Parameters<
    typeof useApiMutation<{ message: string }, Error, { id: string }>
  >[0]
) => {
  return useApiMutation<{ message: string }, Error, { id: string }>(options);
};

export const useUpdateSubCategory = (
  options?: Parameters<
    typeof useApiMutation<
      ChummeSubCategory,
      Error,
      UpdateSubCategoryParams & { id: string }
    >
  >[0]
) => {
  return useApiMutation<
    ChummeSubCategory,
    Error,
    UpdateSubCategoryParams & { id: string }
  >(options);
};
