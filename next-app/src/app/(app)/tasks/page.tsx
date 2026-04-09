import Link from "next/link";
import { CheckCircle2, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageFilterForm } from "@/components/shared/page-filter-form";
import { WorkspaceViewTabs } from "@/components/shared/workspace-view-tabs";
import { goalPriorityLabels, workStatusClassNames, workStatusLabels } from "@/features/goals/goal-helpers";
import { CompleteTaskForm } from "@/features/tasks/components/complete-task-form";
import { DeleteTaskForm } from "@/features/tasks/components/delete-task-form";
import { TaskBoard } from "@/features/tasks/components/task-board";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDateTime } from "@/lib/dates";
import { getSingleSearchParam, matchesSearchTerm } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { listMilestoneQuickCreateOptionsForUser } from "@/server/modules/milestones/queries";
import { listTasksForUser } from "@/server/modules/tasks/queries";

type TasksPageProps = {
  searchParams?: Promise<{
    focus?: string | string[];
    q?: string | string[];
    status?: string | string[];
    view?: string | string[];
  }>;
};

function buildTasksHref({
  focus,
  q,
  status,
  view
}: {
  focus: string;
  q: string;
  status: string;
  view: "board" | "list";
}) {
  const params = new URLSearchParams();

  if (q) {
    params.set("q", q);
  }

  if (status !== "all") {
    params.set("status", status);
  }

  if (focus !== "all") {
    params.set("focus", focus);
  }

  if (view !== "board") {
    params.set("view", view);
  }

  const query = params.toString();

  return query ? `/tasks?${query}` : "/tasks";
}

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
  const view = getSingleSearchParam(resolvedSearchParams?.view) === "list" ? "list" : "board";

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
    <div className="flex w-full max-w-none flex-col gap-4">
      <section className="ui-toolbar-panel px-4 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">
              Công việc
            </p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-stone-950">
              Workspace công việc
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Tập trung vào bảng và danh sách gọn, không còn card dài và section lớn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <WorkspaceViewTabs
              tabs={[
                {
                  active: view === "board",
                  count: filteredTasks.length,
                  href: buildTasksHref({
                    focus: focusFilter,
                    q: query,
                    status: statusFilter,
                    view: "board"
                  }),
                  label: "Bảng"
                },
                {
                  active: view === "list",
                  count: filteredTasks.length,
                  href: buildTasksHref({
                    focus: focusFilter,
                    q: query,
                    status: statusFilter,
                    view: "list"
                  }),
                  label: "Danh sách"
                }
              ]}
            />

            {quickCreateMilestones.length > 0 ? (
              <details className="rounded-full border border-stone-200 bg-white">
                <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm font-semibold text-stone-700 [&::-webkit-details-marker]:hidden">
                  <Plus className="h-4 w-4" />
                  Tạo nhanh
                </summary>
                <div className="flex max-w-[28rem] flex-wrap gap-2 border-t border-stone-200 p-3">
                  {quickCreateMilestones.slice(0, 6).map((milestone) => (
                    <Link
                      className={cn(
                        buttonVariants({ size: "sm", variant: "secondary" }),
                        "h-auto min-h-8 rounded-full px-3 py-2 text-xs"
                      )}
                      href={`/goals/${milestone.goal.id}/milestones/${milestone.id}/tasks/new`}
                      key={milestone.id}
                    >
                      {milestone.goal.title} · {milestone.sequenceNo}
                    </Link>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="ui-pill">
            Tổng việc
            <strong className="font-semibold text-stone-900">{filteredTasks.length}</strong>
          </span>
          <span className="ui-pill">
            Tập trung
            <strong className="font-semibold text-stone-900">{focusTasks.length}</strong>
          </span>
          <span className="ui-pill">
            Hoàn thành
            <strong className="font-semibold text-stone-900">{completedTasks.length}</strong>
          </span>
          <span className="ui-pill">
            Cột mốc tạo nhanh
            <strong className="font-semibold text-stone-900">
              {quickCreateMilestones.length}
            </strong>
          </span>
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
            label: "Tập trung",
            name: "focus",
            options: [
              { label: "Tất cả công việc", value: "all" },
              { label: "Chỉ việc tập trung", value: "focus" },
              { label: "Không phải việc tập trung", value: "non_focus" }
            ],
            value: focusFilter
          }
        ]}
        hiddenFields={view === "list" ? [{ name: "view", value: "list" }] : []}
        resetHref={view === "list" ? "/tasks?view=list" : "/tasks"}
        resultLabel={`Đang hiển thị ${filteredTasks.length}/${tasks.length} công việc.`}
        searchPlaceholder="Tìm theo tên việc, mục tiêu, cột mốc hoặc dự án"
        searchValue={query}
      />

      {filteredTasks.length > 0 ? (
        view === "board" ? (
          <TaskBoard tasks={filteredTasks} />
        ) : (
          <section className="ui-panel divide-y divide-stone-200 overflow-hidden">
            {filteredTasks.map((task) => (
              <article
                className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
                key={task.id}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    {task.isFocus ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        Tập trung
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        workStatusClassNames[task.status]
                      )}
                    >
                      {workStatusLabels[task.status]}
                    </span>
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
                      {goalPriorityLabels[task.priority]}
                    </span>
                  </div>

                  <h2 className="mt-2 text-sm font-semibold text-stone-950">
                    {task.title}
                  </h2>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] text-stone-500">
                    <span className="rounded-full bg-stone-100 px-2 py-0.5">
                      {task.goalTitle}
                    </span>
                    {task.milestoneTitle ? (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5">
                        Cột mốc {task.milestoneSequenceNo}: {task.milestoneTitle}
                      </span>
                    ) : null}
                    {task.project ? (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5">
                        {task.project.name}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-stone-100 px-2 py-0.5">
                      {task.dueAt ? formatDisplayDateTime(task.dueAt) : "Chưa đặt hạn"}
                    </span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5">
                      {task.completedSubtasksCount}/{task.subtasksCount} việc con •{" "}
                      {Math.round(task.progress)}%
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "rounded-full")}
                    href={`/goals/${task.goalId}/tasks/${task.id}/edit`}
                  >
                    Mở
                  </Link>
                  <Link
                    className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "rounded-full")}
                    href={`/pomodoro?taskId=${task.id}`}
                  >
                    Pomodoro
                  </Link>
                  <CompleteTaskForm
                    disabled={task.status === "completed"}
                    goalId={task.goalId}
                    projectId={task.project?.id}
                    size="sm"
                    taskId={task.id}
                  />
                  <DeleteTaskForm
                    goalId={task.goalId}
                    projectId={task.project?.id}
                    size="sm"
                    taskId={task.id}
                  />
                </div>
              </article>
            ))}
          </section>
        )
      ) : tasks.length > 0 ? (
        <section className="ui-panel border-dashed px-6 py-10 text-center">
          <h2 className="text-xl font-black text-stone-950">
            Không có công việc khớp bộ lọc
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Hãy nới lỏng từ khóa hoặc trạng thái để quay lại danh sách rộng hơn.
          </p>
        </section>
      ) : (
        <section className="ui-panel border-dashed px-6 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
            <CheckCircle2 className="h-6 w-6 text-stone-500" />
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-stone-950">
            Chưa có công việc nào
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600">
            Hãy tạo công việc trong một cột mốc để bắt đầu theo dõi công việc theo
            kiểu workspace.
          </p>
          {quickCreateMilestones.length > 0 ? (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {quickCreateMilestones.slice(0, 4).map((milestone) => (
                <Link
                  className={cn(
                    buttonVariants({ size: "sm", variant: "secondary" }),
                    "rounded-full"
                  )}
                  href={`/goals/${milestone.goal.id}/milestones/${milestone.id}/tasks/new`}
                  key={milestone.id}
                >
                  {milestone.goal.title} · {milestone.sequenceNo}
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}
