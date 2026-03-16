import {
  Home,
  Compass,
  Users,
  Star,
  UserPlus,
  MessageSquare,
  User,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Discover", href: "/dashboard/discover", icon: Compass },
  { label: "Communities", href: "/dashboard/communities", icon: Users },
  { label: "Entertainment", href: "/dashboard/entertainment", icon: Star },
  { label: "Collaborations", href: "/dashboard/collaborations", icon: UserPlus },
  { label: "Chumme AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
