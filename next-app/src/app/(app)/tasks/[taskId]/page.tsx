import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Layers3,
  PencilLine,
  Target,
  TimerReset
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  goalPriorityClassNames,
  goalPriorityLabels,
  workStatusClassNames,
  workStatusLabels
} from "@/features/goals/goal-helpers";
import { TaskSubtasksPanel } from "@/features/subtasks/components/task-subtasks-panel";
import { CompleteTaskForm } from "@/features/tasks/components/complete-task-form";
import { DeleteTaskForm } from "@/features/tasks/components/delete-task-form";
import { taskIdSchema } from "@/features/tasks/schemas/task-schemas";
import type { TaskListItem } from "@/features/tasks/types";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { getTaskDetailForUser } from "@/server/modules/tasks/queries";

type TaskDetailPageProps = {
  params: Promise<{
    taskId: string;
  }>;
};

type InfoTone = "neutral" | "success" | "warning" | "danger";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function isTaskOverdue(task: TaskListItem, referenceNow = Date.now()) {
  if (!task.dueAt || task.status === "completed") {
    return false;
  }

  const dueTime = new Date(task.dueAt).getTime();

  return !Number.isNaN(dueTime) && dueTime < referenceNow;
}

function formatMinutes(value: number | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  return `${value} phút`;
}

function getStartOfDayTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function getDueInsight(task: TaskListItem, referenceDate: Date) {
  if (!task.dueAt) {
    return {
      label: "Hạn",
      value: "Chưa đặt hạn",
      hint: "Thêm hạn nếu việc này cần ưu tiên theo thời gian",
      tone: "neutral" as const
    };
  }

  const dueDate = new Date(task.dueAt);

  if (Number.isNaN(dueDate.getTime())) {
    return {
      label: "Hạn",
      value: "Hạn chưa hợp lệ",
      hint: "Cần sửa lại hạn công việc",
      tone: "danger" as const
    };
  }

  const dayDelta = Math.round(
    (getStartOfDayTime(dueDate) - getStartOfDayTime(referenceDate)) /
      DAY_IN_MILLISECONDS
  );
  const dueLabel = formatDisplayDateTime(task.dueAt);

  if (task.status === "completed") {
    return {
      label: "Hạn",
      value: dueLabel,
      hint: "Đã hoàn thành",
      tone: "success" as const
    };
  }

  if (dueDate.getTime() < referenceDate.getTime()) {
    const overdueDays = Math.abs(dayDelta);

    return {
      label: "Hạn",
      value: dueLabel,
      hint: overdueDays > 0 ? `Quá hạn ${overdueDays} ngày` : "Quá hạn hôm nay",
      tone: "danger" as const
    };
  }

  if (dayDelta === 0) {
    return {
      label: "Hạn",
      value: dueLabel,
      hint: "Hôm nay",
      tone: "warning" as const
    };
  }

  if (dayDelta === 1) {
    return {
      label: "Hạn",
      value: dueLabel,
      hint: "Ngày mai",
      tone: "warning" as const
    };
  }

  return {
    label: "Hạn",
    value: dueLabel,
    hint: `Còn ${dayDelta} ngày`,
    tone: "neutral" as const
  };
}

function getSubtaskProgressHint(task: TaskListItem) {
  if (task.subtasksCount === 0) {
    return "Chưa có việc con";
  }

  return `${task.completedSubtasksCount}/${task.subtasksCount} việc con đã xong`;
}

function SummaryCard({
  hint,
  label,
  tone = "neutral",
  value
}: {
  hint: string;
  label: string;
  tone?: InfoTone;
  value: ReactNode;
}) {
  const toneClassNames = {
    danger: "border-rose-200 bg-rose-50 text-rose-700",
    neutral: "border-stone-200 bg-white text-stone-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700"
  } as const;

  return (
    <div className={cn("rounded-lg border px-4 py-3", toneClassNames[tone])}>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] opacity-75">
        {label}
      </p>
      <div className="mt-2 break-words text-2xl font-black text-stone-950">
        {value}
      </div>
      <p className="mt-1 text-xs leading-5 opacity-80">{hint}</p>
    </div>
  );
}

function DetailRow({
  children,
  icon,
  label
}: {
  children: ReactNode;
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="grid gap-1 border-b border-stone-100 py-3 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-500">
        {icon}
        {label}
      </div>
      <div className="min-w-0 break-words text-sm font-semibold text-stone-950">
        {children}
      </div>
    </div>
  );
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { taskId } = await params;
  const parsedTaskId = taskIdSchema.safeParse(taskId);

  if (!parsedTaskId.success) {
    notFound();
  }

  const task = await getTaskDetailForUser(userId, BigInt(parsedTaskId.data));

  if (!task) {
    notFound();
  }

  const referenceDate = new Date();
  const overdue = isTaskOverdue(task, referenceDate.getTime());
  const progress = Math.round(task.progress);
  const dueInsight = getDueInsight(task, referenceDate);
  const editHref = `/goals/${task.goalId}/tasks/${task.id}/edit` as Route;
  const goalHref = `/goals/${task.goalId}` as Route;
  const projectHref = task.project ? (`/projects/${task.project.id}` as Route) : null;

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <Link
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "w-fit gap-2 rounded-lg border-stone-200 bg-white"
        )}
        href={"/tasks" as Route}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {task.isFocus ? (
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700">
                  Tập trung
                </span>
              ) : null}
              <span
                className={cn(
                  "rounded-md px-2.5 py-1",
                  workStatusClassNames[task.status]
                )}
              >
                {workStatusLabels[task.status]}
              </span>
              <span
                className={cn(
                  "rounded-md px-2.5 py-1",
                  goalPriorityClassNames[task.priority]
                )}
              >
                Ưu tiên {goalPriorityLabels[task.priority]}
              </span>
              {overdue ? (
                <span className="rounded-md bg-rose-100 px-2.5 py-1 text-rose-700">
                  Quá hạn
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 break-words text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              {task.title}
            </h1>
            <p className="mt-3 max-w-4xl break-words text-sm leading-7 text-stone-600">
              {task.description || "Thêm mô tả khi cần làm rõ đầu ra, phạm vi hoặc lưu ý quan trọng."}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                hint={task.isFocus ? "Đang được ghim tập trung" : "Theo trạng thái hiện tại"}
                label="Trạng thái"
                tone={task.status === "completed" ? "success" : overdue ? "danger" : "neutral"}
                value={workStatusLabels[task.status]}
              />
              <SummaryCard
                hint={getSubtaskProgressHint(task)}
                label="Tiến độ"
                tone={task.status === "completed" ? "success" : "neutral"}
                value={`${progress}%`}
              />
              <SummaryCard
                hint={dueInsight.hint}
                label={dueInsight.label}
                tone={dueInsight.tone}
                value={dueInsight.value}
              />
              <SummaryCard
                hint={`Thực tế: ${formatMinutes(task.actualMinutes, "chưa ghi nhận")}`}
                label="Ước lượng"
                value={formatMinutes(task.estimatedMinutes, "Chưa đặt")}
              />
            </div>
          </div>

          <aside className="flex flex-col gap-2">
            {task.status !== "completed" ? (
              <CompleteTaskForm
                className="w-full rounded-lg !text-white"
                goalId={task.goalId}
                idleLabel="Đánh dấu hoàn thành"
                pendingLabel="Đang hoàn thành..."
                projectId={task.project?.id}
                taskId={task.id}
                variant="default"
              />
            ) : (
              <div className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Đã hoàn thành
              </div>
            )}
            {task.status !== "completed" ? (
              <Link
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "justify-start gap-2 rounded-lg border-stone-200 bg-white"
                )}
                href={`/pomodoro?taskId=${task.id}` as Route}
              >
                <TimerReset className="h-4 w-4" />
                Bắt đầu Pomodoro
              </Link>
            ) : null}
            <Link
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "justify-start gap-2 rounded-lg border-stone-200 bg-white"
              )}
              href={editHref}
            >
              <PencilLine className="h-4 w-4" />
              Sửa công việc
            </Link>
            <div className="mt-2 border-t border-stone-200 pt-2">
              <DeleteTaskForm
                className="w-full justify-start rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                goalId={task.goalId}
                idleLabel="Xóa công việc"
                projectId={task.project?.id}
                redirectTo={"/tasks" as Route}
                variant="ghost"
                taskId={task.id}
              />
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                  Tiến độ
                </p>
                <p className="mt-2 text-4xl font-black tracking-tight text-stone-950">
                  {progress}%
                </p>
              </div>
              <p className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-700">
                {getSubtaskProgressHint(task)}
              </p>
            </div>

            <div
              aria-label={`Tiến độ công việc ${progress}%`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progress}
              className="mt-5 h-2 overflow-hidden rounded bg-stone-100"
              role="progressbar"
            >
              <div
                className={cn(
                  "h-full rounded",
                  task.status === "completed"
                    ? "bg-emerald-500"
                    : overdue
                      ? "bg-rose-500"
                      : "bg-stone-950"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-xl font-black tracking-tight text-stone-950">
              Mô tả đầu ra
            </h2>
            <p className="mt-3 max-w-4xl break-words text-sm leading-7 text-stone-600">
              {task.description || "Chưa có mô tả cho công việc này."}
            </p>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <TaskSubtasksPanel subtasks={task.subtasks} taskId={task.id} />
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-black tracking-tight text-stone-950">
              Ngữ cảnh
            </h2>
            <div className="mt-2">
              <DetailRow icon={<Target className="h-4 w-4" />} label="Mục tiêu">
                <Link className="hover:text-stone-600" href={goalHref}>
                  {task.goalTitle}
                </Link>
              </DetailRow>
              <DetailRow icon={<Layers3 className="h-4 w-4" />} label="Cột mốc">
                {task.milestoneTitle
                  ? `Mốc ${task.milestoneSequenceNo}: ${task.milestoneTitle}`
                  : "Chưa gắn cột mốc"}
              </DetailRow>
              <DetailRow icon={<FolderKanban className="h-4 w-4" />} label="Dự án">
                {projectHref && task.project ? (
                  <Link className="hover:text-stone-600" href={projectHref}>
                    {task.project.name}
                  </Link>
                ) : (
                  "Chưa gắn dự án"
                )}
              </DetailRow>
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-black tracking-tight text-stone-950">
              Thời gian
            </h2>
            <div className="mt-2">
              <DetailRow icon={<CalendarDays className="h-4 w-4" />} label="Hạn">
                <span className={overdue ? "text-rose-700" : undefined}>
                  {dueInsight.value}
                </span>
                <span className="mt-1 block text-xs font-medium text-stone-500">
                  {dueInsight.hint}
                </span>
              </DetailRow>
              <DetailRow icon={<Clock3 className="h-4 w-4" />} label="Dự kiến">
                {formatMinutes(task.estimatedMinutes, "Chưa ước lượng")}
              </DetailRow>
              <DetailRow icon={<Clock3 className="h-4 w-4" />} label="Thực tế">
                {formatMinutes(task.actualMinutes, "Chưa ghi nhận")}
              </DetailRow>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
