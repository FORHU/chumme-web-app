export interface CollabRoom {
  id: string;
  name: string;
  type: "Public" | "Private";
  host: string;
  participants: number;
  song: string;
  status: "Active" | "Ended";
}

export interface PublicCollab {
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

export type TabId = "monitor" | "rooms" | "public" | "private" | "songs" | "recordings" | "reports";
