import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-100">
      <AppSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

