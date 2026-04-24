export interface CollaborationRoom {
  id: string;
  name: string;
  type: "Public" | "Private";
  host: string;
  participants: number;
  song: string;
  status: "Active" | "Ended";
}

export interface PublicCollaboration {
  id: string;
  title: string;
  creator: string;
  category: string;
  participants: number;
  startDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  usageCount: number;
  status: "Active" | "Disabled";
}

export interface Recording {
  id: string;
  title: string;
  room: string;
  creator: string;
  duration: string;
  uploadDate: string;
  featured: boolean;
}

export interface MusicSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  status: "Active" | "Inactive";
}

export interface KaraokeSong {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  duration: string;
  status: "Active" | "Inactive";
}

export interface KaraokeRecording {
  id: string;
  user: string;
  song: string;
  room: string;
  date: string;
  views: number;
}

export type TabId =
  | "monitor"
  | "rooms"
  | "public"
  | "private"
  | "songs"
  | "recordings"
  | "reports";
export type CollaborationPage = "rooms" | "music" | "karaoke";
export type KaraokeTabId = "songs" | "recordings";

export interface Report {
  type: string;
  room: string;
  user: string;
  date: string;
}
