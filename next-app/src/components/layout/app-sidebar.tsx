import type { AppSessionUser } from "@/lib/auth/session";
import { AppNavigationLinks } from "@/components/layout/app-navigation-links";
import { SignOutButton } from "@/components/layout/sign-out-button";

export function AppSidebar({ user }: { user: AppSessionUser }) {
  return (
    <aside
      className="sticky top-0 hidden h-screen w-48 shrink-0 overflow-y-auto border-r border-stone-200 bg-stone-50/90 lg:block"
      suppressHydrationWarning
    >
      <div className="border-b border-stone-200 px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-xs font-black text-white">
            M
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-black tracking-tight text-black">
              Mục tiêu cá nhân
            </h2>
          </div>
        </div>
      </div>

      <nav className="p-2.5">
        <AppNavigationLinks />
      </nav>

      <div className="mt-auto border-t border-stone-200 px-2.5 py-2.5">
        <div className="mb-2 min-w-0">
          <p className="truncate text-sm font-medium text-stone-700">
            {user.name}
          </p>
        </div>

        <SignOutButton className="!w-auto rounded-md px-2.5" size="sm" variant="ghost" />
      </div>
    </aside>
  );
}
