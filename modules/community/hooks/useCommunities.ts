import { useApiQuery } from "@/modules/shared/hooks/useApiQuery";
import { useApiMutation } from "@/modules/shared/hooks/useApiMutation";
import type {
  ChummeCategory,
  ChummeSubCategory,
  CreateCommunitiesCategoryParams,
  CreateSubCategoryParams,
} from "../api/communities-api";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const communitiesKeys = {
  all: ["communities"] as const,
  categories: () => [...communitiesKeys.all, "categories"] as const,
  subcategories: (categoryId: string) =>
    [...communitiesKeys.all, "subcategories", categoryId] as const,
};

// ─── View hooks ───────────────────────────────────────────────────────────────

/**
 * Fetches the communities categories list.
 * GET /api/v1/chumme-categories/communities
 *
 * @example
 * const { data, isLoading, error } = useGetCommunitiesCategories();
 */
export const useGetCommunitiesCategories = () => {
  return useApiQuery<{ data: ChummeCategory[] }>(
    [...communitiesKeys.categories()],
    "/api/v1/chumme-categories"
  );
};

/**
 * Fetches subcategories by parent category id.
 * GET /api/v1/chumme-subcategories/category/:categoryId
 *
 * @example
 * const { data } = useGetSubcategoriesByCategoryId(categoryId);
 */
export const useGetSubcategoriesByCategoryId = (
  categoryId: string,
  options?: { enabled?: boolean },
) => {
  return useApiQuery<ChummeSubCategory[]>(
    [...communitiesKeys.subcategories(categoryId)],
    `/api/v1/chumme-subcategories/category/${categoryId}`,
    { enabled: !!categoryId && (options?.enabled ?? true) },
  );
};

// ─── Mutation hooks ───────────────────────────────────────────────────────────

/**
 * Creates a new top-level community category.
 * POST /api/v1/chumme-categories/create
 *
 * @example
 * const { mutate, isPending } = useCreateCommunitiesCategory();
 * mutate({ endpoint: "/api/v1/chumme-categories/create", method: "POST", data: { name: "K-Pop" } });
 */
export const useCreateCommunitiesCategory = (
  options?: Parameters<typeof useApiMutation<ChummeCategory, Error, CreateCommunitiesCategoryParams>>[0]
) => {
  return useApiMutation<ChummeCategory, Error, CreateCommunitiesCategoryParams>(options);
};

/**
 * Creates a new subcategory inside an existing community.
 * POST /api/v1/chumme-subcategories/create
 *
 * @example
 * const { mutate, isPending } = useCreateSubCategory();
 * mutate({ endpoint: "/api/v1/chumme-subcategories/create", method: "POST", data: { name: "BTS", categoryId: "abc-123" } });
 */
export const useCreateSubCategory = (
  options?: Parameters<typeof useApiMutation<ChummeSubCategory, Error, CreateSubCategoryParams>>[0]
) => {
  return useApiMutation<ChummeSubCategory, Error, CreateSubCategoryParams>(options);
};
