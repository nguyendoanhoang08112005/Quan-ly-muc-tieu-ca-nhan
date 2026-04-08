import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { goalPriorityLabels, workStatusClassNames, workStatusLabels } from "@/features/goals/goal-helpers";
import { CompleteTaskForm } from "@/features/tasks/components/complete-task-form";
import { DeleteTaskForm } from "@/features/tasks/components/delete-task-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { listTasksForUser } from "@/server/modules/tasks/queries";

export default async function TasksPage() {
  const userId = await requireAuthenticatedUserId();
  const tasks = await listTasksForUser(userId);
  const focusTasks = tasks.filter((task) => task.isFocus);
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
              Phase 5
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950">
              Tasks da co route rieng
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Tasks khong con chi hien trong goal detail. Page nay doc du lieu
              that tu Prisma va cho phep complete, edit, delete nhanh.
            </p>
          </div>

          <Link
            className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
            href={"/goals" as Route}
          >
            Ve goals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
              Tong task
            </div>
            <div className="mt-2 text-4xl font-black">{tasks.length}</div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Focus
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {focusTasks.length}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Hoan thanh
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {completedTasks.length}
            </div>
          </div>
        </div>
      </section>

      {tasks.length > 0 ? (
        <section className="grid gap-6">
          {tasks.map((task) => (
            <article
              className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
              key={task.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap gap-2">
                    {task.isFocus ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
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
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                      {goalPriorityLabels[task.priority]}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-black text-stone-950">
                    {task.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {task.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-stone-500">
                    <span className="rounded-full bg-stone-100 px-3 py-1">
                      Goal: {task.goalTitle}
                    </span>
                    {task.milestoneTitle ? (
                      <span className="rounded-full bg-stone-100 px-3 py-1">
                        Milestone {task.milestoneSequenceNo}: {task.milestoneTitle}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-stone-100 px-3 py-1">
                      Han {formatDisplayDateTime(task.dueAt)}
                    </span>
                    {task.estimatedMinutes ? (
                      <span className="rounded-full bg-stone-100 px-3 py-1">
                        Uoc tinh {task.estimatedMinutes} phut
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-stone-50 px-4 py-4 text-right">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Progress
                  </div>
                  <div className="mt-2 text-3xl font-black text-stone-950">
                    {Math.round(task.progress)}%
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-stone-200 pt-5">
                <Link
                  className={cn(buttonVariants({ variant: "secondary" }))}
                  href={`/goals/${task.goalId}` as Route}
                >
                  Xem goal
                </Link>
                <Link
                  className={cn(buttonVariants({ variant: "secondary" }))}
                  href={`/goals/${task.goalId}/tasks/${task.id}/edit` as Route}
                >
                  Sua task
                </Link>
                <Link
                  className={cn(buttonVariants({ variant: "secondary" }))}
                  href={`/pomodoro?taskId=${task.id}` as Route}
                >
                  Pomodoro
                </Link>
                <CompleteTaskForm
                  disabled={task.status === "completed"}
                  goalId={task.goalId}
                  taskId={task.id}
                />
                <DeleteTaskForm goalId={task.goalId} taskId={task.id} />
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <CheckCircle2 className="h-8 w-8 text-stone-500" />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-stone-950">
            Chua co task nao
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-600">
            Hay tao task moi ben trong mot milestone de bat dau theo doi cong
            viec tu he Next.js.
          </p>
        </section>
      )}
    </div>
  );
}
