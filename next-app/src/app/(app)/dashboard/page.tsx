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
      label: "Goal dang active",
      value: dashboard.summary.activeGoals,
      icon: Layers3
    },
    {
      label: "Goal hoan thanh",
      value: dashboard.summary.completedGoals,
      icon: CheckCircle2
    },
    {
      label: "Task hom nay",
      value: dashboard.summary.tasksToday,
      icon: ClipboardList
    },
    {
      label: "Task qua han",
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
              Tong quan ca nhan
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Dashboard nay da tong hop du lieu thuc tu goals, tasks, metadata
              va goal logs. Toan bo data duoc doc o server, khong fetch bang
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
              Xem tat ca goals
            </Link>
            <Link
              className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-full")}
              href="/goals/new"
            >
              <Plus className="h-4 w-4" />
              Tao goal moi
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
                  Goal dang theo duoi
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
                Xem them
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
                      Han {formatDisplayDate(goal.targetDate)} •{" "}
                      {goal.milestonesCount} milestone • {goal.tasksCount} task
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
                <h3 className="text-2xl font-black text-stone-950">
                  Chua co goal active
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Tao goal dau tien de dashboard bat dau co du lieu that.
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
                          {log.content ?? "Khong co noi dung bo sung cho su kien nay."}
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
                  Chua co log nao
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Timeline se hien ra khi progress, milestone hoac task bat dau
                  thay doi.
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight text-stone-950">
              Metadata va quick check
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
                    Tags dang dung
                  </p>
                </div>
                <div className="mt-3 text-3xl font-black text-stone-950">
                  {dashboard.metadata.tags}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                  Deadline gan nhat
                </p>
                <div className="mt-3 text-lg font-black text-stone-950">
                  {dashboard.metadata.nearestDeadlineGoal
                    ? dashboard.metadata.nearestDeadlineGoal.title
                    : "Chua co goal"}
                </div>
                <p className="mt-2 text-sm text-stone-500">
                  {dashboard.metadata.nearestDeadlineGoal
                    ? formatDisplayDate(
                        dashboard.metadata.nearestDeadlineGoal.targetDate
                      )
                    : "Ban co the tao goal moi de bat dau lap deadline."}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                className={cn(buttonVariants({ size: "lg" }), "justify-start gap-2")}
                href="/goals/new"
              >
                <Plus className="h-4 w-4" />
                Tao goal moi
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "justify-start"
                )}
                href="/categories"
              >
                Quan ly categories
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "justify-start"
                )}
                href="/tags"
              >
                Quan ly tags
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
                  Task sap den han
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
                  7 ngay toi
                </h2>
              </div>

              <Link
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-2"
                )}
                href="/tasks"
              >
                Mo tasks
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
                  Chua co task sap den han
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Khi task co `dueAt`, dashboard se tu dong dua vao khu vuc nay.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
