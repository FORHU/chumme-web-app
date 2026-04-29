import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingService } from "../api/onboarding.service";

export const useOnboardingContents = () =>
  useQuery({
    queryKey: ["onboarding-contents"],
    queryFn: onboardingService.getAll,
    staleTime: 0,        // always consider data stale
    refetchOnMount: true, // always refetch when component mounts
  });

export const useUploadOnboardingContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: onboardingService.upload,
    onSuccess: () => {
      // Remove cache entirely and force fresh fetch
      queryClient.removeQueries({ queryKey: ["onboarding-contents"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-contents"] });
    },
  });
};

export const useUpdateOnboardingContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: onboardingService.update,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["onboarding-contents"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-contents"] });
    },
  });
};

export const useDeleteOnboardingContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: onboardingService.delete,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["onboarding-contents"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-contents"] });
    },
  });
};