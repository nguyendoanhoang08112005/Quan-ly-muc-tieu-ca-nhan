import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, TimerReset } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PomodoroStartForm } from "@/features/pomodoro/components/pomodoro-start-form";
import { PomodoroCountdown } from "@/features/pomodoro/components/pomodoro-countdown";
import { CompletePomodoroSessionForm } from "@/features/pomodoro/components/complete-pomodoro-session-form";
import { InterruptPomodoroSessionForm } from "@/features/pomodoro/components/interrupt-pomodoro-session-form";
import { buildDefaultPomodoroStartFormValues, formatPomodoroMinutes } from "@/features/pomodoro/pomodoro-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { getPomodoroOverviewForUser } from "@/server/modules/pomodoro/queries";

type PomodoroPageProps = {
  searchParams?: Promise<{
    taskId?: string;
  }>;
};

export default async function PomodoroPage({ searchParams }: PomodoroPageProps) {
  const userId = await requireAuthenticatedUserId();
  const searchParamsPromise: Promise<{ taskId?: string }> =
    searchParams ?? Promise.resolve<{ taskId?: string }>({});
  const [overview, resolvedSearchParams] = await Promise.all([
    getPomodoroOverviewForUser(userId),
    searchParamsPromise
  ]);
  const selectedTaskId =
    typeof resolvedSearchParams.taskId === "string"
      ? resolvedSearchParams.taskId
      : "";
  const taskExists = overview.taskOptions.some((task) => task.id === selectedTaskId);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
              Phiên pomodoro
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Pomodoro giờ đã lưu bền vững, có phiên đang chạy và luồng hoàn
              thành gắn với công việc thực trong hệ thống.
            </p>
          </div>

          <Link
            className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
            href={"/tasks" as Route}
          >
            Mở công việc
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Tổng phiên
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {overview.summary.totalSessions}
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
              Đang chạy
            </div>
            <div className="mt-2 text-4xl font-black">
              {overview.summary.activeSessions}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Hoàn thành
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {overview.summary.completedSessions}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Hôm nay
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {overview.summary.todaySessions}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.95fr,1.05fr]">
        <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
              Phiên đang chạy
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
              {overview.activeSession ? "Đang tập trung" : "Bắt đầu phiên mới"}
            </h2>
          </div>

          {overview.activeSession ? (
            <div className="mt-6 space-y-6">
              <PomodoroCountdown
                durationMinutes={overview.activeSession.durationMinutes}
                startedAt={overview.activeSession.startedAt}
              />

              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                  Công việc đang tập trung
                </p>
                <h3 className="mt-3 text-2xl font-black text-stone-950">
                  {overview.activeSession.taskTitle}
                </h3>
                <p className="mt-2 text-sm text-stone-500">
                  {overview.activeSession.goalTitle}
                </p>
                <p className="mt-4 text-sm text-stone-600">
                  Bắt đầu lúc {formatDisplayDateTime(overview.activeSession.startedAt)}
                </p>
                <p className="mt-2 text-sm text-stone-600">
                  Mục tiêu {formatPomodoroMinutes(overview.activeSession.durationMinutes)}
                </p>
              </div>

              <div className="grid gap-4">
                <CompletePomodoroSessionForm sessionId={overview.activeSession.id} />
                <InterruptPomodoroSessionForm sessionId={overview.activeSession.id} />
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <PomodoroStartForm
                initialValues={buildDefaultPomodoroStartFormValues(
                  taskExists ? selectedTaskId : ""
                )}
                taskOptions={overview.taskOptions}
              />
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
              Lịch sử
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
              Các phiên gần đây
            </h2>
          </div>

          {overview.recentSessions.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {overview.recentSessions.map((session) => (
                <article
                  className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5"
                  key={session.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            session.isActive
                              ? "bg-amber-100 text-amber-700"
                              : session.completed
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-stone-100 text-stone-700"
                          )}
                        >
                          {session.isActive
                            ? "Đang chạy"
                            : session.completed
                              ? "Hoàn thành"
                              : "Bị dừng"}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                          {formatPomodoroMinutes(session.durationMinutes)}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-black text-stone-950">
                        {session.taskTitle}
                      </h3>
                      <p className="mt-2 text-sm text-stone-500">
                        {session.goalTitle}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-stone-500">
                        <span className="rounded-full bg-white px-3 py-1">
                          Bắt đầu {formatDisplayDateTime(session.startedAt)}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1">
                          Kết thúc {formatDisplayDateTime(session.endedAt)}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1">
                          Thực tế {formatPomodoroMinutes(session.actualDurationMinutes)}
                        </span>
                      </div>
                      {session.notes ? (
                        <p className="mt-4 text-sm leading-6 text-stone-600">
                          {session.notes}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        className={cn(buttonVariants({ variant: "secondary" }))}
                        href={`/goals/${session.goalId}` as Route}
                      >
                        Xem mục tiêu
                      </Link>
                      <Link
                        className={cn(buttonVariants({ variant: "secondary" }))}
                        href={`/pomodoro?taskId=${session.taskId}` as Route}
                      >
                        Lặp lại
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                <TimerReset className="h-8 w-8 text-stone-500" />
              </div>
              <h2 className="mt-6 text-3xl font-black tracking-tight text-stone-950">
                Chưa có phiên pomodoro nào
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-600">
                Chọn một công việc ở bên trái để bắt đầu phiên tập trung đầu tiên.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
