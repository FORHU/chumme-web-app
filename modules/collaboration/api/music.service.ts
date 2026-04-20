import { api } from "@/modules/shared/api/api-client";

export interface MusicTrack {
  id: string;
  title: string;
  duration?: number;
  bpm?: number;
  isKaraoke: boolean;
  release_date: string;
  createdAt: string;
  musicArtist?: { id: string; name: string; imageUrl?: string };
  musicAlbum?: { id: string; album: string; genre: string };
  musicFile?: { id: string; fileUrl: string; fileType: string };
  status?: string;
}

export interface MusicListResponse {
  data: MusicTrack[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ArtistOption {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface ArtistsResponse {
  success: boolean;
  data: ArtistOption[];
}

export const musicService = {
  getSongs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isKaraoke?: boolean;
  }): Promise<MusicListResponse> => {
    const query = new URLSearchParams();
    if (params?.page)     query.set("page",      String(params.page));
    if (params?.limit)    query.set("limit",     String(params.limit));
    if (params?.search)   query.set("search",    params.search);
    if (params?.isKaraoke !== undefined)
      query.set("isKaraoke", String(params.isKaraoke));

    const res = await api.get<MusicListResponse>(
      `/api/v1/music/list?${query.toString()}`,
    );
    if (!res.ok)
      throw new Error(
        (res.data as Record<string, string> | undefined)?.message || "Failed to fetch music",
      );
    return res.data!;
  },

  getArtists: async (): Promise<ArtistOption[]> => {
    const res = await api.get<ArtistsResponse>("/api/v1/artists");
    if (!res.ok) return [];
    return res.data?.data ?? [];
  },

  uploadSong: async (
    file: File,
    meta: {
      title: string;
      isKaraoke: boolean;
      musicArtistId?: string;
      lyricsFile?: File | null;
      videoFile?: File | null;
    },
  ): Promise<MusicTrack> => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    const formData = new FormData();
    formData.append("fileData", file);
    formData.append("title", meta.title);
    formData.append("isKaraoke", String(meta.isKaraoke));
    formData.append("release_date", new Date().toISOString());
    formData.append("fileType", meta.isKaraoke ? "KARAOKE" : "MUSIC");

    if (meta.musicArtistId) {
      formData.append("musicArtistId", meta.musicArtistId);
    }

    if (meta.lyricsFile) {
      formData.append("lyricsFile", meta.lyricsFile);
    }
    if (meta.videoFile) {
      formData.append("videoFile", meta.videoFile);
    }

    const response = await fetch(`${baseUrl}/api/v1/music/create`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const json = await response.json();
    if (!response.ok)
      throw new Error(json?.message || "Failed to upload song");
    return json?.data ?? json;
  },

  deleteSong: async (id: string): Promise<void> => {
    const res = await api.delete(`/api/v1/music/delete/${id}`);
    if (!res.ok)
      throw new Error(
        (res.data as Record<string, string> | undefined)?.message || "Failed to delete song",
      );
  },
};
