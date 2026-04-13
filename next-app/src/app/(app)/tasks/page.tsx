import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  Layers3,
  Target,
  TimerReset
} from "lucide-react";
import { PageEmptyState, PageHero } from "@/components/shared/app-page-patterns";
import { buttonVariants } from "@/components/ui/button";
import { PageFilterForm } from "@/components/shared/page-filter-form";
import {
  goalPriorityClassNames,
  goalPriorityLabels,
  workStatusClassNames,
  workStatusLabels
} from "@/features/goals/goal-helpers";
import { CompleteTaskForm } from "@/features/tasks/components/complete-task-form";
import { DeleteTaskForm } from "@/features/tasks/components/delete-task-form";
import type { TaskListItem } from "@/features/tasks/types";
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

const prioritySortWeight: Record<TaskListItem["priority"], number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

function getTaskDueTime(task: TaskListItem) {
  if (!task.dueAt) {
    return Number.POSITIVE_INFINITY;
  }

  const dueTime = new Date(task.dueAt).getTime();

  return Number.isNaN(dueTime) ? Number.POSITIVE_INFINITY : dueTime;
}

function isTaskOverdue(task: TaskListItem, referenceNow: number) {
  return task.status !== "completed" && getTaskDueTime(task) < referenceNow;
}

function isTaskDueToday(task: TaskListItem, referenceDate: Date) {
  if (!task.dueAt || task.status === "completed") {
    return false;
  }

  const dueDate = new Date(task.dueAt);

  return (
    !Number.isNaN(dueDate.getTime()) &&
    dueDate.getFullYear() === referenceDate.getFullYear() &&
    dueDate.getMonth() === referenceDate.getMonth() &&
    dueDate.getDate() === referenceDate.getDate()
  );
}

function compareTasksForReview(
  referenceNow: number,
  left: TaskListItem,
  right: TaskListItem
) {
  const leftCompleted = left.status === "completed" ? 1 : 0;
  const rightCompleted = right.status === "completed" ? 1 : 0;

  if (leftCompleted !== rightCompleted) {
    return leftCompleted - rightCompleted;
  }

  const leftOverdue = isTaskOverdue(left, referenceNow) ? 1 : 0;
  const rightOverdue = isTaskOverdue(right, referenceNow) ? 1 : 0;

  if (leftOverdue !== rightOverdue) {
    return rightOverdue - leftOverdue;
  }

  const leftFocus = left.isFocus && left.status !== "completed" ? 1 : 0;
  const rightFocus = right.isFocus && right.status !== "completed" ? 1 : 0;

  if (leftFocus !== rightFocus) {
    return rightFocus - leftFocus;
  }

  const leftDueTime = getTaskDueTime(left);
  const rightDueTime = getTaskDueTime(right);

  if (leftDueTime !== rightDueTime) {
    return leftDueTime - rightDueTime;
  }

  const leftPriority = prioritySortWeight[left.priority];
  const rightPriority = prioritySortWeight[right.priority];

  if (leftPriority !== rightPriority) {
    return rightPriority - leftPriority;
  }

  return left.title.localeCompare(right.title, "vi");
}

function getDueBadgeClassName(task: TaskListItem, referenceNow: number) {
  if (task.status === "completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (isTaskOverdue(task, referenceNow)) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (!task.dueAt) {
    return "border-stone-200 bg-stone-50 text-stone-500";
  }

  return "border-[#efe5c8] bg-[#fffaf0] text-[#8f5a11]";
}

function getTaskDueLabel(
  task: TaskListItem,
  referenceNow: number,
  referenceDate: Date
) {
  if (!task.dueAt) {
    return "Chưa đặt hạn";
  }

  const dueLabel = formatDisplayDateTime(task.dueAt);

  if (isTaskOverdue(task, referenceNow)) {
    return `Quá hạn: ${dueLabel}`;
  }

  if (isTaskDueToday(task, referenceDate)) {
    return `Hôm nay: ${dueLabel}`;
  }

  return dueLabel;
}

function getTaskCardAccentClassName(task: TaskListItem, referenceNow: number) {
  if (task.status === "completed") {
    return "border-l-emerald-300";
  }

  if (isTaskOverdue(task, referenceNow)) {
    return "border-l-rose-300";
  }

  if (task.isFocus) {
    return "border-l-amber-300";
  }

  return "border-l-transparent";
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const userId = await requireAuthenticatedUserId();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const tasks = await listTasksForUser(userId);
  const referenceDate = new Date();
  const referenceNow = referenceDate.getTime();
  const query = getSingleSearchParam(resolvedSearchParams?.q).trim();
  const statusFilter = getSingleSearchParam(resolvedSearchParams?.status) || "all";
  const focusFilter = getSingleSearchParam(resolvedSearchParams?.focus) || "all";

  const filteredTasks = tasks
    .filter((task) => {
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
    })
    .sort((left, right) => compareTasksForReview(referenceNow, left, right));

  const completedTasks = filteredTasks.filter((task) => task.status === "completed");
  const openTasks = filteredTasks.filter((task) => task.status !== "completed");
  const focusTasks = openTasks.filter((task) => task.isFocus);
  const overdueTasks = openTasks.filter((task) => isTaskOverdue(task, referenceNow));
  const dueTodayTasks = openTasks.filter((task) =>
    isTaskDueToday(task, referenceDate)
  );
  const unscheduledTasks = openTasks.filter((task) => !task.dueAt);
  const completionRate =
    filteredTasks.length > 0
      ? Math.round((completedTasks.length / filteredTasks.length) * 100)
      : 0;

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <PageHero
        actions={
          <>
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
          </>
        }
        aside={
          <div className="rounded-[1.45rem] border border-[#eadfd4] bg-[#fffaf6] px-4 py-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
              Rà soát nhanh
            </p>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <div className="flex items-center justify-between gap-3">
                <span>Cần xử lý</span>
                <span className="font-semibold text-stone-950">{openTasks.length}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Hạn hôm nay</span>
                <span className="font-semibold text-stone-950">{dueTodayTasks.length}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Chưa đặt hạn</span>
                <span className="font-semibold text-stone-950">{unscheduledTasks.length}</span>
              </div>
            </div>
          </div>
        }
        description="Rà soát việc cần làm trước, xem hạn và tiến độ ngay trên từng dòng."
        eyebrow="Công việc"
        metrics={[
          { icon: Compass, label: "Đang mở", value: openTasks.length, hint: "Chưa hoàn thành" },
          { icon: Target, label: "Tập trung", value: focusTasks.length, tone: "warm", hint: "Đang được ghim" },
          { icon: Clock3, label: "Quá hạn", value: overdueTasks.length, tone: overdueTasks.length > 0 ? "alert" : "neutral", hint: "Cần xem trước" },
          { icon: CheckCircle2, label: "Hoàn thành", value: `${completionRate}%`, tone: "bamboo", hint: `${completedTasks.length}/${filteredTasks.length} việc` }
        ]}
        title="Danh sách công việc"
        trailVariant="mixed"
      />

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
        <section className="overflow-hidden rounded-[1.4rem] border border-[#e5dbd0] bg-white shadow-[0_14px_34px_-28px_rgba(28,25,23,0.22)]">
          <div className="flex flex-col gap-2 border-b border-[#ede4da] bg-[#fffaf6] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                Danh sách ưu tiên
              </p>
              <h2 className="mt-1 text-lg font-black text-stone-950">
                Việc cần chú ý được đưa lên đầu
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700">
                {overdueTasks.length} quá hạn
              </span>
              <span className="rounded-full border border-[#efe5c8] bg-[#fffdf7] px-3 py-1 text-[#8f5a11]">
                {dueTodayTasks.length} hôm nay
              </span>
              <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-stone-600">
                {filteredTasks.length} đang hiển thị
              </span>
            </div>
          </div>

          {filteredTasks.map((task) => (
            <article
              className={cn(
                "grid gap-3 border-l-4 border-b border-[#eee5dc] px-4 py-4 transition last:border-b-0 hover:bg-[#fffdf9] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center",
                getTaskCardAccentClassName(task, referenceNow)
              )}
              key={task.id}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {task.isFocus ? (
                    <span className="rounded-full border border-[#f3dfb4] bg-[#fff4d8] px-2.5 py-1 text-[10px] font-semibold text-[#8f5a11]">
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
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      goalPriorityClassNames[task.priority]
                    )}
                  >
                    {goalPriorityLabels[task.priority]}
                  </span>
                </div>

                <h2 className="mt-2 text-base font-black leading-6 text-stone-950">
                  {task.title}
                </h2>
                {task.description ? (
                  <p className="mt-1 line-clamp-2 max-w-4xl text-sm leading-6 text-stone-600">
                    {task.description}
                  </p>
                ) : null}

                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-stone-500">
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
                    <Target className="h-3 w-3" />
                    {task.goalTitle}
                  </span>
                  {task.milestoneTitle ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
                      <Layers3 className="h-3 w-3" />
                      Cột mốc {task.milestoneSequenceNo}: {task.milestoneTitle}
                    </span>
                  ) : null}
                  {task.project ? (
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
                      {task.project.name}
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-semibold",
                      getDueBadgeClassName(task, referenceNow)
                    )}
                  >
                    <CalendarDays className="h-3 w-3" />
                    {getTaskDueLabel(task, referenceNow, referenceDate)}
                  </span>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div>
                    <div className="mb-1 flex items-center justify-between gap-3 text-[11px] font-semibold text-stone-500">
                      <span className="inline-flex items-center gap-1">
                        <Layers3 className="h-3 w-3" />
                        {task.completedSubtasksCount}/{task.subtasksCount} việc con
                      </span>
                      <span>{Math.round(task.progress)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          task.status === "completed"
                            ? "bg-emerald-500"
                            : isTaskOverdue(task, referenceNow)
                              ? "bg-rose-500"
                              : "bg-stone-900"
                        )}
                        style={{ width: `${Math.round(task.progress)}%` }}
                      />
                    </div>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#f8f4ef] px-3 py-1 text-[11px] font-semibold text-stone-600">
                    <Clock3 className="h-3 w-3" />
                    {task.estimatedMinutes
                      ? `${task.estimatedMinutes} phút dự kiến`
                      : "Chưa ước lượng"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end">
                <Link
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "col-span-2 gap-1.5 rounded-full !text-white sm:col-span-1"
                  )}
                  href={`/tasks/${task.id}`}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  Chi tiết
                </Link>
                {task.status !== "completed" ? (
                  <>
                    <Link
                      className={cn(
                        buttonVariants({ size: "sm", variant: "secondary" }),
                        "gap-1.5 rounded-full border-[#e5dbd0] bg-white"
                      )}
                      href={`/pomodoro?taskId=${task.id}`}
                    >
                      <TimerReset className="h-3.5 w-3.5" />
                      Pomodoro
                    </Link>
                    <CompleteTaskForm
                      className="rounded-full border-emerald-200 bg-emerald-50 !text-emerald-700 hover:bg-emerald-100"
                      goalId={task.goalId}
                      projectId={task.project?.id}
                      size="sm"
                      taskId={task.id}
                    />
                  </>
                ) : (
                  <span className="inline-flex h-8 items-center justify-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-[13px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Đã xong
                  </span>
                )}
                <DeleteTaskForm
                  className="rounded-full !text-rose-700 hover:bg-rose-50"
                  goalId={task.goalId}
                  idleLabel="Xóa"
                  pendingLabel="Đang xóa..."
                  projectId={task.project?.id}
                  size="sm"
                  taskId={task.id}
                  variant="ghost"
                />
              </div>
            </article>
          ))}
        </section>
      ) : tasks.length > 0 ? (
        <PageEmptyState
          description="Hãy nới lỏng từ khóa hoặc trạng thái để quay lại danh sách rộng hơn."
          title="Không có công việc khớp bộ lọc"
        />
      ) : (
        <PageEmptyState
          action={
            <>
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
            </>
          }
          description="Hãy bắt đầu ở Trang chủ để tạo và kéo thả công việc trong một bảng duy nhất, rồi quay lại đây khi cần rà soát chi tiết."
          title="Chưa có công việc nào"
        />
      )}
    </div>
  );
}
