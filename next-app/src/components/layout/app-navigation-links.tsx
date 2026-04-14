"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  navigationGroups,
  primaryNavigationItems,
  secondaryNavigationGroups,
  type NavigationItem
} from "@/components/layout/navigation-items";
import { cn } from "@/lib/utils";

function isItemActive(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  if (href === "/dashboard") {
    return false;
  }

  if (href === "/tasks" && pathname.startsWith("/tasks/board")) {
    return false;
  }

  return pathname.startsWith(`${href}/`);
}

function renderNavigationItem(
  item: NavigationItem,
  active: boolean,
  variant: "sidebar" | "mobile"
) {
  return (
    <Link
      key={item.href}
      className={cn(
        variant === "sidebar"
          ? "block rounded-xl px-2.5 py-2 text-[13px] font-medium transition"
          : "inline-flex min-h-9 items-center justify-center rounded-full border px-3.5 py-2 text-sm font-semibold transition",
        active
          ? variant === "sidebar"
            ? "ui-dark-cta bg-stone-950 !text-white shadow-sm"
            : "ui-dark-cta border-stone-950 bg-stone-950 !text-white shadow-sm"
          : variant === "sidebar"
            ? "text-stone-800 hover:bg-white/80 hover:text-stone-950"
            : "border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-100 hover:text-stone-950"
      )}
      href={item.href}
    >
      {item.label}
    </Link>
  );
}

function renderSecondaryGroup(
  pathname: string,
  group: (typeof secondaryNavigationGroups)[number],
  variant: "sidebar" | "mobile"
) {
  const hasActiveItem = group.items.some((item) => isItemActive(pathname, item.href));

  return (
    <details
      className={cn(
        variant === "sidebar"
          ? "rounded-xl"
          : "rounded-[1.25rem] border border-[color:var(--border)] bg-white/80 backdrop-blur"
      )}
      key={group.id}
      open={hasActiveItem ? true : undefined}
    >
      <summary className="list-none cursor-pointer px-2.5 py-2 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-stone-700">{group.label}</p>
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-stone-400">
            {hasActiveItem ? "Mở" : `${group.items.length} mục`}
          </span>
        </div>
      </summary>

      <div className="mt-1 space-y-1 px-1 pb-1">
        {group.items.map((item) =>
          renderNavigationItem(item, isItemActive(pathname, item.href), variant)
        )}
      </div>
    </details>
  );
}

export function AppNavigationLinks({
  variant = "sidebar"
}: {
  variant?: "sidebar" | "mobile";
}) {
  const pathname = usePathname();

  if (variant === "mobile") {
    return (
      <div className="space-y-3">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {primaryNavigationItems.map((item) =>
            renderNavigationItem(item, isItemActive(pathname, item.href), variant)
          )}
        </div>

        <div className="space-y-3">
          {secondaryNavigationGroups.map((group) =>
            renderSecondaryGroup(pathname, group, variant)
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {navigationGroups.map((group) => {
        if (group.id === "primary") {
          return (
            <section className="space-y-1" key={group.id}>
              <div className="px-0.5">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-stone-400">
                  {group.label}
                </p>
              </div>

              <div className="space-y-1">
                {group.items.map((item) =>
                  renderNavigationItem(
                    item,
                    isItemActive(pathname, item.href),
                    variant
                  )
                )}
              </div>
            </section>
          );
        }

        return renderSecondaryGroup(pathname, group, variant);
      })}
    </div>
  );
}
