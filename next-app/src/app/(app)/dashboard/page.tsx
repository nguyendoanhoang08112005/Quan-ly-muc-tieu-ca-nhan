import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Layers3,
  Plus
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  goalLogTypeLabels,
  goalPriorityLabels,
  goalStatusClassNames,
  goalStatusLabels,
  workStatusClassNames,
  workStatusLabels
} from "@/features/goals/goal-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { getDashboardOverviewForUser } from "@/server/modules/dashboard/queries";

export default async function DashboardPage() {
  const userId = await requireAuthenticatedUserId();
  const dashboard = await getDashboardOverviewForUser(userId);

  const stats = [
    {
      label: "Mục tiêu đang thực hiện",
      value: dashboard.summary.activeGoals,
      icon: Layers3
    },
    {
      label: "Mục tiêu hoàn thành",
      value: dashboard.summary.completedGoals,
      icon: CheckCircle2
    },
    {
      label: "Công việc hôm nay",
      value: dashboard.summary.tasksToday,
      icon: ClipboardList
    },
    {
      label: "Công việc quá hạn",
      value: dashboard.summary.overdueTasks,
      icon: Clock3
    }
  ];

  const totalGoals =
    dashboard.summary.activeGoals + dashboard.summary.completedGoals;
  const hasAnyGoals = totalGoals > 0 || dashboard.activeGoals.length > 0;
  const hasStructuredGoals = dashboard.activeGoals.some(
    (goal) => goal.milestonesCount > 0 || goal.tasksCount > 0
  );
  const hasRecentActivity =
    dashboard.recentLogs.length > 0 || dashboard.upcomingTasks.length > 0;
  const highlightedGoal = dashboard.activeGoals[0] ?? null;

  const quickSteps = [
    {
      number: "1",
      title: "Tạo mục tiêu đầu tiên",
      description: "Đặt ra một đích rõ ràng để toàn bộ việc cần làm bám vào.",
      done: hasAnyGoals
    },
    {
      number: "2",
      title: "Chia nhỏ thành cột mốc và công việc",
      description: "Mỗi mục tiêu chỉ cần vài bước nhỏ là đã đủ dễ theo dõi hơn.",
      done: hasStructuredGoals
    },
    {
      number: "3",
      title: "Duy trì nhịp hằng ngày",
      description: "Khi đã quen, bạn mới cần thói quen, pomodoro hay ghi chú.",
      done: hasRecentActivity
    }
  ] as const;

  const primaryActionHref: Route = !hasAnyGoals
    ? "/goals/new"
    : highlightedGoal
      ? (`/goals/${highlightedGoal.id}` as Route)
      : "/goals";
  const primaryActionLabel = !hasAnyGoals
    ? "Tạo mục tiêu đầu tiên"
    : highlightedGoal
      ? "Mở mục tiêu gần nhất"
      : "Mở khu mục tiêu";

  const secondaryActionHref: Route = !hasAnyGoals
    ? "/goals"
    : hasStructuredGoals
      ? "/tasks"
      : "/goals";
  const secondaryActionLabel = !hasAnyGoals
    ? "Xem khu mục tiêu"
    : hasStructuredGoals
      ? "Mở công việc hôm nay"
      : "Xem tất cả mục tiêu";

  const helperActionHref: Route = hasStructuredGoals ? "/habits" : "/tasks";
  const helperActionLabel = hasStructuredGoals
    ? "Mở thói quen hằng ngày"
    : "Mở danh sách công việc";

  const supportAreas = [
    {
      href: "/projects" as Route,
      title: "Dự án và ghi chú",
      description:
        "Dùng khi bạn bắt đầu có nhiều mục tiêu song song và cần gom việc lại theo chủ đề."
    },
    {
      href: "/pomodoro" as Route,
      title: "Pomodoro và tập trung",
      description:
        "Chỉ mở khi bạn đã có công việc rõ ràng và muốn tối ưu từng phiên làm việc."
    },
    {
      href: "/settings/profile" as Route,
      title: "Phân loại và cài đặt",
      description:
        "Danh mục, thẻ và cài đặt chỉ nên chỉnh sau khi bạn đã quen với luồng chính."
    }
  ] as const;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
            Trang chủ
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
            Hôm nay bạn nên bắt đầu từ đâu?
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
            Đừng cố dùng hết mọi chức năng cùng lúc. Luồng dễ nhất là:
            <strong className="font-semibold text-stone-900"> Mục tiêu</strong>
            {" → "}
            <strong className="font-semibold text-stone-900">Công việc</strong>
            {" → "}
            <strong className="font-semibold text-stone-900">Thói quen</strong>.
            Các mục khác đã được đẩy xuống nhóm phụ để bạn chỉ mở khi thật sự cần.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {quickSteps.map((step) => (
              <div
                className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5"
                key={step.number}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 text-sm font-black text-white">
                    {step.number}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                      step.done
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {step.done ? "Đã có" : "Tiếp theo"}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-black text-stone-950">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 rounded-full !text-white"
              )}
              href={primaryActionHref}
            >
              <Plus className="h-4 w-4" />
              {primaryActionLabel}
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "rounded-full"
              )}
              href={secondaryActionHref}
            >
              {secondaryActionLabel}
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "rounded-full"
              )}
              href={helperActionHref}
            >
              {helperActionLabel}
            </Link>
          </div>
        </div>

        <section className="rounded-[2rem] bg-stone-950 p-8 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-300">
            Tình hình nhanh
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">
            Nhìn một lần là nắm được hôm nay
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4"
                  key={stat.label}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
                      {stat.label}
                    </div>
                    <Icon className="h-4 w-4 text-stone-300" />
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">
                    {stat.value}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
              Hạn cần chú ý
            </p>
            <div className="mt-3 text-xl font-black text-white">
              {dashboard.metadata.nearestDeadlineGoal
                ? dashboard.metadata.nearestDeadlineGoal.title
                : "Chưa có mục tiêu nào gần hạn"}
            </div>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              {dashboard.metadata.nearestDeadlineGoal
                ? `Hạn ${formatDisplayDate(
                    dashboard.metadata.nearestDeadlineGoal.targetDate
                  )}`
                : "Khi bạn tạo mục tiêu có ngày hạn, mục này sẽ nhắc ngay tại trang chủ."}
            </p>
          </div>
        </section>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-8">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
                  Trọng tâm hiện tại
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
                  Mục tiêu đang thực hiện
                </h2>
              </div>

              <Link
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-2"
                )}
                href="/goals"
              >
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {dashboard.activeGoals.length > 0 ? (
              <div className="mt-6 grid gap-4">
                {dashboard.activeGoals.slice(0, 3).map((goal) => (
                  <Link
                    className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5 transition hover:border-stone-950"
                    href={`/goals/${goal.id}` as Route}
                    key={goal.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold",
                              goalStatusClassNames[goal.status]
                            )}
                          >
                            {goalStatusLabels[goal.status]}
                          </span>
                          {goal.category ? (
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                              {goal.category.name}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-4 text-xl font-black text-stone-950">
                          {goal.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          {goal.description}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white px-4 py-3 text-right">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                          Tiến độ
                        </div>
                        <div className="mt-2 text-3xl font-black text-stone-950">
                          {Math.round(goal.progress)}%
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-stone-500">
                      Hạn {formatDisplayDate(goal.targetDate)} •{" "}
                      {goal.milestonesCount} cột mốc • {goal.tasksCount} công việc
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
                <h3 className="text-2xl font-black text-stone-950">
                  Bạn chưa có mục tiêu nào để theo dõi
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Hãy tạo một mục tiêu đầu tiên. Sau đó bạn mới cần nghĩ tới cột mốc,
                  công việc hay công cụ mở rộng.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
                  Việc cần chú ý
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
                  7 ngày tới
                </h2>
              </div>

              <Link
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-2"
                )}
                href="/tasks"
              >
                Mở công việc
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {dashboard.upcomingTasks.length > 0 ? (
              <div className="mt-6 space-y-4">
                {dashboard.upcomingTasks.slice(0, 4).map((task) => (
                  <div
                    className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5"
                    key={task.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {task.isFocus ? (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                              Tập trung
                            </span>
                          ) : null}
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold",
                              workStatusClassNames[task.status]
                            )}
                          >
                            {workStatusLabels[task.status]}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                            {goalPriorityLabels[task.priority]}
                          </span>
                        </div>

                        <h3 className="mt-3 text-lg font-black text-stone-950">
                          {task.title}
                        </h3>
                        <p className="mt-2 text-sm text-stone-500">
                          {task.goal.title}
                          {task.milestone
                            ? ` • Cột mốc ${task.milestone.sequenceNo}: ${task.milestone.title}`
                            : ""}
                        </p>
                      </div>

                      <div className="text-sm text-stone-500">
                        {formatDisplayDateTime(task.dueAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
                <h3 className="text-2xl font-black text-stone-950">
                  Chưa có công việc sắp đến hạn
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Khi bạn thêm công việc có ngày hạn, khu vực này sẽ tự động nhắc
                  để bạn không bị quên.
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
              Chỉ mở khi cần
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
              Chức năng mở rộng
            </h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Bạn không cần dùng những khu vực này ngay bây giờ. Hãy chỉ mở khi luồng
              chính đã bắt đầu ổn định.
            </p>

            <div className="mt-6 space-y-4">
              {supportAreas.map((area) => (
                <Link
                  className="block rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5 transition hover:border-stone-950"
                  href={area.href}
                  key={area.href}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-stone-950">
                        {area.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {area.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-stone-400" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
                  Dấu vết tiến độ
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
                  Hoạt động gần đây
                </h2>
              </div>
            </div>

            {dashboard.recentLogs.length > 0 ? (
              <div className="mt-6 space-y-4">
                {dashboard.recentLogs.slice(0, 4).map((log) => (
                  <Link
                    className="block rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5 transition hover:border-stone-950"
                    href={`/goals/${log.goal.id}` as Route}
                    key={log.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                            {goalLogTypeLabels[log.logType] ?? log.logType}
                          </span>
                          {log.progressSnapshot !== null ? (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                              Ảnh chụp {Math.round(log.progressSnapshot)}%
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-3 text-lg font-black text-stone-950">
                          {log.title ?? log.goal.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          {log.content ?? "Không có nội dung bổ sung cho thay đổi này."}
                        </p>
                      </div>

                      <div className="text-sm text-stone-500">
                        {formatDisplayDateTime(log.loggedAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
                <h3 className="text-2xl font-black text-stone-950">
                  Chưa có hoạt động nào gần đây
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Khi bạn bắt đầu cập nhật mục tiêu, cột mốc hay công việc, dòng thời
                  gian sẽ hiện ra ở đây.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
