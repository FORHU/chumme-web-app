import { 
  Film, 
  Video, 
  Music, 
  Eye, 
  Play 
} from "lucide-react";

export const contentStats = [
  {
    title: "Total Content",
    value: "2,847",
    change: "+12%",
    icon: Film,
    color: "from-[#A53860] to-[#670D2F]",
  },
  {
    title: "Active Streams",
    value: "156",
    change: "+8%",
    icon: Video,
    color: "from-[#EF88AD] to-[#A53860]",
  },
  {
    title: "Music Library",
    value: "1,234",
    change: "+15%",
    icon: Music,
    color: "from-[#670D2F] to-[#3A0519]",
  },
  {
    title: "Daily Views",
    value: "45.2k",
    change: "+23%",
    icon: Eye,
    color: "from-[#A53860] to-[#EF88AD]",
  },
];

export const contentItems = [
  {
    id: 1,
    title: "BLACKPINK World Tour Highlights",
    type: "Video",
    fandom: "BLACKPINK",
    duration: "12:34",
    views: "125k",
    likes: "8.2k",
    status: "Featured",
    uploadDate: "2026-03-08",
    thumbnail: "🎬",
  },
  {
    id: 2,
    title: "BTS New Album Preview",
    type: "Music",
    fandom: "BTS",
    duration: "3:45",
    views: "89k",
    likes: "12.5k",
    status: "Trending",
    uploadDate: "2026-03-07",
    thumbnail: "🎵",
  },
  {
    id: 3,
    title: "STRAY KIDS Behind the Scenes",
    type: "Video",
    fandom: "STRAY KIDS",
    duration: "8:22",
    views: "67k",
    likes: "5.8k",
    status: "Active",
    uploadDate: "2026-03-06",
    thumbnail: "🎭",
  },
  {
    id: 4,
    title: "SEVENTEEN Dance Practice",
    type: "Video",
    fandom: "SEVENTEEN",
    duration: "15:18",
    views: "156k",
    likes: "18.9k",
    status: "Featured",
    uploadDate: "2026-03-05",
    thumbnail: "💃",
  },
  {
    id: 5,
    title: "TWICE Interview Podcast",
    type: "Audio",
    fandom: "TWICE",
    duration: "45:12",
    views: "34k",
    likes: "3.2k",
    status: "Active",
    uploadDate: "2026-03-04",
    thumbnail: "🎙️",
  },
];

export const tabs = [
  { id: "all", name: "All Content", icon: Film },
  { id: "videos", name: "Videos", icon: Video },
  { id: "music", name: "Music", icon: Music },
  { id: "streams", name: "Live Streams", icon: Play },
];
