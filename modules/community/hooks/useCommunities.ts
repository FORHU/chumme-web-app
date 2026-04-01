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
 * Fetches all Communities categories (the "Countries" in the UI).
 * GET /api/v1/chumme-categories/specialized/COMMUNITIES
 * Response: { categories: ChummeCategory[] }
 */
export const useGetCommunitiesCategories = () => {
  return useApiQuery<{ categories: ChummeCategory[] }>(
    [...communitiesKeys.categories()],
    "/api/v1/chumme-categories/communities"
  );
};

/**
 * Fetches subcategories under a given Communities category.
 * GET /api/v1/chumme-subcategories/category/:categoryId
 * Response: { subCategories: ChummeSubCategory[] }
 */
export const useGetSubcategoriesByCategoryId = (
  categoryId: string,
  options?: { enabled?: boolean }
) => {
  return useApiQuery<{ subCategories: ChummeSubCategory[] }>(
    [...communitiesKeys.subcategories(categoryId)],
    `/api/v1/chumme-subcategories/category/${categoryId}`,
    { enabled: !!categoryId && (options?.enabled ?? true) }
  );
};

// ─── Mutation hooks ───────────────────────────────────────────────────────────

/**
 * Creates a new top-level Communities category ("Add Country" in the UI).
 * POST /api/v1/chumme-categories/create
 */
export const useCreateCommunitiesCategory = (
  options?: Parameters<
    typeof useApiMutation<ChummeCategory, Error, CreateCommunitiesCategoryParams>
  >[0]
) => {
  return useApiMutation<ChummeCategory, Error, CreateCommunitiesCategoryParams>(
    options
  );
};

/**
 * Creates a subcategory under a Communities category ("Create Category" in the UI).
 * POST /api/v1/chumme-subcategories/create
 */
export const useCreateSubCategory = (
  options?: Parameters<
    typeof useApiMutation<ChummeSubCategory, Error, CreateSubCategoryParams>
  >[0]
) => {
  return useApiMutation<ChummeSubCategory, Error, CreateSubCategoryParams>(
    options
  );
};