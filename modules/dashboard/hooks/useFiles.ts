import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fileService } from "../api/file.service";

export const useFiles = () =>
  useQuery({
    queryKey: ["files"],
    queryFn: fileService.getAll,
  });

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fileService.upload,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fileService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
  });
};

export const useFileDownloadUrl = () =>
  useMutation({ mutationFn: fileService.getDownloadUrl });
