// ─── Category ────────────────────────────────────────────────────────────────

export interface ChummeCategory {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  chummeTrait?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChummeCategoryWithSubcategories extends ChummeCategory {
  subcategories?: ChummeSubcategory[];
}

// ─── Subcategory ─────────────────────────────────────────────────────────────

export interface ChummeSubcategory {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Request payloads ────────────────────────────────────────────────────────

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  imageUrl?: string;
  chummeTrait?: string;
}

export interface CreateSubcategoryPayload {
  name: string;
  description?: string;
  imageUrl?: string;
  categoryId: string;
  chummeTrait?: string;
}

// ─── API responses ───────────────────────────────────────────────────────────

export type GetCommunitiesCategoriesResponse =
  | ChummeCategory[]
  | ChummeCategoryWithSubcategories[];

export type CreateCategoryResponse = ChummeCategory;

export type CreateSubcategoryResponse = ChummeSubcategory;
