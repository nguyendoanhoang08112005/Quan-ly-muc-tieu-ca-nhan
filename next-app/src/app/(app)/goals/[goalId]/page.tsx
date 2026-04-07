import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PencilLine } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DeleteGoalForm } from "@/features/goals/components/delete-goal-form";
import {
  goalPriorityClassNames,
  goalPriorityLabels,
  goalStatusClassNames,
  goalStatusLabels,
  goalTypeLabels,
  workStatusLabels
} from "@/features/goals/goal-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { getGoalDetailForUser } from "@/server/modules/goals/queries";

type GoalDetailPageProps = {
  params: Promise<{
    goalId: string;
  }>;
};

export default async function GoalDetailPage({
  params
}: GoalDetailPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { goalId } = await params;
  const goal = await getGoalDetailForUser(userId, BigInt(goalId));

  if (!goal) {
    notFound();
  }

  const totalTasks = goal.milestones.reduce(
    (sum, milestone) => sum + milestone.tasksCount,
    0
  );
  const completedTasks = goal.milestones.reduce(
    (sum, milestone) =>
      sum +
      milestone.tasks.filter((task) => task.status === "completed").length,
    0
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "gap-2 rounded-full"
            )}
            href="/goals"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lai goals
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
              href={`/goals/${goal.id}/edit`}
            >
              <PencilLine className="h-4 w-4" />
              Chinh sua
            </Link>
            <DeleteGoalForm goalId={goal.id} />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
              Goal detail
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-stone-950">
              {goal.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              {goal.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                {goalTypeLabels[goal.goalType]}
              </span>
              <span
                className={cn(
                  "rounded-full px-3 py-1 font-semibold",
                  goalStatusClassNames[goal.status]
                )}
              >
                {goalStatusLabels[goal.status]}
              </span>
              <span
                className={cn(
                  "rounded-full px-3 py-1 font-semibold",
                  goalPriorityClassNames[goal.priority]
                )}
              >
                Uu tien {goalPriorityLabels[goal.priority]}
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                Han {formatDisplayDate(goal.targetDate)}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:w-[440px] lg:grid-cols-1">
            <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
                Progress
              </div>
              <div className="mt-2 text-4xl font-black">
                {Math.round(goal.progress)}%
              </div>
            </div>
            <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                  Milestone
                </div>
                <div className="mt-2 text-3xl font-black text-stone-950">
                  {goal.milestonesCount}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                  Task xong
                </div>
                <div className="mt-2 text-3xl font-black text-stone-950">
                  {completedTasks}/{totalTasks}
                </div>
              </div>
            </div>
          </div>
        </div>

        {goal.note ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
            {goal.note}
          </div>
        ) : null}
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
            Flow chinh
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
            Milestone va task trong goal
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
            Detail page nay da doc du lieu nested theo dung thu tu cu:
            milestone theo sequence_no, task theo is_focus, sort_order, roi den
            due_at.
          </p>
        </div>

        {goal.milestones.length > 0 ? (
          <div className="space-y-6">
            {goal.milestones.map((milestone) => (
              <article
                className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
                key={milestone.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
                      Milestone {milestone.sequenceNo}
                    </div>
                    <h3 className="mt-4 text-2xl font-black text-stone-950">
                      {milestone.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {milestone.description}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-stone-100 px-4 py-3 text-right">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                      Progress
                    </div>
                    <div className="text-2xl font-black text-stone-950">
                      {Math.round(milestone.progress)}%
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                    {workStatusLabels[milestone.status]}
                  </span>
                  <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                    Bat dau {formatDisplayDate(milestone.startDate)}
                  </span>
                  <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                    Muc tieu {formatDisplayDate(milestone.targetDate)}
                  </span>
                  <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                    {milestone.tasksCount} task
                  </span>
                </div>

                {milestone.note ? (
                  <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-600">
                    {milestone.note}
                  </div>
                ) : null}

                {milestone.tasks.length > 0 ? (
                  <div className="mt-6 grid gap-4">
                    {milestone.tasks.map((task) => (
                      <div
                        className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4"
                        key={task.id}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap gap-2">
                              {task.isFocus ? (
                                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                  Focus
                                </span>
                              ) : null}
                              <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold text-stone-700">
                                {workStatusLabels[task.status]}
                              </span>
                              <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold text-stone-700">
                                {goalPriorityLabels[task.priority]}
                              </span>
                            </div>
                            <h4 className="mt-3 text-lg font-black text-stone-950">
                              {task.title}
                            </h4>
                            <p className="mt-2 text-sm leading-6 text-stone-600">
                              {task.description}
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                              Progress
                            </div>
                            <div className="text-2xl font-black text-stone-950">
                              {Math.round(task.progress)}%
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-stone-500">
                          <span className="rounded-full bg-white px-3 py-1">
                            Due {formatDisplayDate(task.dueAt)}
                          </span>
                          {task.estimatedMinutes ? (
                            <span className="rounded-full bg-white px-3 py-1">
                              Uoc tinh {task.estimatedMinutes} phut
                            </span>
                          ) : null}
                          {task.actualMinutes ? (
                            <span className="rounded-full bg-white px-3 py-1">
                              Thuc te {task.actualMinutes} phut
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-5 py-6 text-sm leading-6 text-stone-500">
                    Milestone nay chua co task nao. Phase task creation se tiep
                    tuc gan vao day.
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
            <h3 className="text-2xl font-black text-stone-950">
              Goal nay chua co milestone
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-500">
              Milestone va task mutation se duoc noi tiep ngay sau khi module
              goals CRUD da on dinh. Neu database cu da co du lieu, page nay se
              tu dong render nested items.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
