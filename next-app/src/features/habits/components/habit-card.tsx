import Link from "next/link";
import type { Route } from "next";
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

export function HabitCard({ habit }: { habit: HabitListItem }) {
  const todaySummary = habit.todayLog
    ? `${habit.todayLog.completedCount}/${habit.todayLog.targetCountSnapshot} ${habit.unit}`
    : `0/${habit.targetCount} ${habit.unit}`;

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d8d8d8] hover:shadow-[0_20px_36px_-30px_rgba(28,25,23,0.22)]">
      <div className="pointer-events-none absolute -right-8 top-0 h-28 w-28 rounded-full bg-[#eef6e8] blur-3xl transition group-hover:bg-[#e4f0dc]" />
      <div className="pointer-events-none absolute left-0 top-8 h-20 w-20 rounded-full bg-[#fff5ed] blur-3xl" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                habitStatusClassNames[habit.status]
              )}
            >
              {habitStatusLabels[habit.status]}
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
              {habitFrequencyLabels[habit.frequency]}
            </span>
            {habit.goal ? (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                {habit.goal.title}
              </span>
            ) : null}
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-stone-950">
            {habit.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {habit.description || "Chưa thêm mô tả cho thói quen này."}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-[#ebe1d7] bg-[#fffdfa] px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
                <Target className="h-3.5 w-3.5" />
                Mục tiêu chu kỳ
              </div>
              <p className="mt-2 text-sm font-semibold text-stone-900">
                {habit.targetCount} {habit.unit}
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-[#ebe1d7] bg-[#fffdfa] px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
                <AlarmClock className="h-3.5 w-3.5" />
                Nhắc việc
              </div>
              <p className="mt-2 text-sm font-semibold text-stone-900">
                {habit.reminderTime || "Chưa đặt"}
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-[#ebe1d7] bg-[#fffdfa] px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
                <Flame className="h-3.5 w-3.5" />
                Chuỗi tốt nhất
              </div>
              <p className="mt-2 text-sm font-semibold text-stone-900">{habit.bestStreak} ngày</p>
            </div>

            <div className="rounded-[1.2rem] border border-[#ebe1d7] bg-[#fffdfa] px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
                <CalendarDays className="h-3.5 w-3.5" />
                Log gần nhất
              </div>
              <p className="mt-2 text-sm font-semibold text-stone-900">
                {formatDisplayDateTime(habit.lastLoggedAt, "Chưa ghi")}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[1.45rem] border border-[#e8e0d6] bg-stone-50 px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500">
                  Nhịp hôm nay
                </p>
                <p className="mt-2 text-2xl font-black tracking-tight text-stone-950">
                  {todaySummary}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  habit.todayLog?.isCompleted
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-stone-100 text-stone-700"
                )}
              >
                {habit.todayLog?.isCompleted ? "Đã đạt hôm nay" : "Chưa đạt hôm nay"}
              </span>
            </div>
            <p className="mt-3 text-sm text-stone-600">
              {habit.todayLog
                ? `Đã ghi nhận trong ngày. Bắt đầu từ ${formatDisplayDate(habit.startDate, "hôm nay")}.`
                : "Hôm nay chưa có log nào. Vào chi tiết để ghi nhanh trong ngày."}
            </p>
          </div>
        </div>

        <aside className="rounded-[1.6rem] border border-[#dfead8] bg-[#f8fcf5] p-4 shadow-[0_16px_30px_-30px_rgba(28,25,23,0.18)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500">
            Chuỗi hiện tại
          </p>
          <div className="mt-3 text-5xl font-black tracking-tight text-stone-950">
            {habit.currentStreak}
          </div>
          <p className="mt-1 text-sm text-stone-600">ngày liên tiếp</p>

          <div className="mt-4 space-y-3 text-sm text-stone-700">
            <div className="rounded-[1rem] border border-[#dfe8d8] bg-white px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span>Bắt đầu</span>
                <span className="font-semibold text-stone-950">
                  {formatDisplayDate(habit.startDate, "Hôm nay")}
                </span>
              </div>
            </div>
            <div className="rounded-[1rem] border border-[#dfe8d8] bg-white px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span>Kết thúc</span>
                <span className="font-semibold text-stone-950">
                  {formatDisplayDate(habit.endDate, "Chưa đặt")}
                </span>
              </div>
            </div>
            <div className="rounded-[1rem] border border-[#dfe8d8] bg-white px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span>Nhịp</span>
                <span className="font-semibold text-stone-950">{habitFrequencyLabels[habit.frequency]}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#7da066]" />
          Vào chi tiết để log và xem lịch sử
        </span>
        <Link
          className={cn(
            buttonVariants({ size: "sm", variant: "secondary" }),
            "gap-2 rounded-full border-[#dfead8] bg-[#f7fbf4] text-[#557046] hover:bg-[#eef6e8]"
          )}
          href={`/habits/${habit.id}` as Route}
        >
          Xem chi tiết
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
