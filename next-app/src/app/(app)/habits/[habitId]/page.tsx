import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, PencilLine } from "lucide-react";
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
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "gap-2 rounded-full"
            )}
            href={"/habits" as Route}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lai habits
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
              href={`/habits/${habit.id}/edit` as Route}
            >
              <PencilLine className="h-4 w-4" />
              Chinh sua
            </Link>
            <DeleteHabitForm habitId={habit.id} />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
              Habit detail
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-stone-950">
              {habit.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              {habit.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
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
                {habit.targetCount} {habit.unit} / chu ky
              </span>
              {habit.goal ? (
                <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                  {habit.goal.title}
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:w-[460px] lg:grid-cols-1">
            <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
                Current streak
              </div>
              <div className="mt-2 text-4xl font-black">{habit.currentStreak}</div>
            </div>
            <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                  Best streak
                </div>
                <div className="mt-2 text-3xl font-black text-stone-950">
                  {habit.bestStreak}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                  Log gần nhất
                </div>
                <div className="mt-2 text-sm font-black text-stone-950">
                  {formatDisplayDateTime(habit.lastLoggedAt)}
                </div>
              </div>
            </div>
          </div>
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
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
              Habit log
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
              Ghi log theo ngày
            </h2>
          </div>

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
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
              Lịch sử
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
              Recent habit logs
            </h2>
          </div>

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
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
              <h3 className="text-2xl font-black text-stone-950">
                Chưa có log nào
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-500">
                Hãy ghi log ngày đầu tiên để bắt đầu tính streak.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
