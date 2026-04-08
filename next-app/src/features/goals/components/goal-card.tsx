import Link from "next/link";
import { ArrowRight, CalendarDays, Flag } from "lucide-react";
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
    <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-600">
            {goalTypeLabels[goal.goalType]}
          </div>
          <h3 className="mt-4 text-2xl font-black tracking-tight text-stone-950">
            {goal.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
            {goal.description}
          </p>
        </div>

        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-right">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Tiến độ
          </div>
          <div className="text-2xl font-black text-amber-900">
            {Math.round(goal.progress)}%
          </div>
        </div>
      </div>

      <div className="mt-5 h-2 rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
          style={{ width: `${goal.progress}%` }}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            goalStatusClassNames[goal.status]
          )}
        >
          {goalStatusLabels[goal.status]}
        </span>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
          {goalPriorityLabels[goal.priority]}
        </span>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
          {goal.isPublic ? "Công khai" : "Riêng tư"}
        </span>
      </div>

      {goal.category || goal.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {goal.category ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
              <span
                className="h-2.5 w-2.5 rounded-full bg-stone-400"
                style={{
                  backgroundColor: goal.category.color ?? undefined
                }}
              />
              {goal.category.name}
            </span>
          ) : null}
          {goal.tags.slice(0, 3).map((tag) => (
            <span
              className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600"
              key={tag.id}
            >
              <span
                className="h-2.5 w-2.5 rounded-full bg-stone-400"
                style={{
                  backgroundColor: tag.color ?? undefined
                }}
              />
              #{tag.name}
            </span>
          ))}
          {goal.tags.length > 3 ? (
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
              +{goal.tags.length - 3} thẻ
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 text-sm text-stone-600 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Hạn mục tiêu: {formatDisplayDate(goal.targetDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4" />
          <span>
            {goal.milestonesCount} cột mốc • {goal.tasksCount} công việc
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-5">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
          Mô-đun mục tiêu
        </span>
        <Link
          className={cn(
            buttonVariants({ size: "sm" }),
            "gap-2 rounded-full !text-white"
          )}
          href={`/goals/${goal.id}`}
          style={{ color: "#ffffff" }}
        >
          Xem chi tiết
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
