import type { Metadata } from "next";

import { SiteShell } from "@/components/SiteShell";

import "./globals.css";

export const metadata: Metadata = {
  title: "우리집 앨범",
  description: "가족사진을 보기 쉽게 모아보는 이미지 중심 앨범 UI입니다."
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
