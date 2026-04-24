import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { musicService } from "@/modules/collaboration/api/music.service";

const SONGS_KEY  = ["music-songs"];
const KARAOKE_KEY = ["music-karaoke"];

export const useSongs = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: [...SONGS_KEY, params],
    queryFn: () => musicService.getSongs({ ...params, isKaraoke: false }),
    staleTime: 2 * 60 * 1000,
  });

export const useKaraokeSongs = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: [...KARAOKE_KEY, params],
    queryFn: () => musicService.getSongs({ ...params, isKaraoke: true }),
    staleTime: 2 * 60 * 1000,
  });

export const useUploadSong = (isKaraoke: boolean) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      lyricsFile,
      videoFile,
      meta,
    }: {
      file: File;
      lyricsFile?: File | null;
      videoFile?: File | null;
      meta: { title: string; musicArtistId?: string };
    }) =>
      musicService.uploadSong(file, {
        title: meta.title,
        isKaraoke,
        musicArtistId: meta.musicArtistId,
        lyricsFile,
        videoFile,
      }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: isKaraoke ? KARAOKE_KEY : SONGS_KEY,
      });
    },
  });
};

export const useDeleteSong = (isKaraoke: boolean) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => musicService.deleteSong(id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: isKaraoke ? KARAOKE_KEY : SONGS_KEY,
      });
    },
  });
};

export const useArtists = () =>
  useQuery({
    queryKey: ["artists"],
    queryFn: musicService.getArtists,
    staleTime: 5 * 60 * 1000,
  });
