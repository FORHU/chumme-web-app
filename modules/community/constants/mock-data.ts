"use client";
import { Users, Flag, Ban, Shield, TrendingUp } from "lucide-react";
import {
  CommunityReport,
  ActiveCommunity,
  ActionLogItem,
} from "@/modules/community/types";

export const communityStats = [
  {
    title: "Active Communities",
    value: "156",
    change: "+8%",
    icon: Users,
    color: "from-[#A53860] to-[#670D2F]",
  },
  {
    title: "Pending Reports",
    value: "23",
    change: "-12%",
    icon: Flag,
    color: "from-[#EF88AD] to-[#A53860]",
  },
  {
    title: "Banned Users",
    value: "89",
    change: "+5%",
    icon: Ban,
    color: "from-[#670D2F] to-[#3A0519]",
  },
  {
    title: "Moderation Actions",
    value: "342",
    change: "+18%",
    icon: Shield,
    color: "from-[#A53860] to-[#EF88AD]",
  },
];

export const moderationTrendData = [
  { id: "trend-1", name: "Mon", reports: 12, actions: 8 },
  { id: "trend-2", name: "Tue", reports: 19, actions: 15 },
  { id: "trend-3", name: "Wed", reports: 8, actions: 6 },
  { id: "trend-4", name: "Thu", reports: 25, actions: 20 },
  { id: "trend-5", name: "Fri", reports: 18, actions: 14 },
  { id: "trend-6", name: "Sat", reports: 22, actions: 18 },
  { id: "trend-7", name: "Sun", reports: 15, actions: 12 },
];

export const reportTypeData = [
  { id: "type-1", name: "Spam", value: 35, color: "#A53860" },
  { id: "type-2", name: "Harassment", value: 25, color: "#670D2F" },
  { id: "type-3", name: "Inappropriate", value: 20, color: "#EF88AD" },
  { id: "type-4", name: "Copyright", value: 15, color: "#3A0519" },
  { id: "type-5", name: "Other", value: 5, color: "#6B7280" },
];

export const communityReports: CommunityReport[] = [
  {
    id: 1,
    type: "Spam",
    community: "K-Pop Fans United",
    reporter: "user123",
    reported: "spammer_account",
    description: "User posting repetitive promotional content",
    status: "Pending",
    priority: "High",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "Harassment",
    community: "BTS ARMY Central",
    reporter: "army_member",
    reported: "toxic_user",
    description: "User making offensive comments about other members",
    status: "Under Review",
    priority: "Medium",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    type: "Inappropriate",
    community: "BLACKPINK Blinks",
    reporter: "blink_fan",
    reported: "inappropriate_poster",
    description: "Posted content not suitable for community guidelines",
    status: "Pending",
    priority: "High",
    timestamp: "1 day ago",
  },
  {
    id: 4,
    type: "Copyright",
    community: "SEVENTEEN Carats",
    reporter: "content_creator",
    reported: "copyright_violation",
    description: "Uploaded copyrighted material without permission",
    status: "Resolved",
    priority: "Low",
    timestamp: "2 days ago",
  },
];

export const activeCommunities: ActiveCommunity[] = [
  {
    id: 1,
    name: "K-Pop Fans United",
    members: 15420,
    posts: 892,
    engagement: "High",
    moderators: 12,
    status: "Active",
    spamReports: 15,
    thumbnail: "🎵",
  },
  {
    id: 2,
    name: "BTS ARMY Central",
    members: 28950,
    posts: 1245,
    engagement: "Very High",
    moderators: 18,
    status: "Active",
    spamReports: 8,
    thumbnail: "💜",
  },
  {
    id: 3,
    name: "BLACKPINK Blinks",
    members: 22100,
    posts: 756,
    engagement: "High",
    moderators: 15,
    status: "Active",
    spamReports: 12,
    thumbnail: "🖤",
  },
  {
    id: 4,
    name: "STRAY KIDS Stays",
    members: 18750,
    posts: 634,
    engagement: "Medium",
    moderators: 10,
    status: "Active",
    spamReports: 5,
    thumbnail: "⚡",
  },
];

export const tabs = [
  { id: "overview", name: "Overview", icon: TrendingUp },
  { id: "reports", name: "Reports", icon: Flag },
  { id: "communities", name: "Communities", icon: Users },
  { id: "actions", name: "Actions Log", icon: Shield },
];

export const actionLog: ActionLogItem[] = [
  {
    id: 1,
    action: "User Banned",
    target: "spammer_account",
    moderator: "admin_jane",
    reason: "Repeated spam violations",
    timestamp: "1 hour ago",
    type: "ban",
  },
  {
    id: 2,
    action: "Post Removed",
    target: "inappropriate_post_123",
    moderator: "mod_mike",
    reason: "Inappropriate content",
    timestamp: "3 hours ago",
    type: "remove",
  },
  {
    id: 3,
    action: "Warning Issued",
    target: "toxic_user",
    moderator: "admin_sarah",
    reason: "Harassment behavior",
    timestamp: "6 hours ago",
    type: "warning",
  },
  {
    id: 4,
    action: "Community Moderated",
    target: "K-Pop Fans United",
    moderator: "admin_jane",
    reason: "Added new moderator",
    timestamp: "1 day ago",
    type: "moderate",
  },
];
