import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import {
  AlarmClock,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Flame,
  Target
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  habitFrequencyLabels,
  habitStatusClassNames,
  habitStatusLabels
} from "@/features/habits/habit-helpers";
import type { HabitListItem } from "@/features/habits/types";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";

function getTodayProgress(habit: HabitListItem) {
  const completedCount = habit.todayLog?.completedCount ?? 0;
  const targetCount = habit.todayLog?.targetCountSnapshot ?? habit.targetCount;

  if (targetCount <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((completedCount / targetCount) * 100));
}

function StatItem({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0 border-t border-stone-100 pt-3">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
        {icon}
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-semibold text-stone-950">
        {value}
      </div>
    </div>
  );
}

export function HabitCard({ habit }: { habit: HabitListItem }) {
  const todaySummary = habit.todayLog
    ? `${habit.todayLog.completedCount}/${habit.todayLog.targetCountSnapshot} ${habit.unit}`
    : `0/${habit.targetCount} ${habit.unit}`;
  const todayProgress = getTodayProgress(habit);
  const completedToday = Boolean(habit.todayLog?.isCompleted);
  const detailHref = `/habits/${habit.id}` as Route;

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300 hover:shadow-md sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_12rem]">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span
              className={cn(
                "rounded-md px-2.5 py-1",
                habitStatusClassNames[habit.status]
              )}
            >
              {habitStatusLabels[habit.status]}
            </span>
            <span className="rounded-md bg-stone-100 px-2.5 py-1 text-stone-700">
              {habitFrequencyLabels[habit.frequency]}
            </span>
            {habit.goal ? (
              <span className="max-w-full break-words rounded-md bg-stone-100 px-2.5 py-1 text-stone-700">
                {habit.goal.title}
              </span>
            ) : null}
          </div>

          <h2 className="mt-4 break-words text-2xl font-black tracking-tight text-stone-950">
            {habit.title}
          </h2>
          <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-stone-600">
            {habit.description || "Chưa có mô tả."}
          </p>
        </div>

        <aside className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            <Flame className="h-4 w-4" />
            Chuỗi hiện tại
          </div>
          <p className="mt-2 text-4xl font-black tracking-tight text-stone-950">
            {habit.currentStreak}
          </p>
          <p className="text-sm font-medium text-stone-600">ngày liên tiếp</p>
        </aside>
      </div>

      <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
              Hôm nay
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight text-stone-950">
              {todaySummary}
            </p>
          </div>
          <span
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-semibold",
              completedToday
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            )}
          >
            {completedToday ? "Đã đạt" : "Cần ghi"}
          </span>
        </div>
        <div
          aria-label={`Tiến độ hôm nay ${todayProgress}%`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={todayProgress}
          className="mt-3 h-2 overflow-hidden rounded bg-white"
          role="progressbar"
        >
          <div
            className={cn(
              "h-full rounded",
              completedToday ? "bg-emerald-500" : "bg-stone-950"
            )}
            style={{ width: `${todayProgress}%` }}
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          {habit.todayLog
            ? `Đã ghi nhận hôm nay. Bắt đầu từ ${formatDisplayDate(habit.startDate, "hôm nay")}.`
            : "Chưa có nhật ký hôm nay."}
        </p>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatItem
          icon={<Target className="h-3.5 w-3.5" />}
          label="Mục tiêu"
          value={`${habit.targetCount} ${habit.unit}`}
        />
        <StatItem
          icon={<AlarmClock className="h-3.5 w-3.5" />}
          label="Giờ nhắc"
          value={habit.reminderTime || "Chưa đặt"}
        />
        <StatItem
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          label="Tốt nhất"
          value={`${habit.bestStreak} ngày`}
        />
        <StatItem
          icon={<CalendarDays className="h-3.5 w-3.5" />}
          label="Gần nhất"
          value={formatDisplayDateTime(habit.lastLoggedAt, "Chưa ghi")}
        />
      </dl>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4">
        <span className="text-xs font-medium text-stone-500">
          {completedToday ? "Xem lịch sử để giữ nhịp ổn định." : "Ghi hôm nay để giữ chuỗi."}
        </span>
        <Link
          className={cn(
            buttonVariants({
              size: "sm",
              variant: completedToday ? "secondary" : "default"
            }),
            "gap-2 rounded-lg",
            completedToday ? "border-stone-200 bg-white" : "!text-white"
          )}
          href={completedToday ? detailHref : (`/habits/${habit.id}#habit-log` as Route)}
        >
          {completedToday ? "Xem chi tiết" : "Ghi nhật ký"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
