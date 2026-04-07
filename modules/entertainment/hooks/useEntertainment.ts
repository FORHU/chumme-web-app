import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { entertainmentService } from "@/modules/entertainment/api/entertainment.service";
import type { EntertainmentCategory } from "@/modules/entertainment/types/api.types";

const QUERY_KEY = ["entertainment-categories"];

export const useEntertainmentCategories = () => {
  return useQuery<EntertainmentCategory[]>({
    queryKey: QUERY_KEY,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: entertainmentService.getEntertainmentCategories as any,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: entertainmentService.createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; note?: string; discoveryKeywords?: string[] };
    }) => entertainmentService.updateCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: entertainmentService.deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useCreateSubCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: entertainmentService.createSubCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useUpdateSubCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; note?: string; discoveryKeywords?: string[] };
    }) => entertainmentService.updateSubCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useDeleteSubCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: entertainmentService.deleteSubCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useCreateTopicCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: entertainmentService.createTopicCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useUpdateTopicCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; note?: string };
    }) => entertainmentService.updateTopicCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useDeleteTopicCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: entertainmentService.deleteTopicCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};
