import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { AuthInitializer } from "@/modules/shared/components/AuthInitializer";
import { ThemeProvider } from "@/modules/shared/components/ThemeProvider";
import { QueryProvider } from "@/modules/shared/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
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
    images: [
      {
        url: "/og-image.png", // Fallback, will require a real image in public/
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chumme | Premium Social Platform",
    description:
      "Experience the next generation of social interaction with Chumme.",
    images: ["/og-image.png"], // Standardized OG image
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background-primary text-text-primary`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthInitializer>{children}</AuthInitializer>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
