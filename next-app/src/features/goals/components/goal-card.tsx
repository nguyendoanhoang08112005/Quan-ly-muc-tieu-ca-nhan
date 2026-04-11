import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Layers3, PawPrint } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  goalPriorityLabels,
  goalStatusClassNames,
  goalStatusLabels,
  goalTypeLabels
} from "@/features/goals/goal-helpers";
import type { GoalListItem } from "@/features/goals/types";
import { formatDisplayDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function GoalCard({ goal }: { goal: GoalListItem }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-[#e6ddd2] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d7cabb] hover:shadow-[0_18px_34px_-28px_rgba(28,25,23,0.28)]">
      <div className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full bg-[#eef6e8] blur-2xl transition group-hover:bg-[#e3f0db]" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-600">
              {goalTypeLabels[goal.goalType]}
            </span>
            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-stone-600">
              {Math.round(goal.progress)}%
            </span>
          </div>
          <h3 className="mt-2.5 line-clamp-2 text-base font-semibold tracking-tight text-stone-950">
            {goal.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-stone-600">
            {goal.description}
          </p>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f2f6ee]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#c6d8b7_0%,#86a96d_100%)]"
          style={{ width: `${Math.min(100, Math.max(0, Math.round(goal.progress)))}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
            goalStatusClassNames[goal.status]
          )}
        >
          {goalStatusLabels[goal.status]}
        </span>
        <span className="rounded-full border border-[#e1ebd8] bg-[#f7fbf4] px-2.5 py-1 text-[11px] font-semibold text-[#62814f]">
          {goalPriorityLabels[goal.priority]}
        </span>
        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
          {goal.isPublic ? "Công khai" : "Riêng tư"}
        </span>
      </div>

      {goal.category || goal.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {goal.category ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
              <span
                className="h-2 w-2 rounded-full bg-stone-400"
                style={{
                  backgroundColor: goal.category.color ?? undefined
                }}
              />
              {goal.category.name}
            </span>
          ) : null}
          {goal.tags.slice(0, 3).map((tag) => (
            <span
              className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600"
              key={tag.id}
            >
              <span
                className="h-2 w-2 rounded-full bg-stone-400"
                style={{
                  backgroundColor: tag.color ?? undefined
                }}
              />
              #{tag.name}
            </span>
          ))}
          {goal.tags.length > 3 ? (
            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-500">
              +{goal.tags.length - 3} thẻ
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-stone-500">
        <div className="rounded-[1rem] border border-[#e6ddd2] bg-[#fffdfa] px-3 py-2">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Hạn</span>
          </div>
          <p className="mt-1 font-semibold text-stone-800">{formatDisplayDate(goal.targetDate)}</p>
        </div>
        <div className="rounded-[1rem] border border-[#e6ddd2] bg-[#fffdfa] px-3 py-2">
          <div className="flex items-center gap-1.5">
            <Layers3 className="h-3.5 w-3.5" />
            <span>Cột mốc</span>
          </div>
          <p className="mt-1 font-semibold text-stone-800">{goal.milestonesCount}</p>
        </div>
        <div className="rounded-[1rem] border border-[#e6ddd2] bg-[#fffdfa] px-3 py-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Công việc</span>
          </div>
          <p className="mt-1 font-semibold text-stone-800">{goal.tasksCount}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
          <PawPrint className="h-3.5 w-3.5 text-[#7da066]" />
          Xem chi tiết để đi tiếp
        </span>
        <Link
          className={cn(
            buttonVariants({ size: "sm", variant: "secondary" }),
            "gap-1.5 rounded-full border-[#e1ebd8] bg-[#f7fbf4] text-[#557046] hover:bg-[#eef6e8]"
          )}
          href={`/goals/${goal.id}`}
        >
          Xem
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
