import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppMobileNav } from "@/components/layout/app-mobile-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import { requireAuthenticatedSession } from "@/lib/auth/session";

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
  const session = await requireAuthenticatedSession();

  return (
    <AuthSessionProvider session={session}>
      <div className="flex min-h-screen bg-stone-100">
        <AppSidebar user={session.user} />
        <div className="flex-1">
          <AppMobileNav user={session.user} />
          <main className="px-4 py-6 lg:px-6 lg:py-8">{children}</main>
        </div>
      </div>
    </AuthSessionProvider>
  );
}
