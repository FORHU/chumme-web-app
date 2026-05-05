import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { musicService } from "@/modules/collaboration/api/music.service";

const SONGS_KEY   = ["music-songs"];
const KARAOKE_KEY = ["music-karaoke"];

// Primitive values in queryKey so React Query compares by value, not reference.
export const useSongs = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: [...SONGS_KEY, params?.page, params?.limit, params?.search ?? ""],
    queryFn: () => musicService.getSongs({ ...params, isKaraoke: false }),
    staleTime: 2 * 60 * 1000,
  });

export const useKaraokeSongs = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: [...KARAOKE_KEY, params?.page, params?.limit, params?.search ?? ""],
    queryFn: () => musicService.getSongs({ ...params, isKaraoke: true }),
    staleTime: 2 * 60 * 1000,
  });

export const useUploadSong = (isKaraoke: boolean) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      lyricsFile,
      videoFile,
      imageFile,
      meta,
    }: {
      file: File;
      lyricsFile?: File | null;
      videoFile?: File | null;
      imageFile?: File | null;
      meta: { title: string; musicArtistId?: string; album?: string; genre?: string; duration?: number };
    }) =>
      musicService.uploadSong(file, {
        title: meta.title,
        isKaraoke,
        musicArtistId: meta.musicArtistId,
        album: meta.album,
        genre: meta.genre,
        duration: meta.duration,
        lyricsFile,
        videoFile,
        imageFile,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: isKaraoke ? KARAOKE_KEY : SONGS_KEY });
    },
  });
};

export const useUpdateSong = (isKaraoke: boolean) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { 
        title?: string; 
        musicArtistId?: string; 
        album?: string; 
        genre?: string; 
        imageFile?: File | null; 
        lyricsFile?: File | null;
        audioFile?: File | null;
      };
    }) => musicService.updateSong(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: isKaraoke ? KARAOKE_KEY : SONGS_KEY });
    },
  });
};

export const useDeleteSong = (isKaraoke: boolean) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => musicService.deleteSong(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: isKaraoke ? KARAOKE_KEY : SONGS_KEY });
    },
  });
};

export const useArtists = (params?: { search?: string; page?: number; limit?: number }) =>
  useQuery({
    queryKey: ["artists", params?.page, params?.limit, params?.search ?? ""],
    queryFn: () => musicService.getArtists(params),
    staleTime: 5 * 60 * 1000,
  });

export const useCreateArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: musicService.createArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });
};

export const useUpdateArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof musicService.updateArtist>[1] }) =>
      musicService.updateArtist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });
};

export const useDeleteArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: musicService.deleteArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });
};
