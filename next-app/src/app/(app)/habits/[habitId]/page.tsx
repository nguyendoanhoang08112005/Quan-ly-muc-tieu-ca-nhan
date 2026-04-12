import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, PencilLine } from "lucide-react";
import { PageEmptyState, PageHero, PageSectionTitle } from "@/components/shared/app-page-patterns";
import { buttonVariants } from "@/components/ui/button";
import { DeleteHabitForm } from "@/features/habits/components/delete-habit-form";
import { HabitLogForm } from "@/features/habits/components/habit-log-form";
import {
  buildDefaultHabitLogFormValues,
  habitFrequencyLabels,
  habitStatusClassNames,
  habitStatusLabels
} from "@/features/habits/habit-helpers";
import { habitIdSchema } from "@/features/habits/schemas/habit-schemas";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { getHabitDetailForUser } from "@/server/modules/habits/queries";

type HabitDetailPageProps = {
  params: Promise<{
    habitId: string;
  }>;
};

export default async function HabitDetailPage({
  params
}: HabitDetailPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { habitId } = await params;
  const parsedHabitId = habitIdSchema.safeParse(habitId);

  if (!parsedHabitId.success) {
    notFound();
  }

  const habit = await getHabitDetailForUser(userId, BigInt(parsedHabitId.data));

  if (!habit) {
    notFound();
  }

  const todayLog =
    habit.recentLogs.find((log) => log.logDate === buildDefaultHabitLogFormValues().logDate) ??
    null;

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <PageHero
        actions={
          <>
            <Link
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "gap-2 rounded-full"
              )}
              href={"/habits" as Route}
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại thói quen
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "secondary" }), "gap-2 rounded-full")}
              href={`/habits/${habit.id}/edit` as Route}
            >
              <PencilLine className="h-4 w-4" />
              Chỉnh sửa
            </Link>
            <DeleteHabitForm habitId={habit.id} />
          </>
        }
        aside={
          <div className="rounded-[1.45rem] border border-[#eadfd4] bg-[#fffaf6] px-4 py-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
              Ngữ cảnh
            </p>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <div className="flex items-center justify-between gap-3">
                <span>Tần suất</span>
                <span className="font-semibold text-stone-950">{habitFrequencyLabels[habit.frequency]}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Mục tiêu</span>
                <span className="font-semibold text-stone-950">{habit.goal?.title ?? "Chưa gắn"}</span>
              </div>
            </div>
          </div>
        }
        description={habit.description}
        eyebrow="Chi tiết thói quen"
        metrics={[
          { label: "Chuỗi hiện tại", value: habit.currentStreak, hint: "Streak đang giữ", tone: "bamboo" },
          { label: "Chuỗi tốt nhất", value: habit.bestStreak, hint: "Kỷ lục hiện có" },
          { label: "Log gần nhất", value: formatDisplayDateTime(habit.lastLoggedAt, "Chưa ghi nhận"), hint: "Lần cập nhật gần nhất" }
        ]}
        title={habit.title}
        trailVariant="bamboo"
      />

      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap gap-3 text-sm">
          <span
            className={cn(
              "rounded-full px-3 py-1 font-semibold",
              habitStatusClassNames[habit.status]
            )}
          >
            {habitStatusLabels[habit.status]}
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
            {habitFrequencyLabels[habit.frequency]}
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
            {habit.targetCount} {habit.unit} / chu kỳ
          </span>
          {habit.goal ? (
            <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
              {habit.goal.title}
            </span>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-600">
            Bắt đầu: {formatDisplayDate(habit.startDate)}
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-600">
            Kết thúc: {formatDisplayDate(habit.endDate)}
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-600">
            Giờ nhắc: {habit.reminderTime || "Chưa đặt"}
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr,1.1fr]">
        <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <PageSectionTitle eyebrow="Nhật ký thói quen" title="Nhật ký theo ngày" />

          <div className="mt-6">
            <HabitLogForm
              habitId={habit.id}
              initialValues={
                todayLog
                  ? {
                      logDate: todayLog.logDate,
                      completedCount: String(todayLog.completedCount),
                      note: todayLog.note ?? ""
                    }
                  : undefined
              }
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <PageSectionTitle eyebrow="Lịch sử" title="Nhật ký gần đây" />

          {habit.recentLogs.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {habit.recentLogs.map((log) => (
                <article
                  className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5"
                  key={log.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                          {formatDisplayDate(log.logDate)}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            log.isCompleted
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          )}
                        >
                          {log.isCompleted ? "Đạt mục tiêu" : "Chưa đạt"}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-semibold text-stone-950">
                        {log.completedCount}/{log.targetCountSnapshot} lần
                      </p>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {log.note ?? "Không có ghi chú cho ngày này."}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <PageEmptyState
                description="Hãy ghi nhật ký ngày đầu tiên để bắt đầu tính chuỗi liên tiếp."
                title="Chưa có nhật ký nào"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
