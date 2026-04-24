import {
  Home,
  Compass,
  Users,
  Star,
  MessageSquare,
  User,
  Activity,
  LayoutGrid,
  Headphones,
  Mic2,
  Music2,
  UserRound,
  ClipboardList,
  PlayCircle,
  Settings,
  FolderOpen,
  ShieldCheck,
  Download,
} from "lucide-react";
import type React from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
  can_manage?: boolean;
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
      {
        label: "Audit Logs",
        href: "/dashboard/audit-logs",
        icon: ClipboardList,
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
    label: "Entertainment Library",
    href: "#",
    icon: Headphones,
    children: [
      { label: "Karaoke", href: "/dashboard/music/karaoke", icon: Mic2 },
      { label: "Song", href: "/dashboard/music/song", icon: Music2 },
      { label: "Artist", href: "/dashboard/music/artist", icon: UserRound },
      { label: "Collaboration", href: "/dashboard/music/collaboration", icon: Users },
    ],
  },
  { label: "Chumme AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare },
  {
    label: "Settings",
    href: "#",
    icon: Settings,
    children: [
      {
        label: "Onboarding",
        href: "/dashboard/onboarding",
        icon: PlayCircle,
      },
      {
        label: "Roles",
        href: "/dashboard/settings/roles",
        icon: ShieldCheck,
      },
      {
        label: "APK Downloader",
        href: "/dashboard/settings/apk",
        icon: Download,
      },
      {
        label: "User Settings",
        href: "/dashboard/profile",
        icon: User,
      },
      {
        label: "File Viewer",
        href: "/dashboard/settings/file-viewer",
        icon: FolderOpen,
      },
    ],
  },
];
