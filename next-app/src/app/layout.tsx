import type { Metadata } from "next";
import { getAppBaseUrl } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getAppBaseUrl(),
  title: {
    default: "Quản lý mục tiêu cá nhân",
    template: "%s | Quản lý mục tiêu cá nhân"
  },
  description: "Nền tảng Next.js mới cho ứng dụng quản lý mục tiêu cá nhân.",
  applicationName: "Quản lý mục tiêu cá nhân",
  openGraph: {
    title: "Quản lý mục tiêu cá nhân",
    description: "Nền tảng Next.js mới cho ứng dụng quản lý mục tiêu cá nhân.",
    siteName: "Quản lý mục tiêu cá nhân",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="vi">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
