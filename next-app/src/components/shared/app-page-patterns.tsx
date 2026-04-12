import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { ArrowLeft, Sparkles, type LucideIcon } from "lucide-react";
import { PawTrail } from "@/components/ornaments/paw-trail";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageMetric = {
  icon?: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "neutral" | "warm" | "bamboo" | "alert";
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  metrics?: PageMetric[];
  actions?: ReactNode;
  aside?: ReactNode;
  trailVariant?: "mixed" | "bamboo" | "stone";
  className?: string;
};

const metricToneClassNames = {
  alert: "border-[#f3d2cc] bg-[#fff7f5]",
  bamboo: "border-[#dfead8] bg-[#f8fcf5]",
  neutral: "border-[#ebe1d7] bg-white",
  warm: "border-[#efe5c8] bg-[#fffdf7]"
} as const;

export function PageHero({
  actions,
  aside,
  className,
  description,
  eyebrow,
  metrics = [],
  title,
  trailVariant = "stone"
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2.1rem] border border-[#e8dfd5] bg-white px-5 py-5 shadow-[0_20px_50px_-40px_rgba(28,25,23,0.22)]",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#fff0e7] blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-24 w-24 rounded-full bg-[#f7faf4] blur-3xl" />
      <PawTrail className="right-16 top-16 h-24 w-[14rem]" variant={trailVariant} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 rounded-[1.75rem] border border-[#eee4da] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] p-4 shadow-[0_18px_36px_-30px_rgba(28,25,23,0.22)] sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd3] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600">
              <Sparkles className="h-3.5 w-3.5" />
              {eyebrow}
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-3xl font-black tracking-tight text-stone-950">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              {description}
            </p>
          </div>

          {metrics.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div
                    className={cn(
                      "rounded-[1.35rem] border px-4 py-4 shadow-sm",
                      metricToneClassNames[metric.tone ?? "neutral"]
                    )}
                    key={metric.label}
                  >
                    <div className="flex items-center gap-2 text-stone-500">
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                        {metric.label}
                      </span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-stone-950">
                      {metric.value}
                    </div>
                    {metric.hint ? (
                      <p className="mt-1 text-xs text-stone-500">{metric.hint}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          {actions ? <div className="flex flex-wrap gap-2 xl:justify-end">{actions}</div> : null}
          {aside ? aside : null}
        </div>
      </div>
    </section>
  );
}

export function PageSectionTitle({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}

export function PageEmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
      <h2 className="text-2xl font-black text-stone-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-500">
        {description}
      </p>
      {action ? <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </section>
  );
}

export function PageFormShell({
  backHref,
  backLabel,
  children,
  description,
  eyebrow,
  title,
  maxWidthClassName = "max-w-5xl"
}: {
  backHref: string;
  backLabel: string;
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
  maxWidthClassName?: string;
}) {
  return (
    <div className={cn("mx-auto flex flex-col gap-4", maxWidthClassName)}>
      <Link
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "w-fit gap-2 rounded-full border-[#e5dbd0] bg-white"
        )}
        href={backHref as Route}
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <section className="rounded-[2rem] border border-[#e8dfd5] bg-white p-4 shadow-[0_20px_50px_-40px_rgba(28,25,23,0.22)] sm:p-5">
        <div className="rounded-[1.6rem] border border-[#eee4da] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] p-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd3] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600">
            <Sparkles className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-stone-950">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            {description}
          </p>

          <div className="mt-5 rounded-[1.7rem] border border-[#ece2d8] bg-white p-4 shadow-[0_18px_36px_-30px_rgba(28,25,23,0.18)] sm:p-5">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
