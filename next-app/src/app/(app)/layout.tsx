import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppMobileNav } from "@/components/layout/app-mobile-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import { HydrationSafeContent } from "@/components/providers/hydration-safe-content";
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
      <HydrationSafeContent>
        <div
          className="flex min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f6f3ee_100%)]"
          suppressHydrationWarning
        >
          <AppSidebar user={session.user} />
          <div className="flex-1">
            <AppMobileNav user={session.user} />
            <main className="px-2.5 py-3 lg:px-3 lg:py-3">{children}</main>
          </div>
        </div>
      </HydrationSafeContent>
    </AuthSessionProvider>
  );
}
