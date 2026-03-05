import { useApiQuery } from "@/modules/shared/hooks/useApiQuery";
import { useApiMutation } from "@/modules/shared/hooks/useApiMutation";
import { UserProfile, UpdateProfileParams } from "../api/profile-api";
import { useQueryClient } from "@tanstack/react-query";

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
