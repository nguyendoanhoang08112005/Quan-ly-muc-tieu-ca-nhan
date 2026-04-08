import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function AppLayout({
  children
}: {
  children: ReactNode;
}) {
  const user = await requireAuthenticatedUser();

  return (
    <div className="flex min-h-screen bg-stone-100">
      <AppSidebar user={user} />
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
