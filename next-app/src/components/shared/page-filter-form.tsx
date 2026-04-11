import Link from "next/link";
import type { Route } from "next";
import { Search, SlidersHorizontal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FilterOption = {
  label: string;
  value: string;
};

type FilterGroup = {
  label: string;
  name: string;
  options: FilterOption[];
  value: string;
};

export function PageFilterForm({
  filters,
  hiddenFields = [],
  resetHref,
  resultLabel,
  searchPlaceholder,
  searchValue
}: {
  filters: FilterGroup[];
  hiddenFields?: Array<{
    name: string;
    value: string;
  }>;
  resetHref: string;
  resultLabel: string;
  searchPlaceholder: string;
  searchValue: string;
}) {
  return (
    <section className="ui-toolbar-panel p-3.5">
      <form className="flex flex-wrap items-end gap-3" method="get">
        {hiddenFields.map((field) => (
          <input key={field.name} name={field.name} type="hidden" value={field.value} />
        ))}

        <label className="min-w-[14rem] flex-1">
          <span className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500">
            <Search className="h-3.5 w-3.5" />
            Tìm nhanh
          </span>
          <Input
            defaultValue={searchValue}
            name="q"
            placeholder={searchPlaceholder}
          />
        </label>

        {filters.map((filter) => (
          <label className="min-w-[12rem] flex-1 sm:max-w-[14rem]" key={filter.name}>
            <span className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {filter.label}
            </span>
            <select
              className="h-10 w-full rounded-xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
              defaultValue={filter.value}
              name={filter.name}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}

        <div className="ml-auto flex flex-wrap items-end gap-2">
          <button
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-full !text-white"
            )}
            type="submit"
          >
            Áp dụng
          </button>
          <Link
            className={cn(
              buttonVariants({ size: "sm", variant: "secondary" }),
              "rounded-full"
            )}
            href={resetHref as Route}
          >
            Xóa lọc
          </Link>
        </div>
      </form>

      <p className="mt-2 text-xs text-stone-500">{resultLabel}</p>
    </section>
  );
}
