import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, PencilLine } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DeleteProjectForm } from "@/features/projects/components/delete-project-form";
import {
  projectStatusClassNames,
  projectStatusLabels
} from "@/features/projects/project-helpers";
import { TaskSubtasksPanel } from "@/features/subtasks/components/task-subtasks-panel";
import { CompleteTaskForm } from "@/features/tasks/components/complete-task-form";
import { DeleteTaskForm } from "@/features/tasks/components/delete-task-form";
import { projectIdSchema } from "@/features/projects/schemas/project-schemas";
import { goalPriorityLabels, workStatusClassNames, workStatusLabels } from "@/features/goals/goal-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { getProjectDetailForUser } from "@/server/modules/projects/queries";

type ProjectDetailPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectDetailPage({
  params
}: ProjectDetailPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { projectId } = await params;
  const parsedProjectId = projectIdSchema.safeParse(projectId);

  if (!parsedProjectId.success) {
    notFound();
  }

  const project = await getProjectDetailForUser(userId, BigInt(parsedProjectId.data));

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "gap-2 rounded-full"
            )}
            href={"/projects" as Route}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại dự án
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
              href={`/projects/${project.id}/edit` as Route}
            >
              <PencilLine className="h-4 w-4" />
              Chỉnh sửa
            </Link>
            <DeleteProjectForm projectId={project.id} />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
              Chi tiết dự án
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-stone-950">
              {project.name}
            </h1>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              {project.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <span
                className={cn(
                  "rounded-full px-3 py-1 font-semibold",
                  projectStatusClassNames[project.status]
                )}
              >
                {projectStatusLabels[project.status]}
              </span>
              {project.goal ? (
                <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                  {project.goal.title}
                </span>
              ) : null}
              <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                Bắt đầu {formatDisplayDate(project.startDate)}
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                Kết thúc {formatDisplayDate(project.endDate)}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:w-[440px] lg:grid-cols-1">
            <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
                Tiến độ
              </div>
              <div className="mt-2 text-4xl font-black">
                {Math.round(project.progress)}%
              </div>
            </div>
            <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                  Công việc
                </div>
                <div className="mt-2 text-3xl font-black text-stone-950">
                  {project.tasksCount}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                  Hoàn thành
                </div>
                <div className="mt-2 text-3xl font-black text-stone-950">
                  {project.completedTasksCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
            Công việc trong dự án
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
            Công việc trong dự án này
          </h2>
        </div>

        {project.tasks.length > 0 ? (
          <div className="grid gap-6">
            {project.tasks.map((task) => (
              <article
                className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
                key={task.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
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
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                        {goalPriorityLabels[task.priority]}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-black text-stone-950">
                      {task.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {task.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-stone-500">
                      <span className="rounded-full bg-stone-100 px-3 py-1">
                        Mục tiêu: {task.goalTitle}
                      </span>
                      {task.milestoneTitle ? (
                        <span className="rounded-full bg-stone-100 px-3 py-1">
                          Cột mốc {task.milestoneSequenceNo}: {task.milestoneTitle}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-stone-100 px-3 py-1">
                        Hạn {formatDisplayDateTime(task.dueAt)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-stone-50 px-4 py-4 text-right">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                      Tiến độ
                    </div>
                    <div className="mt-2 text-3xl font-black text-stone-950">
                      {Math.round(task.progress)}%
                    </div>
                  </div>
                </div>

                <TaskSubtasksPanel subtasks={task.subtasks} taskId={task.id} />

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-stone-200 pt-5">
                  <Link
                    className={cn(buttonVariants({ variant: "secondary" }))}
                    href={`/goals/${task.goalId}` as Route}
                  >
                    Xem mục tiêu
                  </Link>
                  <Link
                    className={cn(buttonVariants({ variant: "secondary" }))}
                    href={`/goals/${task.goalId}/tasks/${task.id}/edit` as Route}
                  >
                    Sửa công việc
                  </Link>
                  <CompleteTaskForm
                    disabled={task.status === "completed"}
                    goalId={task.goalId}
                    projectId={project.id}
                    taskId={task.id}
                  />
                  <DeleteTaskForm
                    goalId={task.goalId}
                    projectId={project.id}
                    taskId={task.id}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
            <h3 className="text-2xl font-black text-stone-950">
              Dự án này chưa có công việc nào
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-500">
              Hãy chỉnh sửa công việc hiện có để gắn vào dự án, hoặc tạo công
              việc mới trong cột mốc và chọn dự án ngay trong biểu mẫu công việc.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
