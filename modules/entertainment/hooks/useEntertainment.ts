import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { entertainmentService } from "@/modules/entertainment/api/entertainment.service";
import type { EntertainmentCategory, Stream } from "@/modules/entertainment/types/api.types";

const QUERY_KEY = ["entertainment-categories"];
const STREAMS_QUERY_KEY = ["entertainment-streams"];

export const useEntertainmentCategories = () => {
  return useQuery<EntertainmentCategory[]>({
    queryKey: QUERY_KEY,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: entertainmentService.getEntertainmentCategories as any,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entertainmentService.createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; note?: string; discoveryKeywords?: string[] };
    }) => entertainmentService.updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entertainmentService.deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entertainmentService.createSubCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; note?: string; discoveryKeywords?: string[] };
    }) => entertainmentService.updateSubCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entertainmentService.deleteSubCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useCreateTopicCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entertainmentService.createTopicCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useUpdateTopicCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; note?: string; imageUrl?: string };
    }) => entertainmentService.updateTopicCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useDeleteTopicCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entertainmentService.deleteTopicCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useLiveStreams = () => {
  return useQuery<Stream[]>({
    queryKey: STREAMS_QUERY_KEY,
    queryFn: entertainmentService.getLiveStreams,
    refetchInterval: 30000, // Refresh every 30 seconds for live data
  });
};

export const useStreamAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      action,
    }: {
      id: string;
      action: "start" | "stop" | "pause";
    }) => entertainmentService.updateStreamAction(id, action),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: STREAMS_QUERY_KEY }),
  });
};
