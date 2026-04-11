import Link from "next/link";
import { CheckCircle2, Compass, Sparkles, Target } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageFilterForm } from "@/components/shared/page-filter-form";
import { goalPriorityLabels, workStatusClassNames, workStatusLabels } from "@/features/goals/goal-helpers";
import { CompleteTaskForm } from "@/features/tasks/components/complete-task-form";
import { DeleteTaskForm } from "@/features/tasks/components/delete-task-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDateTime } from "@/lib/dates";
import { getSingleSearchParam, matchesSearchTerm } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { listTasksForUser } from "@/server/modules/tasks/queries";

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
  const tasks = await listTasksForUser(userId);
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
  const openTasks = filteredTasks.filter((task) => task.status !== "completed");

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <section className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-[linear-gradient(135deg,#fcfcfb_0%,#f7f7f5_48%,#eff6ff_100%)] px-5 py-5 shadow-sm">
        <div className="pointer-events-none absolute -right-12 top-0 h-36 w-36 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-10 h-24 w-24 rounded-full bg-sky-100/70 blur-2xl" />
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Task Space
            </div>
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">
              Công việc
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-stone-950">
              Danh sách công việc
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Trang này dùng để rà soát và chỉnh chi tiết. Kéo thả trạng thái tập
              trung ở Trang chủ.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full !text-white"
              )}
              href="/dashboard"
            >
              Mở bảng công việc
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "rounded-full"
              )}
              href="/goals"
            >
              Mở mục tiêu
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-white/80 bg-white/85 px-4 py-4 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-500">
              <Compass className="h-4 w-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">Đang mở</p>
            </div>
            <p className="mt-2 text-2xl font-black text-stone-950">{openTasks.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/80 bg-white/85 px-4 py-4 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-500">
              <Target className="h-4 w-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">Tập trung</p>
            </div>
            <p className="mt-2 text-2xl font-black text-stone-950">{focusTasks.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/80 bg-white/85 px-4 py-4 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-500">
              <CheckCircle2 className="h-4 w-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">Hoàn thành</p>
            </div>
            <p className="mt-2 text-2xl font-black text-stone-950">{completedTasks.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/80 bg-white/85 px-4 py-4 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-500">
              <Sparkles className="h-4 w-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">Tổng việc</p>
            </div>
            <p className="mt-2 text-2xl font-black text-stone-950">{filteredTasks.length}</p>
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
        resetHref="/tasks"
        resultLabel={`Đang hiển thị ${filteredTasks.length}/${tasks.length} công việc.`}
        searchPlaceholder="Tìm theo tên việc, mục tiêu, cột mốc hoặc dự án"
        searchValue={query}
      />

      {filteredTasks.length > 0 ? (
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
            Hãy bắt đầu ở Trang chủ để tạo và kéo thả công việc trong một bảng duy
            nhất, rồi quay lại đây khi cần rà soát chi tiết.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link
              className={cn(buttonVariants({ size: "sm" }), "rounded-full !text-white")}
              href="/dashboard"
            >
              Mở bảng công việc
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "rounded-full"
              )}
              href="/goals"
            >
              Tạo mục tiêu trước
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
