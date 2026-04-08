import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  habitFrequencyLabels,
  habitStatusClassNames,
  habitStatusLabels
} from "@/features/habits/habit-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { listHabitsForUser } from "@/server/modules/habits/queries";

export default async function HabitsPage() {
  const userId = await requireAuthenticatedUserId();
  const habits = await listHabitsForUser(userId);
  const activeHabits = habits.filter((habit) => habit.status === "active");
  const completedToday = habits.filter((habit) => habit.todayLog?.isCompleted).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
              Thói quen và nhật ký hằng ngày
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Mô-đun này đưa bộ theo dõi thói quen lên hệ mới với nhật ký theo
              ngày, chuỗi liên tiếp và liên kết mục tiêu khi cần.
            </p>
          </div>

          <Link
            className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-full")}
            href="/habits/new"
          >
            <Plus className="h-4 w-4" />
            Tạo thói quen mới
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Tổng thói quen
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {habits.length}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Đang thực hiện
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {activeHabits.length}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Đã đạt mục tiêu hôm nay
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {completedToday}
            </div>
          </div>
        </div>
      </section>

      {habits.length > 0 ? (
        <section className="grid gap-6 lg:grid-cols-2">
          {habits.map((habit) => (
            <article
              className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
              key={habit.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
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
                  <h2 className="mt-4 text-2xl font-black text-stone-950">
                    {habit.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {habit.description}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Chuỗi
                  </div>
                  <div className="text-2xl font-black text-emerald-900">
                    {habit.currentStreak}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-stone-600 sm:grid-cols-2">
                <div>
                  Mục tiêu: {habit.targetCount} {habit.unit} / chu kỳ
                </div>
                <div>
                  Chuỗi tốt nhất: {habit.bestStreak}
                </div>
                <div>
                  Nhắc: {habit.reminderTime || "Chưa đặt"}
                </div>
                <div>
                  Log gần nhất: {formatDisplayDateTime(habit.lastLoggedAt)}
                </div>
                <div>
                  Bắt đầu: {formatDisplayDate(habit.startDate)}
                </div>
                <div>
                  Kết thúc: {formatDisplayDate(habit.endDate)}
                </div>
              </div>

              {habit.todayLog ? (
                <div className="mt-5 rounded-[1.5rem] border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-600">
                  Hôm nay: {habit.todayLog.completedCount}/
                  {habit.todayLog.targetCountSnapshot} {habit.unit}
                  {habit.todayLog.isCompleted ? " | Đã đạt mục tiêu" : " | Chưa đạt mục tiêu"}
                </div>
              ) : (
                <div className="mt-5 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-4 py-4 text-sm text-stone-500">
                  Hôm nay chưa có nhật ký thói quen.
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-5">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
                  Mô-đun thói quen
                </span>
                <Link
                  className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-full")}
                  href={`/habits/${habit.id}` as Route}
                >
                  Xem chi tiết
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
          <h2 className="text-2xl font-black text-stone-950">
            Chưa có thói quen nào trên hệ mới
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-500">
            Tạo thói quen đầu tiên để bắt đầu theo dõi chuỗi liên tiếp và nhật ký theo ngày.
          </p>
        </section>
      )}
    </div>
  );
}
