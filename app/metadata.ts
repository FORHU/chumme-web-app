import process from "node:process";

import type { Metadata } from "next";

export const sharedMetadata: Metadata = {
  title: {
    template: "%s | Chumme",
    default: "Chumme | Premium Social Platform",
  },
  description:
    "Experience the next generation of social interaction with Chumme. A premium mobile and web ecosystem.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.chumme.app",
  ),
  openGraph: {
    title: "Chumme | Premium Social Platform",
    description:
      "Experience the next generation of social interaction with Chumme.",
    url: "https://www.chumme.app",
    siteName: "Chumme",
    images: "/og-image.png",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chumme | Premium Social Platform",
    description:
      "Experience the next generation of social interaction with Chumme.",
    images: "/og-image.png",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};
