import type { Metadata } from "next";
import { getAppBaseUrl } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getAppBaseUrl(),
  title: {
    default: "Quan ly muc tieu ca nhan",
    template: "%s | Quan ly muc tieu ca nhan"
  },
  description: "Nen tang Next.js moi cho ung dung quan ly muc tieu ca nhan.",
  applicationName: "Quan ly muc tieu ca nhan",
  openGraph: {
    title: "Quan ly muc tieu ca nhan",
    description: "Nen tang Next.js moi cho ung dung quan ly muc tieu ca nhan.",
    siteName: "Quan ly muc tieu ca nhan",
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
