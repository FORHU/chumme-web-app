import { api, getApiBaseUrl } from "@/modules/shared/api/api-client";

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
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
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

  getArtists: async (params?: { search?: string; page?: number; limit?: number }): Promise<ArtistOption[]> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);

    const queryString = query.toString();
    const endpoint = queryString ? `/api/v1/artists?${queryString}` : "/api/v1/artists";

    const res = await api.get<ArtistsResponse>(endpoint);
    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[musicService.getArtists] Request failed:", res.status, res.data);
      }
      return [];
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const rawData = res.data as Record<string, unknown> | ArtistOption[] | undefined;
    const artists = Array.isArray(rawData) ? rawData : ((rawData?.data as any[]) ?? []);

    // Map nested visual design emojiIcon to imageUrl for UI compatibility
    return artists.map((artist: any) => ({
      ...artist,
      imageUrl: artist.chummeVisualDesign?.emojiIcon || artist.imageUrl,
    }));
    /* eslint-enable @typescript-eslint/no-explicit-any */
  },


  uploadSong: async (
    file: File,
    meta: {
      title: string;
      isKaraoke: boolean;
      musicArtistId?: string;
      album?: string;
      genre?: string;
      duration?: number;
      lyricsFile?: File | null;
      videoFile?: File | null;
    },
  ): Promise<MusicTrack> => {
    const baseUrl = getApiBaseUrl();
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    const formData = new FormData();
    formData.append("fileData", file);
    formData.append("title", meta.title);
    formData.append("isKaraoke", String(meta.isKaraoke));
    formData.append("release_date", new Date().toISOString());

    if (meta.musicArtistId) {
      formData.append("musicArtistId", meta.musicArtistId);
    }
    if (meta.duration !== undefined) {
      formData.append("duration", String(meta.duration));
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

    let json;
    try {
      json = await response.json();
    } catch {
      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }
      throw new Error("Failed to parse server response");
    }

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

  createArtist: async (data: {
    name: string;
    platform: string;
    bio?: string;
    imageUrl?: string;
    genre?: string;
  }): Promise<ArtistOption> => {
    const payload = {
      name: data.name,
      platform: data.platform,
      bio: data.bio,
      imageUrl: data.imageUrl,
    };
    const res = await api.post<{ data: ArtistOption }>("/api/v1/artists", payload);
    if (!res.ok) {
      throw new Error(((res.data as Record<string, unknown>)?.message as string) || "Failed to create artist");
    }
    return res.data!.data ?? res.data!;
  },

  updateArtist: async (
    id: string,
    data: {
      name?: string;
      platform?: string;
      bio?: string;
      imageUrl?: string;
      genre?: string;
    }
  ): Promise<ArtistOption> => {
    const payload = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.platform !== undefined && { platform: data.platform }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
    };
    const res = await api.put<{ data: ArtistOption }>(`/api/v1/artists/${id}`, payload);
    if (!res.ok) {
      throw new Error(((res.data as Record<string, unknown>)?.message as string) || "Failed to update artist");
    }
    return res.data!.data ?? res.data!;
  },

  deleteArtist: async (id: string): Promise<void> => {
    const res = await api.delete(`/api/v1/artists/${id}`);
    if (!res.ok) {
      throw new Error(((res.data as Record<string, unknown>)?.message as string) || "Failed to delete artist");
    }
  },
};
