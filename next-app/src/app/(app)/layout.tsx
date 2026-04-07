import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getServerAuthSession } from "@/lib/auth/session";

export default async function AppLayout({
  children
}: {
  children: ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-stone-100">
      <AppSidebar user={session.user} />
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
