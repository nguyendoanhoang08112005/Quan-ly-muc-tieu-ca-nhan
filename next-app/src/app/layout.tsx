import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quan ly muc tieu ca nhan",
  description: "Nen tang Next.js moi cho ung dung quan ly muc tieu ca nhan."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

