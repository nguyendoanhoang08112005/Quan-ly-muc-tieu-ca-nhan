import Link from "next/link";
import type { ReactNode } from "react";
import { CheckCircle2, Clock3, Compass, Flame, Plus } from "lucide-react";
import { PageEmptyState } from "@/components/shared/app-page-patterns";
import { buttonVariants } from "@/components/ui/button";
import { HabitCard } from "@/features/habits/components/habit-card";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { listHabitsForUser } from "@/server/modules/habits/queries";

function SummaryTile({
  hint,
  icon,
  label,
  tone = "neutral",
  value
}: {
  hint: string;
  icon: ReactNode;
  label: string;
  tone?: "neutral" | "success" | "warning";
  value: ReactNode;
}) {
  const toneClassNames = {
    neutral: "border-stone-200 bg-white",
    success: "border-emerald-200 bg-emerald-50",
    warning: "border-amber-200 bg-amber-50"
  } as const;

  return (
    <div className={cn("rounded-lg border px-4 py-3", toneClassNames[tone])}>
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-3xl font-black text-stone-950">{value}</div>
      <p className="mt-1 text-xs leading-5 text-stone-600">{hint}</p>
    </div>
  );
}

export default async function HabitsPage() {
  const userId = await requireAuthenticatedUserId();
  const habits = await listHabitsForUser(userId);
  const activeHabits = habits.filter((habit) => habit.status === "active");
  const completedToday = habits.filter((habit) => habit.todayLog?.isCompleted).length;
  const needsLogToday = activeHabits.filter((habit) => !habit.todayLog?.isCompleted).length;
  const bestCurrentStreak = habits.reduce(
    (best, habit) => Math.max(best, habit.currentStreak),
    0
  );

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
              Thói quen
            </p>
            <h1 className="mt-3 break-words text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              Thói quen hằng ngày
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
              Ghi nhật ký đúng ngày, xem chuỗi đang giữ và biết nhịp nào cần xử lý trước.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              className={cn(buttonVariants(), "gap-2 rounded-lg !text-white")}
              href="/habits/new"
            >
              <Plus className="h-4 w-4" />
              Tạo thói quen mới
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryTile
            hint="Tất cả thói quen đang có"
            icon={<Compass className="h-4 w-4" />}
            label="Tổng"
            value={habits.length}
          />
          <SummaryTile
            hint="Trạng thái đang theo dõi"
            icon={<Clock3 className="h-4 w-4" />}
            label="Đang theo dõi"
            tone="success"
            value={activeHabits.length}
          />
          <SummaryTile
            hint="Thói quen active chưa đạt hôm nay"
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Cần ghi"
            tone={needsLogToday > 0 ? "warning" : "success"}
            value={needsLogToday}
          />
          <SummaryTile
            hint="Chuỗi hiện tại cao nhất"
            icon={<Flame className="h-4 w-4" />}
            label="Chuỗi tốt nhất"
            value={`${bestCurrentStreak} ngày`}
          />
        </div>
      </section>

      {habits.length > 0 ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                Danh sách
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-950">
                Nhịp cần theo dõi
              </h2>
            </div>
            <p className="text-sm text-stone-500">
              {completedToday}/{habits.length} thói quen đã đạt hôm nay.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {habits.map((habit) => (
              <HabitCard habit={habit} key={habit.id} />
            ))}
          </div>
        </section>
      ) : (
        <PageEmptyState
          action={
            <Link
              className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-lg !text-white")}
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
