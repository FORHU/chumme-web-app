export const discoverLinks = [
  {
    id: 1,
    platform: "YouTube",
    link: "youtube.com/watch?v=abc123",
    preview: "BLACKPINK concert clip",
    user: "rosie_bp",
    fandom: "BLACKPINK",
    status: "Approved",
    date: "2026-03-08",
  },
  {
    id: 2,
    platform: "TikTok",
    link: "tiktok.com/@user/video/xyz",
    preview: "BTS dance challenge",
    user: "army_forever",
    fandom: "BTS",
    status: "Approved",
    date: "2026-03-07",
  },
  {
    id: 3,
    platform: "Instagram",
    link: "instagram.com/p/def456",
    preview: "STRAY KIDS behind the scenes",
    user: "stay_official",
    fandom: "STRAY KIDS",
    status: "Pending",
    date: "2026-03-09",
  },
  {
    id: 4,
    platform: "Twitter",
    link: "twitter.com/user/status/789",
    preview: "SEVENTEEN comeback teaser",
    user: "carat_world",
    fandom: "SEVENTEEN",
    status: "Approved",
    date: "2026-03-06",
  },
];

export const featuredContent = [
  {
    id: 1,
    post: "BLACKPINK Concert Clip",
    platform: "YouTube",
    fandom: "BLACKPINK",
    rank: 1,
    duration: "7 days",
    startDate: "2026-03-01",
    endDate: "2026-03-08",
  },
  {
    id: 2,
    post: "BTS World Tour Announcement",
    platform: "TikTok",
    fandom: "BTS",
    rank: 2,
    duration: "14 days",
    startDate: "2026-03-03",
    endDate: "2026-03-17",
  },
  {
    id: 3,
    post: "STRAY KIDS Comeback Teaser",
    platform: "YouTube",
    fandom: "STRAY KIDS",
    rank: 3,
    duration: "5 days",
    startDate: "2026-03-05",
    endDate: "2026-03-10",
  },
];

export const reportedPosts = [
  {
    id: 1,
    post: "Inappropriate Concert Clip",
    user: "user123",
    reason: "Spam",
    reportsCount: 5,
    status: "Pending",
    platform: "YouTube",
  },
  {
    id: 2,
    post: "Misleading Fan Edit",
    user: "editor_pro",
    reason: "Misleading Content",
    reportsCount: 3,
    status: "Pending",
    platform: "TikTok",
  },
  {
    id: 3,
    post: "Copyright Violation",
    user: "content_maker",
    reason: "Copyright",
    reportsCount: 8,
    status: "Under Review",
    platform: "Instagram",
  },
];

export const analyticsData = [
  { id: "platform-1", name: "YouTube", value: 42, color: "#A53860" },
  { id: "platform-2", name: "TikTok", value: 28, color: "#670D2F" },
  { id: "platform-3", name: "Instagram", value: 18, color: "#EF88AD" },
  { id: "platform-4", name: "Twitter", value: 12, color: "#3A0519" },
];

export const fandomActivityData = [
  { id: "fandom-1", fandom: "BTS", posts: 1450 },
  { id: "fandom-2", fandom: "BLACKPINK", posts: 1230 },
  { id: "fandom-3", fandom: "STRAY KIDS", posts: 920 },
  { id: "fandom-4", fandom: "SEVENTEEN", posts: 780 },
  { id: "fandom-5", fandom: "TWICE", posts: 650 },
];

export const tabs = [
  { id: "overview", name: "Overview" },
  { id: "links", name: "Discover Links" },
  { id: "featured", name: "Featured" },
  { id: "reports", name: "Reports" },
];
