import { api, getApiBaseUrl } from "@/modules/shared/api/api-client";
import { fileService } from "@/modules/dashboard/api/file.service";

export interface MusicTrack {
  id: string;
  title: string;
  duration?: number;
  bpm?: number;
  isKaraoke: boolean;
  album?: string;
  genre?: string;
  imageUrl?: string;
  release_date: string;
  createdAt: string;
  musicArtist?: { id: string; name: string; imageUrl?: string };
  musicAlbum?: { id: string; album: string; genre: string };
  musicFile?: { id: string; fileUrl: string; fileType: string };
  metaData?: { imageUrl?: string; backgroundVideoUrl?: string; [key: string]: unknown };
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

  getSongById: async (id: string): Promise<MusicTrack | null> => {
    const res = await api.get<{ data: MusicTrack }>(`/api/v1/music/${id}`);
    if (!res.ok) return null;
    return res.data!.data ?? res.data!;
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
      imageFile?: File | null;
    },
  ): Promise<MusicTrack> => {
    const baseUrl = getApiBaseUrl();
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    // 1. Upload Media Files directly since deployed backend might ignore them in music/create
    let imageUrl, backgroundVideoUrl;
    if (meta.imageFile) {
      try {
        const uploadRecord = await fileService.upload(meta.imageFile);
        imageUrl = uploadRecord.url;
      } catch (err) {
        console.warn("Failed to upload image file", err);
      }
    }
    if (meta.videoFile) {
      try {
        const uploadRecord = await fileService.upload(meta.videoFile);
        backgroundVideoUrl = uploadRecord.url;
      } catch (err) {
        console.warn("Failed to upload video file", err);
      }
    }

    // 2. Resolve or Create Music Album
    let finalMusicAlbumId;
    if (meta.album && meta.musicArtistId) {
      try {
        const albumsRes = await fetch(`${baseUrl}/api/v1/music-albums/list?artistId=${meta.musicArtistId}`, { headers });
        if (albumsRes.ok) {
          const albums = await albumsRes.json();
          const existing = albums.find((a: { album: string; id: string }) => a.album?.toLowerCase() === meta.album!.toLowerCase());
          if (existing) {
             finalMusicAlbumId = existing.id;
          }
        }
        
        if (!finalMusicAlbumId) {
          const createAlbumRes = await fetch(`${baseUrl}/api/v1/music-albums/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({
              album: meta.album,
              genre: meta.genre || "Unknown",
              language: "en",
              musicArtistId: meta.musicArtistId
            })
          });
          if (createAlbumRes.ok) {
            const newAlbum = await createAlbumRes.json();
            finalMusicAlbumId = newAlbum.id;
          }
        }
      } catch (err) {
        console.warn("Failed to create/resolve album", err);
      }
    }

    // 3. Construct meta_data JSON Object
    let metaDataObj: Record<string, unknown> = {};
    if (meta.lyricsFile) {
      try {
        const text = await meta.lyricsFile.text();
        metaDataObj = JSON.parse(text);
      } catch (e) {
        console.warn("Invalid lyrics JSON", e);
      }
    }
    
    if (imageUrl) metaDataObj.imageUrl = imageUrl;
    if (backgroundVideoUrl) metaDataObj.backgroundVideoUrl = backgroundVideoUrl;

    // 4. Construct FormData
    const formData = new FormData();
    formData.append("fileData", file);
    formData.append("title", meta.title);
    formData.append("isKaraoke", String(meta.isKaraoke));
    formData.append("release_date", new Date().toISOString());

    if (meta.musicArtistId) {
      formData.append("musicArtistId", meta.musicArtistId);
    }
    if (meta.genre) {
      formData.append("genre", meta.genre);
    }
    if (meta.duration !== undefined) {
      formData.append("duration", String(meta.duration));
    }
    if (finalMusicAlbumId) {
      formData.append("musicAlbumId", finalMusicAlbumId);
    }

    // Append meta_data as a Blob file so the backend can parse it via multer
    if (Object.keys(metaDataObj).length > 0) {
      const metaDataBlob = new Blob([JSON.stringify(metaDataObj)], { type: "application/json" });
      formData.append("meta_data", metaDataBlob, "meta_data.json");
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

  updateSong: async (
    id: string,
    data: {
      title?: string;
      musicArtistId?: string;
      album?: string;
      genre?: string;
      imageFile?: File | null;
      lyricsFile?: File | null;
      audioFile?: File | null;
    }
  ): Promise<MusicTrack> => {
    const baseUrl = getApiBaseUrl();
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    let finalMusicAlbumId;
    if (data.album && data.musicArtistId) {
      try {
        const albumsRes = await fetch(`${baseUrl}/api/v1/music-albums/list?artistId=${data.musicArtistId}`, { headers });
        if (albumsRes.ok) {
          const albums = await albumsRes.json();
          const existing = albums.find((a: { album: string; id: string }) => a.album?.toLowerCase() === data.album!.toLowerCase());
          if (existing) {
             finalMusicAlbumId = existing.id;
          }
        }
        
        if (!finalMusicAlbumId) {
          const createAlbumRes = await fetch(`${baseUrl}/api/v1/music-albums/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({
              album: data.album,
              genre: data.genre || "Unknown",
              language: "en",
              musicArtistId: data.musicArtistId
            })
          });
          if (createAlbumRes.ok) {
            const newAlbum = await createAlbumRes.json();
            finalMusicAlbumId = newAlbum.id;
          }
        }
      } catch (err) {
        console.warn("Failed to create/resolve album during update", err);
      }
    }

    // Upload new image/lyrics if provided
    let newImageUrl: string | undefined;
    let newLyricsData: Record<string, unknown> | undefined;
    if (data.imageFile) {
      try {
        const uploaded = await fileService.upload(data.imageFile);
        newImageUrl = uploaded.url;
      } catch (err) { console.warn("Image upload failed", err); }
    }
    if (data.lyricsFile) {
      try {
        const text = await data.lyricsFile.text();
        newLyricsData = JSON.parse(text);
      } catch (err) { console.warn("Lyrics parse failed", err); }
    }

    let newAudioFileId: string | undefined;
    if (data.audioFile) {
      try {
        const uploaded = await fileService.upload(data.audioFile);
        newAudioFileId = uploaded.id;
      } catch (err) { console.warn("Audio upload failed", err); }
    }

    const payload: Record<string, unknown> = {};
    if (data.title) payload.title = data.title;
    if (data.musicArtistId) payload.musicArtistId = data.musicArtistId;
    if (data.genre) payload.genre = data.genre;
    if (finalMusicAlbumId) payload.musicAlbumId = finalMusicAlbumId;
    if (newAudioFileId) payload.musicFileId = newAudioFileId;

    if (newImageUrl || newLyricsData) {
      // Fetch existing metadata to merge
      try {
        const existing = await musicService.getSongById(id);
        payload.metaData = {
          ...(newLyricsData || {}),
          ...(newImageUrl ? { imageUrl: newImageUrl } : {}),
          ...(existing?.metaData || {})
        };
      } catch (err) {
        console.warn("Failed to fetch existing metadata for merge", err);
        payload.metaData = {
          ...(newLyricsData || {}),
          ...(newImageUrl ? { imageUrl: newImageUrl } : {})
        };
      }
    }

    const res = await api.patch(`/api/v1/music/update/${id}`, payload);
    if (!res.ok) {
      throw new Error((res.data as Record<string, string> | undefined)?.message || "Failed to update song");
    }
    return res.data as MusicTrack;
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
