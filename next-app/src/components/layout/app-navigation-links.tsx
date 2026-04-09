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
          ? "block rounded-xl px-3 py-2.5 text-[13px] font-semibold transition"
          : "inline-flex min-h-9 items-center justify-center rounded-full border px-3.5 py-2 text-sm font-semibold transition",
        active
          ? variant === "sidebar"
            ? "ui-dark-cta bg-stone-950 !text-white"
            : "ui-dark-cta border-stone-950 bg-stone-950 !text-white"
          : variant === "sidebar"
            ? "text-stone-800 hover:bg-stone-100 hover:text-stone-950"
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
        "rounded-xl border border-stone-200 bg-white",
        variant === "mobile" ? "bg-white" : ""
      )}
      key={group.id}
      open={hasActiveItem ? true : undefined}
    >
      <summary className="list-none cursor-pointer px-3 py-3 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-stone-950">{group.label}</p>
          </div>
          <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">
            {hasActiveItem ? "Đang mở" : "Mở khi cần"}
          </span>
        </div>
      </summary>

      <div className="space-y-1.5 border-t border-stone-200 px-2.5 py-2.5">
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
    <div className="space-y-3">
      {navigationGroups.map((group) => {
        if (group.id === "primary") {
          return (
            <section className="space-y-1.5" key={group.id}>
              <div className="px-1">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-stone-400">
                  {group.label}
                </p>
              </div>

              <div className="space-y-1.5">
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
