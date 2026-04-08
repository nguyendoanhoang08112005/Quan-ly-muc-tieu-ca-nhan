import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, CheckCircle2, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageFilterForm } from "@/components/shared/page-filter-form";
import { goalPriorityLabels, workStatusClassNames, workStatusLabels } from "@/features/goals/goal-helpers";
import { CompleteTaskForm } from "@/features/tasks/components/complete-task-form";
import { DeleteTaskForm } from "@/features/tasks/components/delete-task-form";
import { TaskSubtasksPanel } from "@/features/subtasks/components/task-subtasks-panel";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDateTime } from "@/lib/dates";
import { getSingleSearchParam, matchesSearchTerm } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { listTasksForUser } from "@/server/modules/tasks/queries";
import { listMilestoneQuickCreateOptionsForUser } from "@/server/modules/milestones/queries";

type TasksPageProps = {
  searchParams?: Promise<{
    focus?: string | string[];
    q?: string | string[];
    status?: string | string[];
  }>;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const userId = await requireAuthenticatedUserId();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const [tasks, quickCreateMilestones] = await Promise.all([
    listTasksForUser(userId),
    listMilestoneQuickCreateOptionsForUser(userId)
  ]);
  const query = getSingleSearchParam(resolvedSearchParams?.q).trim();
  const statusFilter = getSingleSearchParam(resolvedSearchParams?.status) || "all";
  const focusFilter = getSingleSearchParam(resolvedSearchParams?.focus) || "all";
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesFocus =
      focusFilter === "all" ||
      (focusFilter === "focus" ? task.isFocus : !task.isFocus);

    return (
      matchesStatus &&
      matchesFocus &&
      matchesSearchTerm(query, [
        task.title,
        task.description,
        task.goalTitle,
        task.milestoneTitle,
        task.project?.name
      ])
    );
  });
  const focusTasks = filteredTasks.filter((task) => task.isFocus);
  const completedTasks = filteredTasks.filter((task) => task.status === "completed");

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950">
              Công việc
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Đây là nơi bạn rà soát, lọc và điều phối công việc theo mức độ
              ưu tiên. Khi cần tạo mới, bạn có thể đi thẳng vào cột mốc phù hợp
              ngay từ màn này thay vì quay vòng sang trang khác.
            </p>
          </div>

          <Link
            className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
            href={"/goals" as Route}
          >
            Về mục tiêu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
              Tổng công việc
            </div>
            <div className="mt-2 text-4xl font-black">{filteredTasks.length}</div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Đang tập trung
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {focusTasks.length}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Hoàn thành
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {completedTasks.length}
            </div>
          </div>
        </div>
      </section>

      <PageFilterForm
        filters={[
          {
            label: "Trạng thái",
            name: "status",
            options: [
              { label: "Tất cả trạng thái", value: "all" },
              { label: "Chưa bắt đầu", value: "not_started" },
              { label: "Đang thực hiện", value: "in_progress" },
              { label: "Hoàn thành", value: "completed" },
              { label: "Tạm dừng", value: "paused" }
            ],
            value: statusFilter
          },
          {
            label: "Ưu tiên hiển thị",
            name: "focus",
            options: [
              { label: "Tất cả công việc", value: "all" },
              { label: "Chỉ việc tập trung", value: "focus" },
              { label: "Không phải việc tập trung", value: "non_focus" }
            ],
            value: focusFilter
          }
        ]}
        resetHref="/tasks"
        resultLabel={`Đang hiển thị ${filteredTasks.length}/${tasks.length} công việc.`}
        searchPlaceholder="Tìm theo tên, mục tiêu, cột mốc hoặc dự án"
        searchValue={query}
      />

      {quickCreateMilestones.length > 0 ? (
        <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
                Tạo nhanh
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-950">
                Chọn cột mốc để tạo công việc ngay
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Các cột mốc dưới đây được đưa lên để bạn thêm việc mà không
                phải quay lại nhiều màn hình.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
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
                    {milestone.goal.title} • {milestone.tasksCount} công việc hiện có
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {filteredTasks.length > 0 ? (
        <section className="grid gap-6">
          {filteredTasks.map((task) => (
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

                  <h2 className="mt-4 text-2xl font-black text-stone-950">
                    {task.title}
                  </h2>
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
                    {task.project ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1">
                        <span
                          className="h-2.5 w-2.5 rounded-full bg-stone-400"
                          style={{
                            backgroundColor: task.project.color ?? undefined
                          }}
                        />
                        Dự án: {task.project.name}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-stone-100 px-3 py-1">
                      {task.dueAt
                        ? `Hạn ${formatDisplayDateTime(task.dueAt)}`
                        : "Chưa đặt hạn"}
                    </span>
                    {task.estimatedMinutes ? (
                      <span className="rounded-full bg-stone-100 px-3 py-1">
                        Ước tính {task.estimatedMinutes} phút
                      </span>
                    ) : null}
                    <span className="rounded-full bg-stone-100 px-3 py-1">
                      Công việc con {task.completedSubtasksCount}/{task.subtasksCount}
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
                  href={`/goals/${task.goalId}/tasks/${task.id}/edit` as Route}
                >
                  Sửa công việc
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
                  projectId={task.project?.id}
                  taskId={task.id}
                />
                <DeleteTaskForm
                  goalId={task.goalId}
                  projectId={task.project?.id}
                  taskId={task.id}
                />
              </div>
            </article>
          ))}
        </section>
      ) : tasks.length > 0 ? (
        <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-16 text-center shadow-sm">
          <h2 className="text-3xl font-black tracking-tight text-stone-950">
            Không có công việc khớp bộ lọc
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-600">
            Hãy nới lỏng từ khóa hoặc trạng thái để quay lại danh sách rộng hơn.
          </p>
        </section>
      ) : (
        <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <CheckCircle2 className="h-8 w-8 text-stone-500" />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-stone-950">
            Chưa có công việc nào
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-600">
            Hãy tạo công việc mới trong một cột mốc để bắt đầu theo dõi công
            việc trên hệ Next.js.
          </p>
        </section>
      )}
    </div>
  );
}
