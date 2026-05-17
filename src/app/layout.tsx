import type { Metadata } from "next";

import { SiteShell } from "@/components/SiteShell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Family Memory Gallery",
  description: "An image-centered family photo memory album UI for Google Drive photos."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
