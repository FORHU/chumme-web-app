export interface CommunityReport {
  id: number;
  type: string;
  community: string;
  reporter: string;
  reported: string;
  description: string;
  status: string;
  priority: string;
  timestamp: string;
}

export interface ActiveCommunity {
  id: number;
  name: string;
  members: number;
  posts: number;
  engagement: string;
  moderators: number;
  status: string;
  spamReports: number;
  thumbnail: string;
}

export interface ActionLogItem {
  id: number;
  action: string;
  target: string;
  moderator: string;
  reason: string;
  timestamp: string;
  type: string;
}
