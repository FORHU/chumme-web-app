import type { CollabRoom, PublicCollab, Song, Recording, MusicSong, KaraokeSong, KaraokeRecording, Report } from "@/modules/collaboration/types";

export const mockRooms: CollabRoom[] = [
  {
    id: "1",
    name: "Kpop Night Room",
    type: "Public",
    host: "user_123",
    participants: 8,
    song: "Dynamite",
    status: "Active",
  },
  {
    id: "2",
    name: "Fan Singing PH",
    type: "Private",
    host: "maria23",
    participants: 5,
    song: "How You Like That",
    status: "Active",
  },
  {
    id: "3",
    name: "BTS Sing Along",
    type: "Public",
    host: "armyfan",
    participants: 12,
    song: "Butter",
    status: "Active",
  },
  {
    id: "4",
    name: "Private Jam Session",
    type: "Private",
    host: "john_doe",
    participants: 3,
    song: "Kill This Love",
    status: "Ended",
  },
];

export const mockPublicCollabs: PublicCollab[] = [
  {
    id: "1",
    title: "Global K-Pop Collab",
    creator: "sarah_kim",
    category: "K-Pop",
    participants: 45,
    startDate: "Mar 8, 2024",
    status: "Approved",
  },
  {
    id: "2",
    title: "Taylor Swift Night",
    creator: "swiftie_fan",
    category: "Pop",
    participants: 32,
    startDate: "Mar 9, 2024",
    status: "Pending",
  },
  {
    id: "3",
    title: "Anime OST Covers",
    creator: "anime_lover",
    category: "Anime",
    participants: 28,
    startDate: "Mar 7, 2024",
    status: "Approved",
  },
];

export const mockSongs: Song[] = [
  { id: "1", title: "Dynamite", artist: "BTS", usageCount: 230, status: "Active" },
  {
    id: "2",
    title: "How You Like That",
    artist: "BLACKPINK",
    usageCount: 180,
    status: "Active",
  },
  { id: "3", title: "Butter", artist: "BTS", usageCount: 195, status: "Active" },
  {
    id: "4",
    title: "Kill This Love",
    artist: "BLACKPINK",
    usageCount: 165,
    status: "Active",
  },
];

export const mockRecordings: Recording[] = [
  {
    id: "1",
    title: "Amazing K-Pop Cover",
    room: "Kpop Night Room",
    creator: "user_123",
    duration: "3:45",
    uploadDate: "Mar 8, 2024",
    featured: true,
  },
  {
    id: "2",
    title: "BTS Medley",
    room: "BTS Sing Along",
    creator: "armyfan",
    duration: "5:20",
    uploadDate: "Mar 7, 2024",
    featured: false,
  },
  {
    id: "3",
    title: "Girls Group Mashup",
    room: "Fan Singing PH",
    creator: "maria23",
    duration: "4:10",
    uploadDate: "Mar 9, 2024",
    featured: false,
  },
];

export const mockMusicSongs: MusicSong[] = [
  { id: "1", title: "Dynamite", artist: "BTS", album: "BE", genre: "Pop", duration: "3:20", status: "Active" },
  { id: "2", title: "How You Like That", artist: "BLACKPINK", album: "THE ALBUM", genre: "K-Pop", duration: "3:01", status: "Active" },
  { id: "3", title: "Love Shot", artist: "EXO", album: "Love Shot", genre: "K-Pop", duration: "3:10", status: "Active" },
  { id: "4", title: "Butter", artist: "BTS", album: "Butter", genre: "Pop", duration: "2:44", status: "Active" },
];

export const mockKaraokeSongs: KaraokeSong[] = [
  { id: "1", title: "Dynamite", artist: "BTS", lyrics: "Lyrics Available", duration: "3:20", status: "Active" },
  { id: "2", title: "Butter", artist: "BTS", lyrics: "Lyrics Available", duration: "2:44", status: "Active" },
  { id: "3", title: "How You Like That", artist: "BLACKPINK", lyrics: "Lyrics Available", duration: "3:01", status: "Active" },
];

export const mockKaraokeRecordings: KaraokeRecording[] = [
  { id: "1", user: "user_123", song: "Dynamite", room: "Kpop Night Room", date: "Feb 20", views: 1200 },
  { id: "2", user: "user_777", song: "Butter", room: "BTS Sing Room", date: "Feb 21", views: 900 },
  { id: "3", user: "maria_23", song: "How You Like That", room: "Fan Singing PH", date: "Feb 22", views: 750 },
];

export const mockReports: Report[] = [
  {
    type: "Inappropriate chat",
    room: "Kpop Night Room",
    user: "user_456",
    date: "1 hour ago",
  },
  {
    type: "Abusive user",
    room: "BTS Sing Along",
    user: "baduser123",
    date: "3 hours ago",
  },
  {
    type: "Spam collaboration",
    room: "Fan Singing PH",
    user: "spammer99",
    date: "5 hours ago",
  },
];
