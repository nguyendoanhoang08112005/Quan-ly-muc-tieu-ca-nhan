import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, PencilLine, Plus } from "lucide-react";
import { PageEmptyState, PageHero, PageSectionTitle } from "@/components/shared/app-page-patterns";
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
import { listMilestoneQuickCreateOptionsForGoal } from "@/server/modules/milestones/queries";
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

  const quickCreateMilestones = project.goal
    ? await listMilestoneQuickCreateOptionsForGoal(
        userId,
        BigInt(project.goal.id)
      )
    : [];

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <PageHero
        actions={
          <>
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
            <Link
              className={cn(buttonVariants({ variant: "secondary" }), "gap-2 rounded-full")}
              href={`/projects/${project.id}/edit` as Route}
            >
              <PencilLine className="h-4 w-4" />
              Chỉnh sửa
            </Link>
            <DeleteProjectForm projectId={project.id} />
          </>
        }
        aside={
          <div className="rounded-[1.45rem] border border-[#eadfd4] bg-[#fffaf6] px-4 py-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
              Ngữ cảnh
            </p>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <div className="flex items-center justify-between gap-3">
                <span>Trạng thái</span>
                <span className="font-semibold text-stone-950">{projectStatusLabels[project.status]}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Mục tiêu</span>
                <span className="font-semibold text-stone-950">{project.goal?.title ?? "Chưa gắn"}</span>
              </div>
            </div>
          </div>
        }
        description={project.description}
        eyebrow="Chi tiết dự án"
        metrics={[
          { label: "Tiến độ", value: `${Math.round(project.progress)}%`, hint: "Toàn bộ dự án", tone: "warm" },
          { label: "Công việc", value: project.tasksCount, hint: "Đang gắn vào dự án" },
          { label: "Hoàn thành", value: project.completedTasksCount, hint: "Đã xong", tone: "bamboo" }
        ]}
        title={project.name}
        trailVariant="mixed"
      />

      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap gap-3 text-sm">
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

        {quickCreateMilestones.length > 0 ? (
          <div className="mt-6 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
                  Tạo nhanh công việc
                </p>
                <h2 className="mt-2 text-xl font-black text-stone-950">
                  Chọn cột mốc để thêm việc cho dự án này
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Dự án đang gắn với mục tiêu {project.goal?.title}, nên bạn có
                  thể tạo việc mới trực tiếp trong các cột mốc liên quan.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {quickCreateMilestones.map((milestone) => (
                <Link
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "h-auto min-h-11 gap-2 rounded-full px-4 py-3 text-left"
                  )}
                  href={`/goals/${milestone.goal.id}/milestones/${milestone.id}/tasks/new` as Route}
                  key={milestone.id}
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span>
                    Cột mốc {milestone.sequenceNo}: {milestone.title}
                    <span className="block text-xs font-medium text-stone-500">
                      {milestone.tasksCount} công việc hiện có
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="space-y-6">
        <PageSectionTitle eyebrow="Công việc trong dự án" title="Công việc trong dự án này" />

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
                        {task.dueAt
                          ? `Hạn ${formatDisplayDateTime(task.dueAt)}`
                          : "Chưa đặt hạn"}
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
          <PageEmptyState
            action={
              quickCreateMilestones.length > 0 ? (
                <>
                  {quickCreateMilestones.map((milestone) => (
                    <Link
                      className={cn(
                        buttonVariants({ variant: "secondary" }),
                        "gap-2 rounded-full"
                      )}
                      href={`/goals/${milestone.goal.id}/milestones/${milestone.id}/tasks/new` as Route}
                      key={milestone.id}
                    >
                      <Plus className="h-4 w-4" />
                      Cột mốc {milestone.sequenceNo}
                    </Link>
                  ))}
                </>
              ) : undefined
            }
            description="Hãy tạo công việc mới trong cột mốc liên quan rồi gắn dự án này ngay trong biểu mẫu công việc."
            title="Dự án này chưa có công việc nào"
          />
        )}
      </section>
    </div>
  );
}
