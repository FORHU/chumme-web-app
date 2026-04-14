import {
  Home,
  Compass,
  Users,
  Star,
  UserPlus,
  MessageSquare,
  User,
  Activity,
  LayoutGrid,
  Headphones,
  Mic2,
  Music2,
} from "lucide-react";
import type React from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    children: [
      {
        label: "Platform Ingestion",
        href: "/dashboard/platform-ingestion",
        icon: Activity,
      },
    ],
  },
  { label: "Discover", href: "/dashboard/discover", icon: Compass },
  {
    label: "Categories",
    href: "#",
    icon: LayoutGrid,
    children: [
      { label: "Communities", href: "/dashboard/communities", icon: Users },
      { label: "Entertainment", href: "/dashboard/entertainment", icon: Star },
    ],
  },
  {
    label: "Music",
    href: "#",
    icon: Headphones,
    children: [
      { label: "Karaoke", href: "/dashboard/music/karaoke", icon: Mic2 },
      { label: "Song", href: "/dashboard/music/song", icon: Music2 },
    ],
  },
  {
    label: "Collaborations",
    href: "/dashboard/collaborations",
    icon: UserPlus,
  },
  { label: "Chumme AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];
