import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

type WorkspaceViewTab = {
  active: boolean;
  count?: number;
  href: string;
  label: string;
};

export function WorkspaceViewTabs({
  tabs
}: {
  tabs: WorkspaceViewTab[];
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <Link
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition",
            tab.active
              ? "ui-dark-cta border-stone-950 bg-stone-950 !text-white"
              : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
          )}
          href={tab.href as Route}
          key={tab.href}
        >
          {tab.label}
          {typeof tab.count === "number" ? (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                tab.active ? "bg-white/15 text-white" : "bg-stone-100 text-stone-600"
              )}
            >
              {tab.count}
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
