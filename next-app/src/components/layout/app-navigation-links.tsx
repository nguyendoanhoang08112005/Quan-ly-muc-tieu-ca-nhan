"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/components/layout/navigation-items";
import { cn } from "@/lib/utils";

function isItemActive(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  if (href === "/dashboard") {
    return false;
  }

  return pathname.startsWith(`${href}/`);
}

export function AppNavigationLinks({
  variant = "sidebar"
}: {
  variant?: "sidebar" | "mobile";
}) {
  const pathname = usePathname();

  return (
    <>
      {navigationItems.map((item) => {
        const active = isItemActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            className={cn(
              variant === "sidebar"
                ? "block rounded-2xl px-4 py-3 text-sm font-semibold transition"
                : "inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition",
              active
                ? variant === "sidebar"
                  ? "ui-dark-cta bg-stone-950 !text-white shadow-sm"
                  : "ui-dark-cta border-stone-950 bg-stone-950 !text-white shadow-sm"
                : variant === "sidebar"
                  ? "text-stone-800 hover:bg-stone-100 hover:text-stone-950"
                  : "border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-100 hover:text-stone-950"
            )}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
