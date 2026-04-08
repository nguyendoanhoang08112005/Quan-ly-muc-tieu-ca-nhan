import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Layers3,
  Plus,
  Tags
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
      label: "Goal đang active",
      value: dashboard.summary.activeGoals,
      icon: Layers3
    },
    {
      label: "Goal hoàn thành",
      value: dashboard.summary.completedGoals,
      icon: CheckCircle2
    },
    {
      label: "Task hôm nay",
      value: dashboard.summary.tasksToday,
      icon: ClipboardList
    },
    {
      label: "Task quá hạn",
      value: dashboard.summary.overdueTasks,
      icon: Clock3
    }
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
              Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950">
              Tổng quan cá nhân
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Dashboard này đã tổng hợp dữ liệu thực từ goals, tasks, metadata
              và goal logs. Toàn bộ data được đọc ở server, không fetch bằng
              client effect.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "rounded-full"
              )}
              href="/goals"
            >
              Xem tất cả goals
            </Link>
            <Link
              className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-full")}
              href="/goals/new"
            >
              <Plus className="h-4 w-4" />
              Tạo goal mới
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5"
                key={stat.label}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                    {stat.label}
                  </div>
                  <Icon className="h-5 w-5 text-stone-500" />
                </div>
                <div className="mt-4 text-4xl font-black text-stone-950">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.35fr,0.95fr]">
        <div className="space-y-8">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
                  Goal đang theo đuổi
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
                  Active goals
                </h2>
              </div>

              <Link
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-2"
                )}
                href="/goals"
              >
                Xem thêm
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {dashboard.activeGoals.length > 0 ? (
              <div className="mt-6 grid gap-4">
                {dashboard.activeGoals.map((goal) => (
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
                          {goal.tags.slice(0, 3).map((tag) => (
                            <span
                              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600"
                              key={tag.id}
                            >
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                        <h3 className="mt-4 text-xl font-black text-stone-950">
                          {goal.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          {goal.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                          Progress
                        </div>
                        <div className="text-3xl font-black text-stone-950">
                          {Math.round(goal.progress)}%
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-stone-500">
                      Hạn {formatDisplayDate(goal.targetDate)} •{" "}
                      {goal.milestonesCount} milestone • {goal.tasksCount} task
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
                <h3 className="text-2xl font-black text-stone-950">
                  Chưa có goal active
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Tạo goal đầu tiên để dashboard bắt đầu có dữ liệu thật.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
                  Goal logs
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
                  Timeline gan day
                </h2>
              </div>
            </div>

            {dashboard.recentLogs.length > 0 ? (
              <div className="mt-6 space-y-4">
                {dashboard.recentLogs.map((log) => (
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
                              Snapshot {Math.round(log.progressSnapshot)}%
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-3 text-lg font-black text-stone-950">
                          {log.title ?? log.goal.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          {log.content ?? "Không có nội dung bổ sung cho sự kiện này."}
                        </p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                          Goal {log.goal.title}
                          {log.milestoneTitle ? ` • Milestone ${log.milestoneTitle}` : ""}
                          {log.taskTitle ? ` • Task ${log.taskTitle}` : ""}
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
                  Chưa có log nào
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Timeline sẽ hiện ra khi progress, milestone hoặc task bắt đầu
                  thay đổi.
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight text-stone-950">
              Metadata và quick check
            </h2>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
                <div className="flex items-center gap-3">
                  <Layers3 className="h-5 w-5 text-stone-500" />
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                    Categories cho goal
                  </p>
                </div>
                <div className="mt-3 text-3xl font-black text-stone-950">
                  {dashboard.metadata.categories}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
                <div className="flex items-center gap-3">
                  <Tags className="h-5 w-5 text-stone-500" />
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                    Tags đang dùng
                  </p>
                </div>
                <div className="mt-3 text-3xl font-black text-stone-950">
                  {dashboard.metadata.tags}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                  Deadline gần nhất
                </p>
                <div className="mt-3 text-lg font-black text-stone-950">
                  {dashboard.metadata.nearestDeadlineGoal
                    ? dashboard.metadata.nearestDeadlineGoal.title
                    : "Chưa có goal"}
                </div>
                <p className="mt-2 text-sm text-stone-500">
                  {dashboard.metadata.nearestDeadlineGoal
                    ? formatDisplayDate(
                        dashboard.metadata.nearestDeadlineGoal.targetDate
                      )
                    : "Bạn có thể tạo goal mới để bắt đầu lập deadline."}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                className={cn(buttonVariants({ size: "lg" }), "justify-start gap-2")}
                href="/goals/new"
              >
                <Plus className="h-4 w-4" />
                Tạo goal mới
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "justify-start"
                )}
                href="/categories"
              >
                Quản lý categories
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "justify-start"
                )}
                href="/tags"
              >
                Quản lý tags
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
                  Task sắp đến hạn
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
                Mở tasks
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {dashboard.upcomingTasks.length > 0 ? (
              <div className="mt-6 space-y-4">
                {dashboard.upcomingTasks.map((task) => (
                  <div
                    className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5"
                    key={task.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {task.isFocus ? (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                              Focus
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
                            ? ` • Milestone ${task.milestone.sequenceNo}: ${task.milestone.title}`
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
                  Chưa có task sắp đến hạn
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Khi task có `dueAt`, dashboard sẽ tự động đưa vào khu vực này.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
