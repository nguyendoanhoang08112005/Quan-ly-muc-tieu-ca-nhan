import Link from "next/link";
import { Compass, Plus, Sparkles, Target } from "lucide-react";
import {
  PageEmptyState,
  PageHero,
  PageSectionTitle
} from "@/components/shared/app-page-patterns";
import { buttonVariants } from "@/components/ui/button";
import { HabitCard } from "@/features/habits/components/habit-card";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
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
        <section className="space-y-4">
          <PageSectionTitle
            description="Mỗi thói quen giờ có nhịp hôm nay, chuỗi hiện tại và các thông số chính ngay trên card."
            eyebrow="Danh sách thói quen"
            title="Các nhịp bạn đang theo dõi"
          />
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
