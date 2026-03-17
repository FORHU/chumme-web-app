export interface TopicCategory {
  id: string;
  name: string;
  note: string | null;
  isAd: boolean;
  populationCount?: number;
  discoveryKeywords?: string[];
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
