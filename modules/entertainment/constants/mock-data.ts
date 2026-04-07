export const categories = [
  {
    id: 1,
    name: "Music",
    description: "All music related content",
    subcategories: 12,
    status: "Active",
  },
  {
    id: 2,
    name: "Sports",
    description: "Sports teams and events",
    subcategories: 8,
    status: "Active",
  },
  {
    id: 3,
    name: "Movies",
    description: "Films and cinema",
    subcategories: 6,
    status: "Active",
  },
  {
    id: 4,
    name: "TV Shows",
    description: "Television series",
    subcategories: 10,
    status: "Active",
  },
  {
    id: 5,
    name: "Gaming",
    description: "Video games and esports",
    subcategories: 9,
    status: "Active",
  },
];

export const subcategories = [
  { id: 1, name: "K-Pop", category: "Music", topics: 45, status: "Active" },
  { id: 2, name: "Hip-Hop", category: "Music", topics: 32, status: "Active" },
  {
    id: 3,
    name: "Basketball",
    category: "Sports",
    topics: 28,
    status: "Active",
  },
  { id: 4, name: "Football", category: "Sports", topics: 34, status: "Active" },
  { id: 5, name: "Marvel", category: "Movies", topics: 18, status: "Active" },
];

export const topics = [
  {
    id: 1,
    name: "BTS",
    category: "Music",
    subcategory: "K-Pop",
    type: "Group",
    followers: "2.3M",
  },
  {
    id: 2,
    name: "BLACKPINK",
    category: "Music",
    subcategory: "K-Pop",
    type: "Group",
    followers: "1.9M",
  },
  {
    id: 3,
    name: "EXO",
    category: "Music",
    subcategory: "K-Pop",
    type: "Group",
    followers: "1.2M",
  },
  {
    id: 4,
    name: "Lakers",
    category: "Sports",
    subcategory: "Basketball",
    type: "Team",
    followers: "890K",
  },
  {
    id: 5,
    name: "Barcelona",
    category: "Sports",
    subcategory: "Football",
    type: "Team",
    followers: "1.5M",
  },
];

export const tabs = [
  { id: "overview", name: "Overview" },
  { id: "categories", name: "Categories" },
  { id: "subcategories", name: "Subcategories" },
  { id: "topics", name: "Topics" },
];

export const overviewStats = [
  { label: "Total Categories", value: "10" },
  { label: "Total Subcategories", value: "45" },
  { label: "Total Topics", value: "320" },
  { label: "Active Topics", value: "210" },
];

export const entertainmentTree: Record<string, Record<string, string[]>> = {
  Music: { "K-Pop": ["BTS", "BLACKPINK", "EXO"], "Hip-Hop": ["Travis Scott"] },
  Sports: { Basketball: ["Lakers", "Warriors"] },
};
