export interface APKVersion {
  id: number;
  version: string;
  build: string;
  releaseDate: string;
  size: string;
  downloads: number;
  status: "Latest" | "Stable" | "Archive";
  changes: string[];
  downloadUrl: string;
}

export const APK_VERSIONS: APKVersion[] = [
  {
    id: 1,
    version: "2.5.0",
    build: "250",
    releaseDate: "2026-03-20",
    size: "45.2 MB",
    downloads: 1834,
    status: "Latest",
    changes: [
      "New dark mode improvements",
      "Bug fixes and performance enhancements",
      "Added new entertainment categories",
    ],
    downloadUrl: "/chumme.apk",
  },
  {
    id: 2,
    version: "2.4.3",
    build: "243",
    releaseDate: "2026-03-10",
    size: "44.8 MB",
    downloads: 2156,
    status: "Stable",
    changes: [
      "Fixed login issues",
      "Improved community features",
      "UI/UX refinements",
    ],
    downloadUrl: "/chumme.apk",
  },
  {
    id: 3,
    version: "2.4.0",
    build: "240",
    releaseDate: "2026-02-28",
    size: "44.5 MB",
    downloads: 3421,
    status: "Archive",
    changes: [
      "Major UI overhaul",
      "New collaboration features",
      "Performance improvements",
    ],
    downloadUrl: "/chumme.apk",
  },
];

export const APK_STATS = {
  latestVersion: "2.5.0",
  totalDownloads: "7,411",
  totalVersions: "12",
  lastUpdated: "Mar 20",
};

export const INSTALL_STEPS = [
  {
    step: "1",
    title: "Download APK",
    description:
      "Click the download button to save the APK file to your device",
  },
  {
    step: "2",
    title: "Enable Installation",
    description: 'Go to Settings → Security → Enable "Unknown Sources"',
  },
  {
    step: "3",
    title: "Install & Launch",
    description:
      "Open the downloaded APK file and follow the installation prompts",
  },
];
