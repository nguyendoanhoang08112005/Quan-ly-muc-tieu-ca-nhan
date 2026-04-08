import Link from "next/link";
import type { AppSessionUser } from "@/lib/auth/session";
import { AppNavigationLinks } from "@/components/layout/app-navigation-links";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppSidebar({ user }: { user: AppSessionUser }) {
  return (
    <aside className="sticky top-0 hidden min-h-screen w-72 shrink-0 border-r-4 border-black bg-white lg:block">
      <div className="border-b-4 border-black p-6">
        <div className="flex h-12 w-12 items-center justify-center bg-black text-xl font-black text-white">
          M
        </div>
        <h2 className="mt-4 text-lg font-black uppercase tracking-tight text-black">
          Mục tiêu cá nhân
        </h2>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          Phiên xác thực hiện tại
        </p>
      </div>

      <div className="border-b border-stone-200 px-4 py-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-500">
          Đăng nhập bởi
        </p>
        <p className="mt-3 text-sm font-semibold text-stone-900">{user.name}</p>
        <p className="mt-1 text-sm text-stone-500">{user.email}</p>
      </div>

      <nav className="space-y-2 p-4">
        <AppNavigationLinks />
      </nav>

      <div className="space-y-3 p-4">
        <Link
          className={cn(
            buttonVariants({ size: "sm" }),
            "w-full rounded-2xl text-center"
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
