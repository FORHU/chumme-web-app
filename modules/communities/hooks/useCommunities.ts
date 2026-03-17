import { useApiQuery } from "@/modules/shared/hooks/useApiQuery";
import type { ChummeCategory } from "@/modules/community/api/communities-api";
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
  return useApiQuery<ChummeCategory[]>(
    [...communitiesKeys.categories()],
    "/api/v1/chumme-categories/specialized/COMMUNITIES"
  );
};
