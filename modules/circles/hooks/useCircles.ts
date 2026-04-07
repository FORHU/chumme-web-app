import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/modules/shared/hooks/useApiMutation";
import { useApiQuery } from "@/modules/shared/hooks/useApiQuery";

import { Circle } from "../api/circles-api";

export type { Circle };

export function useCirclesQuery(category?: string, search?: string) {
  return useApiQuery<Circle[]>(
    ["circles", { category, search }],
    "/api/v1/circles",
  );
}

export function useCircleQuery(circleId: string) {
  return useApiQuery<Circle>(
    ["circles", circleId],
    `/api/v1/circles/${circleId}`,
  );
}

export function useJoinCircleMutation() {
  const queryClient = useQueryClient();

  return useApiMutation<{ success: boolean }, Error, { circleId: string }>({
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["circles"] });
      queryClient.invalidateQueries({
        queryKey: ["circles", variables.data?.circleId],
      });
    },
  });
}
