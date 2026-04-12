import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Compass, Plus, Sparkles, Target } from "lucide-react";
import {
  PageEmptyState,
  PageHero
} from "@/components/shared/app-page-patterns";
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
    <div className="flex w-full max-w-none flex-col gap-4">
      <PageHero
        actions={
          <Link
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-2 rounded-full !text-white"
            )}
            href="/habits/new"
          >
            <Plus className="h-4 w-4" />
            Tạo thói quen mới
          </Link>
        }
        aside={
          <div className="rounded-[1.45rem] border border-[#eadfd4] bg-[#fffaf6] px-4 py-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
              Nhịp hôm nay
            </p>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <div className="flex items-center justify-between gap-3">
                <span>Đã đạt</span>
                <span className="font-semibold text-stone-950">{completedToday}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Đang thực hiện</span>
                <span className="font-semibold text-stone-950">{activeHabits.length}</span>
              </div>
            </div>
          </div>
        }
        description="Theo dõi nhịp nhỏ mỗi ngày, giữ streak và xem lại nhật ký theo từng thói quen."
        eyebrow="Thói quen"
        metrics={[
          { icon: Compass, label: "Tổng thói quen", value: habits.length, hint: "Tất cả đang có" },
          { icon: Target, label: "Đang thực hiện", value: activeHabits.length, tone: "bamboo", hint: "Trạng thái active" },
          { icon: Sparkles, label: "Đạt hôm nay", value: completedToday, tone: "warm", hint: "Đã hoàn thành mục tiêu ngày" }
        ]}
        title="Thói quen và nhật ký hằng ngày"
        trailVariant="bamboo"
      />

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
                  Log gần nhất: {formatDisplayDateTime(habit.lastLoggedAt, "Chưa ghi nhận")}
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
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "gap-2 rounded-full !text-white"
                  )}
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
        <PageEmptyState
          action={
            <Link
              className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-full !text-white")}
              href="/habits/new"
            >
              <Plus className="h-4 w-4" />
              Tạo thói quen mới
            </Link>
          }
          description="Tạo thói quen đầu tiên để bắt đầu theo dõi chuỗi liên tiếp và nhật ký theo ngày."
          title="Chưa có thói quen nào"
        />
      )}
    </div>
  );
}
