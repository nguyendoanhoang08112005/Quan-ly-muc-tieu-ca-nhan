import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  PencilLine,
  Plus,
  Sparkles,
  Target
} from "lucide-react";
import { PageSectionTitle } from "@/components/shared/app-page-patterns";
import { buttonVariants } from "@/components/ui/button";
import { DeleteGoalForm } from "@/features/goals/components/delete-goal-form";
import {
  goalLogTypeLabels,
  goalPriorityClassNames,
  goalPriorityLabels,
  goalStatusClassNames,
  goalStatusLabels,
  goalTypeLabels,
  workStatusClassNames,
  workStatusLabels
} from "@/features/goals/goal-helpers";
import { goalIdSchema } from "@/features/goals/schemas/goal-schemas";
import { DeleteMilestoneForm } from "@/features/milestones/components/delete-milestone-form";
import { milestoneIdSchema } from "@/features/milestones/schemas/milestone-schemas";
import { TaskSubtasksPanel } from "@/features/subtasks/components/task-subtasks-panel";
import { CompleteTaskForm } from "@/features/tasks/components/complete-task-form";
import { DeleteTaskForm } from "@/features/tasks/components/delete-task-form";
import { taskIdSchema } from "@/features/tasks/schemas/task-schemas";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { getGoalDetailForUser } from "@/server/modules/goals/queries";

type GoalDetailPageProps = {
  params: Promise<{
    goalId: string;
  }>;
};

function InfoCard({
  children,
  icon,
  label
}: {
  children: ReactNode;
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-stone-200 bg-white/85 px-4 py-4 shadow-sm">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
        <span className="text-stone-500">{icon}</span>
        {label}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default async function GoalDetailPage({
  params
}: GoalDetailPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { goalId } = await params;
  const parsedGoalId = goalIdSchema.safeParse(goalId);

  if (!parsedGoalId.success) {
    notFound();
  }

  const goal = await getGoalDetailForUser(userId, BigInt(parsedGoalId.data));

  if (!goal) {
    notFound();
  }

  const allTasks = goal.milestones.flatMap((milestone) =>
    milestone.tasks.map((task) => ({
      ...task,
      milestoneTitle: milestone.title
    }))
  );
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(
    (task) => task.status === "completed"
  ).length;
  const activeMilestonesCount = goal.milestones.filter(
    (milestone) => milestone.status === "in_progress"
  ).length;
  const focusTasksCount = allTasks.filter(
    (task) => task.isFocus && task.status !== "completed"
  ).length;
  const overdueTasksCount = allTasks.filter((task) => {
    if (task.status === "completed" || !task.dueAt) {
      return false;
    }

    const dueAt = new Date(task.dueAt);

    return !Number.isNaN(dueAt.getTime()) && dueAt.getTime() < Date.now();
  }).length;
  const nextDueTask =
    allTasks
      .filter((task) => task.status !== "completed" && task.dueAt)
      .sort((taskA, taskB) => {
        const taskADueAt = new Date(taskA.dueAt ?? 0).getTime();
        const taskBDueAt = new Date(taskB.dueAt ?? 0).getTime();

        return taskADueAt - taskBDueAt;
      })[0] ?? null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,246,242,0.94))] px-6 py-6 shadow-[0_28px_60px_-44px_rgba(120,113,108,0.42)] sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "gap-2 rounded-full border-stone-200 bg-white/90"
            )}
            href={"/goals" as Route}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại mục tiêu
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "gap-2 rounded-full border-stone-200 bg-white/90"
              )}
              href={`/goals/${goal.id}/edit` as Route}
            >
              <PencilLine className="h-4 w-4" />
              Chỉnh sửa
            </Link>
            <Link
              className={cn(buttonVariants({ size: "default" }), "gap-2 rounded-full !text-white")}
              href={`/goals/${goal.id}/milestones/new` as Route}
            >
              <Plus className="h-4 w-4" />
              Thêm cột mốc
            </Link>
            <DeleteGoalForm
              className="rounded-full text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              goalId={goal.id}
              idleLabel="Xóa mục tiêu"
              size="sm"
              variant="ghost"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Tổng quan mục tiêu
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-stone-950 sm:text-[3.4rem]">
              {goal.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-stone-600">
              {goal.description ||
                "Mục tiêu này chưa có mô tả. Bổ sung vài dòng ngắn về kết quả mong muốn sẽ giúp luồng thực thi rõ ràng hơn."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="rounded-full bg-stone-100 px-3.5 py-1.5 text-sm font-semibold text-stone-700">
                {goalTypeLabels[goal.goalType]}
              </span>
              <span
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-semibold",
                  goalStatusClassNames[goal.status]
                )}
              >
                {goalStatusLabels[goal.status]}
              </span>
              <span
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-semibold",
                  goalPriorityClassNames[goal.priority]
                )}
              >
                Ưu tiên {goalPriorityLabels[goal.priority]}
              </span>
              <span className="rounded-full bg-stone-100 px-3.5 py-1.5 text-sm font-semibold text-stone-700">
                {goal.isPublic ? "Công khai" : "Riêng tư"}
              </span>
            </div>

            {goal.note ? (
              <div className="mt-5 rounded-[1.25rem] border border-amber-200 bg-amber-50/90 px-4 py-4 text-sm leading-7 text-amber-900">
                {goal.note}
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <InfoCard
                icon={<CalendarDays className="h-4 w-4" />}
                label="Khung thời gian"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs font-medium text-stone-400">Bắt đầu</p>
                    <p className="mt-1 text-sm font-semibold text-stone-800">
                      {formatDisplayDate(goal.startDate)}
                    </p>
                  </div>
                  <div className="h-px flex-1 bg-stone-200" />
                  <div className="text-right">
                    <p className="text-xs font-medium text-stone-400">Mục tiêu</p>
                    <p className="mt-1 text-sm font-semibold text-stone-800">
                      {formatDisplayDate(goal.targetDate)}
                    </p>
                  </div>
                </div>
              </InfoCard>

              <InfoCard icon={<Target className="h-4 w-4" />} label="Ngữ cảnh">
                {goal.category || goal.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {goal.category ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm font-medium text-stone-700">
                        <span
                          className="h-2.5 w-2.5 rounded-full bg-stone-400"
                          style={{
                            backgroundColor: goal.category.color ?? undefined
                          }}
                        />
                        {goal.category.name}
                      </span>
                    ) : null}
                    {goal.tags.map((tag) => (
                      <span
                        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm font-medium text-stone-600"
                        key={tag.id}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full bg-stone-400"
                          style={{ backgroundColor: tag.color ?? undefined }}
                        />
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-7 text-stone-500">
                    Chưa gắn danh mục hay thẻ cho mục tiêu này.
                  </p>
                )}

                <div className="mt-4 border-t border-stone-200 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                    Cập nhật gần nhất
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-700">
                    {formatDisplayDateTime(goal.updatedAt)}
                  </p>
                </div>
              </InfoCard>
            </div>
          </div>

          <aside className="space-y-3">
            <div className="rounded-[1.9rem] border border-stone-950 bg-stone-950 px-5 py-5 text-white shadow-[0_24px_48px_-30px_rgba(12,10,9,0.9)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                Bức tranh hiện tại
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-6xl font-black tracking-tight">
                    {Math.round(goal.progress)}%
                  </p>
                  <p className="mt-1 text-sm text-stone-300">
                    tiến độ toàn mục tiêu
                  </p>
                </div>

                <div className="rounded-[1.1rem] border border-white/10 bg-white/5 px-3 py-3 text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Công việc xong
                  </p>
                  <p className="mt-1 text-2xl font-black">
                    {completedTasks}/{totalTasks}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${Math.round(goal.progress)}%` }}
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Cột mốc đang chạy
                  </p>
                  <p className="mt-2 text-2xl font-black">
                    {activeMilestonesCount}
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Việc ưu tiên
                  </p>
                  <p className="mt-2 text-2xl font-black">{focusTasksCount}</p>
                </div>
                <div className="rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Việc quá hạn
                  </p>
                  <p className="mt-2 text-2xl font-black">{overdueTasksCount}</p>
                </div>
              </div>

              <div className="mt-4 rounded-[1.15rem] border border-white/10 bg-white/5 px-4 py-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                  <Clock3 className="h-4 w-4" />
                  Việc gần hạn nhất
                </div>
                {nextDueTask ? (
                  <>
                    <p className="mt-3 text-sm font-semibold text-white">
                      {nextDueTask.title}
                    </p>
                    <p className="mt-1 text-sm text-stone-300">
                      {nextDueTask.milestoneTitle} •{" "}
                      {formatDisplayDateTime(nextDueTask.dueAt)}
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-stone-300">
                    Chưa có công việc nào được đặt hạn hoàn thành.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="space-y-5">
        <PageSectionTitle
          action={
            <Link
              className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-full !text-white")}
              href={`/goals/${goal.id}/milestones/new` as Route}
            >
              <Plus className="h-4 w-4" />
              Tạo cột mốc mới
            </Link>
          }
          description="Mỗi cột mốc là một chặng. Bên trong là những việc cụ thể để biến mục tiêu thành tiến độ nhìn thấy được."
          eyebrow="Luồng thực thi"
          title="Cột mốc và công việc"
        />

        {goal.milestones.length > 0 ? (
          <div className="relative space-y-5">
            <div className="absolute bottom-0 left-5 top-5 hidden w-px bg-stone-200 lg:block" />

            {goal.milestones.map((milestone) => {
              const parsedMilestoneId = milestoneIdSchema.safeParse(milestone.id);

              if (!parsedMilestoneId.success) {
                return null;
              }

              return (
                <article className="relative lg:pl-16" key={milestone.id}>
                  <div className="absolute left-0 top-8 hidden h-10 w-10 items-center justify-center rounded-[1rem] border border-stone-200 bg-white text-sm font-black text-stone-900 shadow-sm lg:flex">
                    {milestone.sequenceNo}
                  </div>

                  <div className="overflow-hidden rounded-[1.85rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,248,245,0.92))] shadow-[0_20px_50px_-42px_rgba(120,113,108,0.42)]">
                    <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_280px]">
                      <div className="px-6 py-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">
                            Cột mốc {milestone.sequenceNo}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-sm font-semibold",
                              workStatusClassNames[milestone.status]
                            )}
                          >
                            {workStatusLabels[milestone.status]}
                          </span>
                        </div>

                        <h3 className="mt-4 text-2xl font-black tracking-tight text-stone-950">
                          {milestone.title}
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
                          {milestone.description ||
                            "Chưa có mô tả cho cột mốc này."}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-700">
                            Bắt đầu {formatDisplayDate(milestone.startDate)}
                          </span>
                          <span className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-700">
                            Mục tiêu {formatDisplayDate(milestone.targetDate)}
                          </span>
                          <span className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-700">
                            {milestone.tasksCount} công việc
                          </span>
                        </div>

                        {milestone.note ? (
                          <div className="mt-4 rounded-[1.2rem] border border-stone-200 bg-white/80 px-4 py-4 text-sm leading-7 text-stone-600">
                            {milestone.note}
                          </div>
                        ) : null}
                      </div>

                      <aside className="border-t border-stone-200 bg-stone-50/75 px-6 py-6 xl:border-l xl:border-t-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                          Tiến độ cột mốc
                        </p>

                        <div className="mt-3 flex items-end justify-between gap-4">
                          <p className="text-5xl font-black tracking-tight text-stone-950">
                            {Math.round(milestone.progress)}%
                          </p>
                          <p className="text-sm font-medium text-stone-500">
                            {milestone.tasksCount} việc
                          </p>
                        </div>

                        <div className="mt-4 h-2 rounded-full bg-stone-200">
                          <div
                            className="h-full rounded-full bg-stone-900"
                            style={{ width: `${Math.round(milestone.progress)}%` }}
                          />
                        </div>

                        <div className="mt-5 grid gap-2">
                          <Link
                            className={cn(
                              buttonVariants({ size: "default" }),
                              "justify-center rounded-full !text-white"
                            )}
                            href={`/goals/${goal.id}/milestones/${milestone.id}/tasks/new` as Route}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm việc
                          </Link>

                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              className={cn(
                                buttonVariants({ size: "sm", variant: "secondary" }),
                                "rounded-full border-stone-200 bg-white"
                              )}
                              href={`/goals/${goal.id}/milestones/${milestone.id}/edit` as Route}
                            >
                              Chỉnh sửa
                            </Link>
                            <DeleteMilestoneForm
                              className="rounded-full text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              goalId={goal.id}
                              idleLabel="Xóa"
                              milestoneId={parsedMilestoneId.data}
                              size="sm"
                              variant="ghost"
                            />
                          </div>
                        </div>
                      </aside>
                    </div>

                    <div className="border-t border-stone-200 bg-white/70 px-4 py-4 sm:px-6">
                      {milestone.tasks.length > 0 ? (
                        <div className="space-y-3">
                          {milestone.tasks.map((task) => {
                            const parsedTaskId = taskIdSchema.safeParse(task.id);

                            if (!parsedTaskId.success) {
                              return null;
                            }

                            return (
                              <div
                                className="rounded-[1.45rem] border border-stone-200 bg-white px-5 py-5 shadow-[0_16px_36px_-34px_rgba(120,113,108,0.45)]"
                                key={task.id}
                              >
                                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_250px]">
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap gap-2">
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
                                      {task.isFocus ? (
                                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                          Việc ưu tiên
                                        </span>
                                      ) : null}
                                    </div>

                                    <h4 className="mt-3 text-xl font-bold tracking-tight text-stone-950">
                                      {task.title}
                                    </h4>
                                    <p className="mt-2 text-sm leading-7 text-stone-600">
                                      {task.description ||
                                        "Chưa có mô tả cho công việc này."}
                                    </p>

                                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                      <div className="rounded-[1rem] bg-stone-50 px-3 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                                          Hạn hoàn thành
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-stone-700">
                                          {formatDisplayDateTime(task.dueAt)}
                                        </p>
                                      </div>
                                      <div className="rounded-[1rem] bg-stone-50 px-3 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                                          Việc con
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-stone-700">
                                          {task.completedSubtasksCount}/{task.subtasksCount} đã
                                          xong
                                        </p>
                                      </div>
                                      <div className="rounded-[1rem] bg-stone-50 px-3 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                                          Dự án
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-stone-700">
                                          {task.project?.name ?? "Không gắn dự án"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <aside className="rounded-[1.25rem] border border-stone-200 bg-stone-50/80 px-4 py-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                                      Tiến độ công việc
                                    </p>

                                    <div className="mt-3 flex items-center gap-3">
                                      <p className="text-4xl font-black tracking-tight text-stone-950">
                                        {Math.round(task.progress)}%
                                      </p>
                                      <div className="h-2 flex-1 rounded-full bg-stone-200">
                                        <div
                                          className="h-full rounded-full bg-stone-900"
                                          style={{ width: `${Math.round(task.progress)}%` }}
                                        />
                                      </div>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                      {task.project ? (
                                        <Link
                                          className={cn(
                                            buttonVariants({
                                              size: "sm",
                                              variant: "secondary"
                                            }),
                                            "rounded-full border-stone-200 bg-white"
                                          )}
                                          href={`/projects/${task.project.id}` as Route}
                                        >
                                          Dự án
                                        </Link>
                                      ) : null}
                                      <Link
                                        className={cn(
                                          buttonVariants({
                                            size: "sm",
                                            variant: "secondary"
                                          }),
                                          "rounded-full border-stone-200 bg-white"
                                        )}
                                        href={`/goals/${goal.id}/tasks/${task.id}/edit` as Route}
                                      >
                                        Sửa
                                      </Link>
                                      <CompleteTaskForm
                                        className="rounded-full"
                                        disabled={task.status === "completed"}
                                        goalId={goal.id}
                                        projectId={task.project?.id}
                                        size="sm"
                                        taskId={parsedTaskId.data}
                                      />
                                      <DeleteTaskForm
                                        className="rounded-full text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                        goalId={goal.id}
                                        idleLabel="Xóa"
                                        projectId={task.project?.id}
                                        size="sm"
                                        taskId={parsedTaskId.data}
                                        variant="ghost"
                                      />
                                    </div>
                                  </aside>
                                </div>

                                <div className="mt-4">
                                  <TaskSubtasksPanel
                                    subtasks={task.subtasks}
                                    taskId={parsedTaskId.data}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50/80 px-5 py-6 text-sm leading-7 text-stone-500">
                          Cột mốc này chưa có công việc. Tạo việc đầu tiên để bắt
                          đầu triển khai.
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
            <h3 className="text-2xl font-black text-stone-950">
              Mục tiêu này chưa có cột mốc
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-500">
              Hãy tách mục tiêu thành các chặng nhỏ để dễ theo dõi và phân việc hơn.
            </p>
            <div className="mt-6">
              <Link
                className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-full !text-white")}
                href={`/goals/${goal.id}/milestones/new` as Route}
              >
                <Plus className="h-4 w-4" />
                Tạo cột mốc đầu tiên
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[1.8rem] border border-stone-200 bg-white p-6 shadow-[0_20px_50px_-42px_rgba(120,113,108,0.42)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
              Nhật ký mục tiêu
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
              Dòng thời gian thay đổi
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
              Mọi thay đổi quan trọng được giữ lại để bạn nhìn lại tiến độ mà không
              mất ngữ cảnh.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-600">
            <CheckCircle2 className="h-4 w-4" />
            {goal.logs.length} bản ghi
          </div>
        </div>

        {goal.logs.length > 0 ? (
          <div className="relative mt-6 space-y-4">
            <div className="absolute bottom-0 left-[11px] top-2 w-px bg-stone-200" />

            {goal.logs.map((log) => (
              <article className="relative pl-8" key={log.id}>
                <span className="absolute left-0 top-5 h-[10px] w-[10px] rounded-full bg-stone-900" />

                <div className="rounded-[1.35rem] border border-stone-200 bg-stone-50/70 px-5 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="max-w-3xl">
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
                        {log.title ?? "Cập nhật mục tiêu"}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-stone-600">
                        {log.content ??
                          "Không có nội dung bổ sung cho bản ghi này."}
                      </p>

                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                        {log.milestoneTitle
                          ? `Cột mốc ${log.milestoneTitle}`
                          : "Cấp mục tiêu"}
                        {log.taskTitle ? ` • Công việc ${log.taskTitle}` : ""}
                      </p>
                    </div>

                    <div className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-stone-500">
                      {formatDisplayDateTime(log.loggedAt)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50/70 px-6 py-10 text-center">
            <h3 className="text-2xl font-black text-stone-950">
              Chưa có thay đổi nào được ghi nhận
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-500">
              Khi trạng thái, tiến độ hoặc công việc thay đổi, nhật ký sẽ xuất hiện ở đây.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
