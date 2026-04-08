import Link from "next/link";
import type { Route } from "next";
import type { AppSessionUser } from "@/lib/auth/session";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard" as Route, label: "Dashboard" },
  { href: "/goals" as Route, label: "Goals" },
  { href: "/follows" as Route, label: "Follows" },
  { href: "/tasks" as Route, label: "Tasks" },
  { href: "/projects" as Route, label: "Projects" },
  { href: "/habits" as Route, label: "Habits" },
  { href: "/notes" as Route, label: "Notes" },
  { href: "/pomodoro" as Route, label: "Pomodoro" },
  { href: "/notifications" as Route, label: "Notifications" },
  { href: "/categories" as Route, label: "Categories" },
  { href: "/tags" as Route, label: "Tags" },
  { href: "/settings/profile" as Route, label: "Settings" }
];

export function AppSidebar({ user }: { user: AppSessionUser }) {
  return (
    <aside className="sticky top-0 hidden min-h-screen w-72 shrink-0 border-r-4 border-black bg-white lg:block">
      <div className="border-b-4 border-black p-6">
        <div className="flex h-12 w-12 items-center justify-center bg-black text-xl font-black text-white">
          M
        </div>
        <h2 className="mt-4 text-lg font-black uppercase tracking-tight text-black">
          Muc tieu ca nhan
        </h2>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          NextAuth credentials session
        </p>
      </div>

      <div className="border-b border-stone-200 px-4 py-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-500">
          Dang nhap boi
        </p>
        <p className="mt-3 text-sm font-semibold text-stone-900">{user.name}</p>
        <p className="mt-1 text-sm text-stone-500">{user.email}</p>
      </div>

      <nav className="space-y-2 p-4">
        {items.map((item) => (
          <Link
            key={item.href}
            className="block rounded-2xl px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="space-y-3 p-4">
        <Link
          className={cn(
            buttonVariants({ size: "sm" }),
            "w-full rounded-2xl text-center"
          )}
          href="/goals/new"
        >
          Tao goal moi
        </Link>
        <SignOutButton />
      </div>
    </aside>
  );
}
