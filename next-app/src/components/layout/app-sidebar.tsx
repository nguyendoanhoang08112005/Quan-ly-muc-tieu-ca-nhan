import Link from "next/link";
import type { AppSessionUser } from "@/lib/auth/session";
import { AppNavigationLinks } from "@/components/layout/app-navigation-links";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppSidebar({ user }: { user: AppSessionUser }) {
  return (
    <aside
      className="sticky top-0 hidden h-screen w-60 shrink-0 overflow-y-auto border-r border-stone-200 bg-stone-50/70 lg:block"
      suppressHydrationWarning
    >
      <div className="border-b border-stone-200 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-base font-black text-white">
          M
        </div>
        <h2 className="mt-3 text-base font-black uppercase tracking-tight text-black">
          Mục tiêu cá nhân
        </h2>
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600">
          Đi theo 3 mục chính trước
        </p>
      </div>

      <div className="border-b border-stone-200 px-4 py-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-stone-600">
          Đăng nhập bởi
        </p>
        <p className="mt-2 text-sm font-semibold text-stone-900">{user.name}</p>
        <p className="mt-1 text-xs text-stone-600">{user.email}</p>
      </div>

      <nav className="p-3">
        <AppNavigationLinks />
      </nav>

      <div className="space-y-2.5 p-3">
        <Link
          className={cn(
            buttonVariants({ size: "sm" }),
            "w-full rounded-xl text-center !text-white"
          )}
          href="/goals/new"
        >
          Tạo mục tiêu mới
        </Link>
        <SignOutButton />
      </div>
    </aside>
  );
}
