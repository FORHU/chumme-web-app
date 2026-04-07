import { ApiResponse } from "apisauce";

import { api } from "@/modules/shared/api/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChummeTrait = "NONE" | "COMMUNITIES" | "ENTERTAINMENT";

export interface ChummeVisualDesign {
  colorSet?: {
    primary?: string;
    glow?: string;
  };
}

export interface ChummeCategory {
  id: string;
  name: string;
  note?: string | null;
  isAd?: boolean;
  keyPassword?: string | null;
  chummeTraits: ChummeTrait;
  description?: string;
  color?: string;
  icon?: string;
  emoji?: string;
  imageUrl?: string;
  populationCount?: number;
  chummeVisualDesign?: ChummeVisualDesign | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChummeSubCategory {
  id: string;
  name: string;
  note?: string | null;
  chummeCategoryId: string;
  ownerId?: string | null;
  keyPassword?: string | null;
  description?: string;
  color?: string;
  icon?: string;
  emoji?: string;
  imageUrl?: string;
  populationCount?: number;
  chummeVisualDesign?: ChummeVisualDesign | null;
  createdAt: string;
  updatedAt: string;
}

export interface BubbleItem {
  id: string;
  label: string;
  count: number;
  chummeVisualDesign?: ChummeVisualDesign | null;
}

export interface CreateCommunitiesCategoryParams {
  name: string;
  isAd: boolean;
  chummeTrait: ChummeTrait;
  note?: string;
  description?: string;
  color?: string;
  icon?: string;
  emoji?: string;
  imageUrl?: string;
  emojiIcon?: string;
  colorSet?: {
    primary: string;
    secondary: string;
    gradient: string[];
  };
}

export interface CreateSubCategoryParams {
  name: string;
  chummeCategoryId: string;
  isAd: boolean;
  note?: string;
  description?: string;
  color?: string;
  icon?: string;
  emoji?: string;
  imageUrl?: string;
}

export interface UpdateCommunitiesCategoryParams {
  name?: string;
  note?: string;
  isAd?: boolean;
  chummeTrait?: ChummeTrait;
  description?: string;
  color?: string;
  icon?: string;
  emoji?: string;
  imageUrl?: string;
  emojiIcon?: string;
  colorSet?: {
    primary: string;
    secondary: string;
    gradient: string[];
  };
}

export interface UpdateSubCategoryParams {
  name?: string;
  note?: string;
  isAd?: boolean;
  description?: string;
  color?: string;
  icon?: string;
  emoji?: string;
  imageUrl?: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const communitiesApi = {
  /**
   * GET /api/v1/chumme-categories/specialized/COMMUNITIES
   * Returns all ChummeCategory rows where chummeTraits = COMMUNITIES.
   * Response shape: { categories: ChummeCategory[] }
   */
  getCommunitiesCategories: (): Promise<
    ApiResponse<{ categories: ChummeCategory[] }>
  > => api.get("/api/v1/chumme-categories/communities"),

  /**
   * GET /api/v1/chumme-subcategories/category/:categoryId
   * Returns subcategories under a given ChummeCategory.
   * Response shape: { subCategories: ChummeSubCategory[] }
   */
  getSubcategoriesByCategoryId: (
    categoryId: string,
  ): Promise<ApiResponse<{ subCategories: ChummeSubCategory[] }>> =>
    api.get(`/api/v1/chumme-subcategories/category/${categoryId}`),

  /**
   * POST /api/v1/chumme-categories/create
   * Creates a new top-level Communities category ("Add Country" in UI).
   * Sends traits field — backend service maps it to chummeTraits.
   */
  createCommunitiesCategory: (
    params: CreateCommunitiesCategoryParams,
  ): Promise<ApiResponse<ChummeCategory>> =>
    api.post("/api/v1/chumme-categories/create", params),

  deleteCommunitiesCategory: (
    id: string,
  ): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/api/v1/chumme-categories/${id}`),

  updateCommunitiesCategory: (
    id: string,
    params: UpdateCommunitiesCategoryParams,
  ): Promise<ApiResponse<ChummeCategory>> =>
    api.put(`/api/v1/chumme-categories/${id}`, params),

  deleteSubCategory: (id: string): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/api/v1/chumme-subcategories/${id}`),

  updateSubCategory: (
    id: string,
    params: UpdateSubCategoryParams,
  ): Promise<ApiResponse<ChummeSubCategory>> =>
    api.put(`/api/v1/chumme-subcategories/${id}`, params),

  /**
   * POST /api/v1/chumme-subcategories/create
   * Creates a new subcategory ("Create Category" in UI) under a Communities category.
   */
  createSubCategory: (
    params: CreateSubCategoryParams,
  ): Promise<ApiResponse<ChummeSubCategory>> =>
    api.post("/api/v1/chumme-subcategories/create", params),
};
