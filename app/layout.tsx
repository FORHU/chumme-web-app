import type { Metadata, Viewport } from "next";

import "./globals.css";
import { Providers } from "@/modules/shared/providers/Providers";

import { sharedMetadata } from "./metadata";

export const metadata: Metadata = sharedMetadata;

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans antialiased bg-background-primary text-text-primary`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
