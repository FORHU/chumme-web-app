import { api } from "@/modules/shared/api/api-client";
import { ApiResponse } from "apisauce";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChummeTraits = "NONE" | "COMMUNITIES" | "ENTERTAINMENT";

export interface ChummeCategory {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  chummeTraits: ChummeTraits;
  createdAt: string;
  updatedAt: string;
}

export interface ChummeSubCategory {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunitiesCategoryParams {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface CreateSubCategoryParams {
  name: string;
  description?: string;
  imageUrl?: string;
  categoryId: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const communitiesApi = {
  /**
   * GET /api/v1/chumme-categories/communities
   * Fetches the communities categories list.
   */
  getCommunitiesCategories: (): Promise<ApiResponse<ChummeCategory[]>> =>
    api.get("/api/v1/chumme-categories/specialized/COMMUNITIES"),

  /**
   * GET /api/v1/chumme-subcategories/category/:categoryId
   * Fetch subcategories by parent category id.
   */
  getSubcategoriesByCategoryId: (
    categoryId: string,
  ): Promise<ApiResponse<ChummeSubCategory[]>> =>
    api.get(`/api/v1/chumme-subcategories/category/${categoryId}`),

  /**
   * POST /api/v1/chumme-categories/create
   * Creates a new top-level community category.
   */
  createCommunitiesCategory: (
    params: CreateCommunitiesCategoryParams
  ): Promise<ApiResponse<ChummeCategory>> =>
    api.post("/api/v1/chumme-categories/create", {
      ...params,
      trait: "COMMUNITIES",
    }),

  /**
   * POST /api/v1/chumme-subcategories/create
   * Creates a new subcategory inside an existing community.
   */
  createSubCategory: (
    params: CreateSubCategoryParams
  ): Promise<ApiResponse<ChummeSubCategory>> =>
    api.post("/api/v1/chumme-subcategories/create", params),
};
