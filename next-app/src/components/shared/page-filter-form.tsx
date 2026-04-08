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
  resetHref,
  resultLabel,
  searchPlaceholder,
  searchValue
}: {
  filters: FilterGroup[];
  resetHref: string;
  resultLabel: string;
  searchPlaceholder: string;
  searchValue: string;
}) {
  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm">
      <form className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr),repeat(2,minmax(0,0.8fr)),auto]" method="get">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
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
          <label className="block" key={filter.name}>
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {filter.label}
            </span>
            <select
              className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
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

        <div className="flex flex-wrap items-end gap-3 lg:justify-end">
          <button
            className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
            type="submit"
          >
            Áp dụng
          </button>
          <Link
            className={cn(
              buttonVariants({ size: "lg", variant: "secondary" }),
              "rounded-full"
            )}
            href={resetHref as Route}
          >
            Xóa lọc
          </Link>
        </div>
      </form>

      <p className="mt-4 text-sm text-stone-500">{resultLabel}</p>
    </section>
  );
}
