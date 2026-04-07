import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/modules/shared/hooks/useApiMutation";
import { useApiQuery } from "@/modules/shared/hooks/useApiQuery";

import { UserProfile, UpdateProfileParams } from "../api/profile-api";

export function useProfileQuery() {
  return useApiQuery<UserProfile>(["profile", "me"], "/api/v1/profiles/me");
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useApiMutation<UserProfile, Error, UpdateProfileParams>({
    onSuccess: () => {
      // Invalidate and refetch profile data after a successful update
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}
