import Link from "next/link";
import { AppNavigationLinks } from "@/components/layout/app-navigation-links";
import type { AppSessionUser } from "@/lib/auth/session";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppMobileNav({ user }: { user: AppSessionUser }) {
  return (
    <div className="border-b border-stone-200 bg-white lg:hidden" suppressHydrationWarning>
      <div className="space-y-3 px-3 py-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">
              Mục tiêu cá nhân
            </p>
            <p className="mt-1 text-[11px] text-stone-500">
              Hãy bắt đầu với Mục tiêu, Công việc và Thói quen.
            </p>
            <p className="mt-2 text-sm font-semibold text-stone-900">
              {user.name}
            </p>
            <p className="text-xs text-stone-500">{user.email}</p>
          </div>

          <Link
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-full !text-white"
            )}
            href="/goals?create=1"
          >
            Tạo mục tiêu
          </Link>
        </div>

        <AppNavigationLinks variant="mobile" />

        <SignOutButton className="w-full" size="sm" />
      </div>
    </div>
  );
}
