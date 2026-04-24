import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apkService, APKUploadMeta } from "../api/apk.service";

export const APK_QUERY_KEY = ["apk-releases"];

export const useAPKReleases = () =>
  useQuery({
    queryKey: APK_QUERY_KEY,
    queryFn: apkService.getAll,
    placeholderData: (previousData) => previousData ?? [],
    staleTime: 0,
    gcTime: 0,
  });

export const useAPKUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, meta }: { file: File; meta: APKUploadMeta }) =>
      apkService.upload(file, meta),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APK_QUERY_KEY }),
  });
};

export const useAPKUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, meta }: { id: string; meta: Partial<APKUploadMeta> }) =>
      apkService.update(id, meta),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APK_QUERY_KEY }),
  });
};

export const useAPKSetLatest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apkService.setLatest(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: APK_QUERY_KEY });
      queryClient.removeQueries({ queryKey: ["apk-latest"] });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: APK_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ["apk-latest"] });
      }, 500);
    },
  });
};

export const useAPKSetStable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apkService.setStable(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: APK_QUERY_KEY });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: APK_QUERY_KEY });
      }, 500);
    },
  });
};

export const useAPKDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apkService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APK_QUERY_KEY }),
  });
};

export const useAPKDownloadUrl = () =>
  useMutation({
    mutationFn: (id: string) => apkService.getDownloadUrl(id),
  });

export const useLatestAPK = () =>
  useQuery({
    queryKey: ["apk-latest"],
    queryFn: async () => {
      const releases = await apkService.getAll();
      return releases.find((release) => release.isLatest) ?? null;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
