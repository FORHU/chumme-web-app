export interface TopicCategory {
  id: string;
  name: string;
  note: string | null;
  isAd: boolean;
  populationCount?: number;
  discoveryKeywords?: string[];
  imageUrl?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  note: string | null;
  isAd: boolean;
  populationCount?: number;
  discoveryKeywords?: string[];
  chummeTopicCategories?: TopicCategory[];
}

export interface EntertainmentCategory {
  id: string;
  name: string;
  note: string | null;
  isAd: boolean;
  chummeTrait: "ENTERTAINMENT";
  populationCount?: number;
  discoveryKeywords?: string[];
  chummeSubCategories: SubCategory[];
}

export interface EntertainmentResponse {
  categories: EntertainmentCategory[];
}

export type StreamStatus = "live" | "paused" | "offline";
export type StreamHealth = "healthy" | "warning" | "critical";

export interface Stream {
  id: string;
  artistId?: string;
  title: string;
  name?: string;      // Artist name
  streamId: string;
  thumbnail: string;
  status: StreamStatus;
  viewers: number;
  viewCount?: number; // Support for YouTube high view counts
  bitrate: number;
  latency: number;
  uptime: number;
  health: StreamHealth;
}

export interface StreamsResponse {
  streams: Stream[];
}
