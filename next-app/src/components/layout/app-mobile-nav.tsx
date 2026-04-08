import Link from "next/link";
import { AppNavigationLinks } from "@/components/layout/app-navigation-links";
import type { AppSessionUser } from "@/lib/auth/session";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppMobileNav({ user }: { user: AppSessionUser }) {
  return (
    <div className="border-b border-stone-200 bg-white lg:hidden">
      <div className="space-y-4 px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-500">
              Mục tiêu cá nhân
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Hãy bắt đầu với Mục tiêu, Công việc và Thói quen.
            </p>
            <p className="mt-2 text-sm font-semibold text-stone-900">
              {user.name}
            </p>
            <p className="text-sm text-stone-500">{user.email}</p>
          </div>

          <Link
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-full !text-white"
            )}
            href="/goals/new"
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
