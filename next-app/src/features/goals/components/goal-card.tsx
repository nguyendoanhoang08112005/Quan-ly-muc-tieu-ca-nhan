import Link from "next/link";
import { ArrowRight, CalendarDays, Layers3, PawPrint } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  goalPriorityClassNames,
  goalPriorityLabels,
  goalStatusClassNames,
  goalStatusLabels,
  goalTypeLabels
} from "@/features/goals/goal-helpers";
import type { GoalListItem } from "@/features/goals/types";
import { formatDisplayDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function GoalCard({ goal }: { goal: GoalListItem }) {
  const progress = Math.min(100, Math.max(0, Math.round(goal.progress)));

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-[#e6ddd2] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d7cabb] hover:shadow-[0_22px_42px_-32px_rgba(28,25,23,0.28)]">
      <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#eef6e8] blur-3xl transition group-hover:bg-[#e3f0db]" />
      <div className="pointer-events-none absolute left-0 top-10 h-24 w-24 rounded-full bg-[#fff4ec] blur-3xl" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-600">
              {goalTypeLabels[goal.goalType]}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                goalStatusClassNames[goal.status]
              )}
            >
              {goalStatusLabels[goal.status]}
            </span>
          </div>
          <h3 className="mt-3 line-clamp-2 text-xl font-black tracking-tight text-stone-950">
            {goal.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-stone-600">
            {goal.description || "Chưa thêm mô tả cho mục tiêu này."}
          </p>
        </div>

        <span
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-semibold",
            goalPriorityClassNames[goal.priority]
          )}
        >
          {goalPriorityLabels[goal.priority]}
        </span>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="min-w-0">
          <div className="rounded-[1.6rem] border border-[#e9dfd4] bg-[linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] p-4 shadow-[0_18px_36px_-32px_rgba(28,25,23,0.18)]">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500">
                  Tiến độ hiện tại
                </p>
                <p className="mt-2 text-4xl font-black tracking-tight text-stone-950">
                  {progress}%
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
                  Quyền xem
                </p>
                <p className="mt-2 text-sm font-semibold text-stone-700">
                  {goal.isPublic ? "Công khai" : "Riêng tư"}
                </p>
              </div>
            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#f0f5eb]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#c6d8b7_0%,#86a96d_100%)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-[1.1rem] border border-[#ece3d8] bg-white px-3 py-3 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Bắt đầu</span>
                </div>
                <p className="mt-1.5 font-semibold text-stone-800">
                  {formatDisplayDate(goal.startDate, "Chưa chọn")}
                </p>
              </div>
              <div className="rounded-[1.1rem] border border-[#ece3d8] bg-white px-3 py-3 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Hạn</span>
                </div>
                <p className="mt-1.5 font-semibold text-stone-800">
                  {formatDisplayDate(goal.targetDate, "Chưa đặt")}
                </p>
              </div>
              <div className="rounded-[1.1rem] border border-[#ece3d8] bg-white px-3 py-3 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Layers3 className="h-3.5 w-3.5" />
                  <span>Nhịp</span>
                </div>
                <p className="mt-1.5 font-semibold text-stone-800">
                  {goal.milestonesCount} mốc / {goal.tasksCount} việc
                </p>
              </div>
            </div>
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
        </div>

        <aside className="rounded-[1.6rem] border border-[#efe4d9] bg-[#fffaf6] p-4 shadow-[0_16px_30px_-30px_rgba(28,25,23,0.2)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500">
            Nhịp mục tiêu
          </p>
          <div className="mt-4 space-y-3 text-sm text-stone-700">
            <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-[#efe3d7] bg-white px-3 py-2.5">
              <span>Cột mốc</span>
              <span className="font-semibold text-stone-950">{goal.milestonesCount}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-[#efe3d7] bg-white px-3 py-2.5">
              <span>Công việc</span>
              <span className="font-semibold text-stone-950">{goal.tasksCount}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-[#efe3d7] bg-white px-3 py-2.5">
              <span>Ưu tiên</span>
              <span className="font-semibold text-stone-950">{goalPriorityLabels[goal.priority]}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-[#efe3d7] bg-white px-3 py-2.5">
              <span>Trạng thái</span>
              <span className="font-semibold text-stone-950">{goalStatusLabels[goal.status]}</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
          <PawPrint className="h-3.5 w-3.5 text-[#7da066]" />
          Mở mục tiêu để tiếp tục theo cột mốc
        </span>
        <Link
          className={cn(
            buttonVariants({ size: "sm", variant: "secondary" }),
            "gap-1.5 rounded-full border-[#e1ebd8] bg-[#f7fbf4] text-[#557046] hover:bg-[#eef6e8]"
          )}
          href={`/goals/${goal.id}`}
        >
          Xem chi tiết
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
