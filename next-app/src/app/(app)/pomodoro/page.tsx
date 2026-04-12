import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Clock3, TimerReset } from "lucide-react";
import { PageEmptyState, PageHero, PageSectionTitle } from "@/components/shared/app-page-patterns";
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
    <div className="flex w-full max-w-none flex-col gap-4">
      <PageHero
        actions={
          <Link
            className={cn(buttonVariants({ variant: "secondary" }), "gap-2 rounded-full")}
            href={"/tasks" as Route}
          >
            Mở công việc
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
        aside={
          <div className="rounded-[1.45rem] border border-[#eadfd4] bg-[#fffaf6] px-4 py-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
              Phiên hiện tại
            </p>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <div className="flex items-center justify-between gap-3">
                <span>Trạng thái</span>
                <span className="font-semibold text-stone-950">
                  {overview.activeSession ? "Đang tập trung" : "Sẵn sàng bắt đầu"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Hôm nay</span>
                <span className="font-semibold text-stone-950">{overview.summary.todaySessions}</span>
              </div>
            </div>
          </div>
        }
        description="Pomodoro lưu bền vững, gắn với công việc thật và cho phép hoàn thành hoặc dừng đúng ngữ cảnh."
        eyebrow="Pomodoro"
        metrics={[
          { icon: Clock3, label: "Tổng phiên", value: overview.summary.totalSessions, hint: "Toàn bộ đã ghi" },
          { icon: TimerReset, label: "Đang chạy", value: overview.summary.activeSessions, tone: "warm", hint: "Phiên đang mở" },
          { label: "Hoàn thành", value: overview.summary.completedSessions, tone: "bamboo", hint: "Đã kết thúc" },
          { label: "Hôm nay", value: overview.summary.todaySessions, hint: "Trong ngày hiện tại" }
        ]}
        title="Phiên pomodoro"
        trailVariant="mixed"
      />

      <div className="grid gap-8 xl:grid-cols-[0.95fr,1.05fr]">
        <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <PageSectionTitle
            eyebrow="Phiên đang chạy"
            title={overview.activeSession ? "Đang tập trung" : "Bắt đầu phiên mới"}
          />

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
          <PageSectionTitle eyebrow="Lịch sử" title="Các phiên gần đây" />

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
            <div className="mt-6">
              <PageEmptyState
                description="Chọn một công việc ở bên trái để bắt đầu phiên tập trung đầu tiên."
                title="Chưa có phiên pomodoro nào"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
