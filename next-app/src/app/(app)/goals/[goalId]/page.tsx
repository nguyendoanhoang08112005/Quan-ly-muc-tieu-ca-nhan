import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, PencilLine, Plus } from "lucide-react";
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
            href={"/goals" as Route}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại mục tiêu
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
              href={`/goals/${goal.id}/edit` as Route}
            >
              <PencilLine className="h-4 w-4" />
              Chỉnh sửa
            </Link>
            <Link
              className={cn(buttonVariants({ size: "default" }), "gap-2")}
              href={`/goals/${goal.id}/milestones/new` as Route}
            >
              <Plus className="h-4 w-4" />
              Thêm cột mốc
            </Link>
            <DeleteGoalForm goalId={goal.id} />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
              Chi tiết mục tiêu
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
                Ưu tiên {goalPriorityLabels[goal.priority]}
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                Hạn {formatDisplayDate(goal.targetDate)}
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                {goal.isPublic ? "Công khai để theo dõi" : "Riêng tư"}
              </span>
            </div>

            {goal.category || goal.tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {goal.category ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
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
                    className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-600"
                    key={tag.id}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-stone-400"
                      style={{
                        backgroundColor: tag.color ?? undefined
                      }}
                    />
                    #{tag.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:w-[440px] lg:grid-cols-1">
            <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
                  Tiến độ
              </div>
              <div className="mt-2 text-4xl font-black">
                {Math.round(goal.progress)}%
              </div>
            </div>
            <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                  Cột mốc
                </div>
                <div className="mt-2 text-3xl font-black text-stone-950">
                  {goal.milestonesCount}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                  Công việc hoàn thành
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
              Luồng chính
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
              Cột mốc và công việc trong mục tiêu
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
              Trang chi tiết này đọc dữ liệu lồng nhau theo đúng thứ tự cũ:
              cột mốc theo số thứ tự, công việc theo mức độ tập trung, thứ tự
              sắp xếp rồi đến hạn.
            </p>
          </div>

          <Link
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            href={`/goals/${goal.id}/milestones/new` as Route}
          >
            <Plus className="h-4 w-4" />
            Tạo cột mốc mới
          </Link>
        </div>

        {goal.milestones.length > 0 ? (
          <div className="space-y-6">
            {goal.milestones.map((milestone) => {
              const parsedMilestoneId = milestoneIdSchema.safeParse(milestone.id);

              if (!parsedMilestoneId.success) {
                return null;
              }

              return (
                <article
                  className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
                  key={milestone.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
                        Cột mốc {milestone.sequenceNo}
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
                        Tiến độ
                      </div>
                      <div className="text-2xl font-black text-stone-950">
                        {Math.round(milestone.progress)}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 text-sm">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 font-semibold",
                        workStatusClassNames[milestone.status]
                      )}
                    >
                      {workStatusLabels[milestone.status]}
                    </span>
                    <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                      Bắt đầu {formatDisplayDate(milestone.startDate)}
                    </span>
                    <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                      Mục tiêu {formatDisplayDate(milestone.targetDate)}
                    </span>
                    <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                      {milestone.tasksCount} công việc
                    </span>
                  </div>

                  {milestone.note ? (
                    <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-600">
                      {milestone.note}
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-stone-200 pt-5">
                    <Link
                      className={cn(
                        buttonVariants({ variant: "secondary" }),
                        "gap-2"
                      )}
                      href={`/goals/${goal.id}/milestones/${milestone.id}/edit` as Route}
                    >
                      <PencilLine className="h-4 w-4" />
                      Sửa cột mốc
                    </Link>
                    <Link
                      className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
                      href={`/goals/${goal.id}/milestones/${milestone.id}/tasks/new` as Route}
                    >
                      <Plus className="h-4 w-4" />
                      Thêm công việc
                    </Link>
                    <DeleteMilestoneForm
                      goalId={goal.id}
                      milestoneId={parsedMilestoneId.data}
                    />
                  </div>

                  {milestone.tasks.length > 0 ? (
                    <div className="mt-6 grid gap-4">
                      {milestone.tasks.map((task) => {
                        const parsedTaskId = taskIdSchema.safeParse(task.id);

                        if (!parsedTaskId.success) {
                          return null;
                        }

                        return (
                          <div
                            className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4"
                            key={task.id}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="flex flex-wrap gap-2">
                                  {task.isFocus ? (
                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
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
                                  Tiến độ
                                </div>
                                <div className="text-2xl font-black text-stone-950">
                                  {Math.round(task.progress)}%
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-stone-500">
                              {task.project ? (
                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1">
                                  <span
                                    className="h-2.5 w-2.5 rounded-full bg-stone-400"
                                    style={{
                                      backgroundColor: task.project.color ?? undefined
                                    }}
                                  />
                                  Dự án: {task.project.name}
                                </span>
                              ) : null}
                              <span className="rounded-full bg-white px-3 py-1">
                                {task.dueAt
                                  ? `Hạn ${formatDisplayDateTime(task.dueAt)}`
                                  : "Chưa đặt hạn"}
                              </span>
                              {task.estimatedMinutes ? (
                                <span className="rounded-full bg-white px-3 py-1">
                                  Ước tính {task.estimatedMinutes} phút
                                </span>
                              ) : null}
                              {task.actualMinutes ? (
                                <span className="rounded-full bg-white px-3 py-1">
                                  Thực tế {task.actualMinutes} phút
                                </span>
                              ) : null}
                              <span className="rounded-full bg-white px-3 py-1">
                                Công việc con {task.completedSubtasksCount}/{task.subtasksCount}
                              </span>
                            </div>

                            <TaskSubtasksPanel subtasks={task.subtasks} taskId={task.id} />

                            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-stone-200 pt-4">
                              {task.project ? (
                                <Link
                                  className={cn(buttonVariants({ variant: "secondary" }))}
                                  href={`/projects/${task.project.id}` as Route}
                                >
                                  Xem dự án
                                </Link>
                              ) : null}
                              <Link
                                className={cn(buttonVariants({ variant: "secondary" }))}
                                href={`/goals/${goal.id}/tasks/${task.id}/edit` as Route}
                              >
                                Sửa công việc
                              </Link>
                              <CompleteTaskForm
                                disabled={task.status === "completed"}
                                goalId={goal.id}
                                projectId={task.project?.id}
                                taskId={parsedTaskId.data}
                              />
                              <DeleteTaskForm
                                goalId={goal.id}
                                projectId={task.project?.id}
                                taskId={parsedTaskId.data}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-5 py-6 text-sm leading-6 text-stone-500">
                      Cột mốc này chưa có công việc nào. Bạn có thể tạo công
                      việc đầu tiên ngay từ trang chi tiết này.
                    </div>
                  )}
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
              Hãy tạo cột mốc đầu tiên để tiếp tục chia mục tiêu thành các bước
              rõ ràng.
            </p>
            <div className="mt-6">
              <Link
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
                href={`/goals/${goal.id}/milestones/new` as Route}
              >
                <Plus className="h-4 w-4" />
                Tạo cột mốc đầu tiên
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
            Nhật ký mục tiêu
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
            Dòng thời gian thay đổi
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
            Mục này ghi lại các thay đổi tiến độ và sự kiện quan trọng gắn với
            mục tiêu, cột mốc và công việc.
          </p>
        </div>

        {goal.logs.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {goal.logs.map((log) => (
              <article
                className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5"
                key={log.id}
              >
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
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {log.content ?? "Không có nội dung bổ sung cho nhật ký này."}
                    </p>

                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                      {log.milestoneTitle
                        ? `Cột mốc ${log.milestoneTitle}`
                        : "Cấp mục tiêu"}
                      {log.taskTitle ? ` • Công việc ${log.taskTitle}` : ""}
                    </p>
                  </div>

                  <div className="text-sm text-stone-500">
                    {formatDisplayDateTime(log.loggedAt)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
            <h3 className="text-2xl font-black text-stone-950">
              Chưa có thay đổi nào được ghi nhận
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-500">
              Khi tiến độ hoặc công việc thay đổi, dòng thời gian sẽ bắt đầu
              hiển thị dữ liệu tại đây.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
