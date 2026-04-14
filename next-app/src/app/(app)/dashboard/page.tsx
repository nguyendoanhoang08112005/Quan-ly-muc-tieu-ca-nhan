import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  Flame,
  ListChecks,
  PawPrint,
  Plus,
  Sparkles,
  Target
} from "lucide-react";
import { PawTrail } from "@/components/ornaments/paw-trail";
import { buttonVariants } from "@/components/ui/button";
import type {
  DashboardRecentLog,
  DashboardUpcomingTask
} from "@/features/dashboard/types";
import {
  goalLogTypeLabels,
  goalPriorityClassNames,
  goalPriorityLabels,
  goalStatusClassNames,
  goalStatusLabels,
  workStatusClassNames,
  workStatusLabels
} from "@/features/goals/goal-helpers";
import type { GoalListItem } from "@/features/goals/types";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { getDashboardOverviewForUser } from "@/server/modules/dashboard/queries";
import { listMilestoneQuickCreateOptionsForUser } from "@/server/modules/milestones/queries";
import { listTasksForUser } from "@/server/modules/tasks/queries";

function getDateTime(value: string | null) {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

function isTaskOverdue(task: DashboardUpcomingTask, referenceTime: number) {
  return getDateTime(task.dueAt) < referenceTime;
}

function isTaskDueToday(task: DashboardUpcomingTask, referenceDate: Date) {
  if (!task.dueAt) {
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

function compareDashboardTasks(
  referenceTime: number,
  left: DashboardUpcomingTask,
  right: DashboardUpcomingTask
) {
  const leftOverdue = isTaskOverdue(left, referenceTime) ? 1 : 0;
  const rightOverdue = isTaskOverdue(right, referenceTime) ? 1 : 0;

  if (leftOverdue !== rightOverdue) {
    return rightOverdue - leftOverdue;
  }

  const leftFocus = left.isFocus ? 1 : 0;
  const rightFocus = right.isFocus ? 1 : 0;

  if (leftFocus !== rightFocus) {
    return rightFocus - leftFocus;
  }

  return getDateTime(left.dueAt) - getDateTime(right.dueAt);
}

function getDueLabel(
  task: DashboardUpcomingTask,
  referenceDate: Date,
  referenceTime: number
) {
  if (!task.dueAt) {
    return "Chưa đặt hạn";
  }

  if (isTaskOverdue(task, referenceTime)) {
    return `Quá hạn · ${formatDisplayDateTime(task.dueAt)}`;
  }

  if (isTaskDueToday(task, referenceDate)) {
    return `Hôm nay · ${formatDisplayDateTime(task.dueAt)}`;
  }

  return formatDisplayDateTime(task.dueAt);
}

function getDueBadgeClassName(
  task: DashboardUpcomingTask,
  referenceDate: Date,
  referenceTime: number
) {
  if (isTaskOverdue(task, referenceTime)) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (isTaskDueToday(task, referenceDate)) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-[#dfead8] bg-[#f8fcf5] text-[#547447]";
}

function getBriefCopy({
  focusTasks,
  overdueTasks,
  tasksToday
}: {
  focusTasks: number;
  overdueTasks: number;
  tasksToday: number;
}) {
  if (overdueTasks > 0) {
    return {
      description: "Đưa các việc quá hạn về đúng trạng thái trước khi nhận thêm việc mới.",
      label: "Cần xử lý ngay",
      tone: "alert"
    } as const;
  }

  if (focusTasks > 0) {
    return {
      description: "Giữ board gọn bằng cách xử lý nhóm việc ưu tiên trước.",
      label: "Có việc tập trung",
      tone: "focus"
    } as const;
  }

  if (tasksToday > 0) {
    return {
      description: "Hôm nay đã có hạn rõ ràng. Mở hàng đợi để chọn việc tiếp theo.",
      label: "Có hạn hôm nay",
      tone: "today"
    } as const;
  }

  return {
    description: "Không có hạn gấp. Đây là lúc thêm việc tiếp theo hoặc rà lại mục tiêu.",
    label: "Board đang yên",
    tone: "calm"
  } as const;
}

function MetricTile({
  hint,
  icon,
  label,
  tone = "neutral",
  value
}: {
  hint: string;
  icon: ReactNode;
  label: string;
  tone?: "neutral" | "focus" | "alert" | "success";
  value: ReactNode;
}) {
  const toneClassNames = {
    alert: "border-rose-200 bg-rose-50",
    focus: "border-[#efe5c8] bg-[#fffaf0]",
    neutral: "border-[#ebe1d7] bg-white",
    success: "border-[#dfead8] bg-[#f8fcf5]"
  } as const;

  return (
    <div className={cn("rounded-[1.25rem] border px-4 py-3 shadow-sm", toneClassNames[tone])}>
      <div className="flex items-center gap-2 text-stone-500">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl font-black text-stone-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-stone-500">{hint}</p>
    </div>
  );
}

function SectionPanel({
  action,
  children,
  description,
  eyebrow,
  title
}: {
  action?: ReactNode;
  children: ReactNode;
  description?: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="rounded-[2rem] border border-[#e8dfd5] bg-white p-4 shadow-[0_20px_50px_-40px_rgba(28,25,23,0.2)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-400">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-950">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
          ) : null}
        </div>
        {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function TaskQueueItem({
  referenceDate,
  referenceTime,
  task
}: {
  referenceDate: Date;
  referenceTime: number;
  task: DashboardUpcomingTask;
}) {
  return (
    <Link
      className="group block rounded-[1.35rem] border border-[#ece2d8] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] p-4 transition hover:-translate-y-0.5 hover:border-[#d7cabb] hover:shadow-[0_18px_34px_-28px_rgba(28,25,23,0.28)]"
      href={`/tasks/${task.id}` as Route}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="line-clamp-2 text-base font-black tracking-tight text-stone-950">
            {task.title}
          </p>
          <p className="mt-1 line-clamp-1 text-sm text-stone-500">
            {task.goal.title}
            {task.milestone ? ` · Mốc ${task.milestone.sequenceNo}` : ""}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-stone-950" />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
            getDueBadgeClassName(task, referenceDate, referenceTime)
          )}
        >
          {getDueLabel(task, referenceDate, referenceTime)}
        </span>
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
        {task.isFocus ? (
          <span className="rounded-full bg-stone-950 px-2.5 py-1 text-[11px] font-semibold text-white">
            Tập trung
          </span>
        ) : null}
      </div>
    </Link>
  );
}

function GoalSnapshotItem({ goal }: { goal: GoalListItem }) {
  const progress = Math.min(100, Math.max(0, Math.round(goal.progress)));

  return (
    <Link
      className="group block rounded-[1.35rem] border border-[#ece2d8] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#d7cabb] hover:shadow-[0_18px_34px_-30px_rgba(28,25,23,0.24)]"
      href={`/goals/${goal.id}` as Route}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="line-clamp-2 text-base font-black tracking-tight text-stone-950">
            {goal.title}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                goalStatusClassNames[goal.status]
              )}
            >
              {goalStatusLabels[goal.status]}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                goalPriorityClassNames[goal.priority]
              )}
            >
              {goalPriorityLabels[goal.priority]}
            </span>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-stone-950" />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-stone-500">
          <span>{progress}% tiến độ</span>
          <span>{formatDisplayDate(goal.targetDate, "Chưa có hạn")}</span>
        </div>
        <div
          aria-label={`Tiến độ mục tiêu ${progress}%`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100"
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-stone-950"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-stone-500">
          {goal.milestonesCount} mốc · {goal.tasksCount} việc
        </p>
      </div>
    </Link>
  );
}

function RecentLogItem({ log }: { log: DashboardRecentLog }) {
  return (
    <Link
      className="group block rounded-[1.2rem] border border-[#ece2d8] bg-[#fcfaf8] px-4 py-3 transition hover:border-[#d7cabb] hover:bg-white"
      href={`/goals/${log.goal.id}` as Route}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">
            {goalLogTypeLabels[log.logType] ?? "Nhật ký"}
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-bold text-stone-950">
            {log.title || log.content || log.goal.title}
          </p>
          <p className="mt-1 line-clamp-1 text-xs text-stone-500">
            {log.goal.title}
            {log.taskTitle ? ` · ${log.taskTitle}` : ""}
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-stone-400">
          {formatDisplayDateTime(log.loggedAt)}
        </span>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const userId = await requireAuthenticatedUserId();
  const [dashboard, tasks, quickCreateMilestones] = await Promise.all([
    getDashboardOverviewForUser(userId),
    listTasksForUser(userId),
    listMilestoneQuickCreateOptionsForUser(userId, 100)
  ]);
  const referenceDate = new Date();
  const referenceTime = referenceDate.getTime();
  const openTasks = tasks.filter((task) => task.status !== "completed");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const focusTasks = openTasks.filter((task) => task.isFocus);
  const overdueTasks = dashboard.summary.overdueTasks;
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const priorityTasks = [...dashboard.upcomingTasks].sort((left, right) =>
    compareDashboardTasks(referenceTime, left, right)
  );
  const nextTask = priorityTasks[0] ?? null;
  const brief = getBriefCopy({
    focusTasks: focusTasks.length,
    overdueTasks,
    tasksToday: dashboard.summary.tasksToday
  });
  const quickCreateMilestone = quickCreateMilestones[0] ?? null;
  const quickAddHref = quickCreateMilestone
    ? (`/goals/${quickCreateMilestone.goal.id}/milestones/${quickCreateMilestone.id}/tasks/new` as Route)
    : ("/goals" as Route);
  const quickAddLabel = quickCreateMilestone
    ? `Mốc ${quickCreateMilestone.sequenceNo} · ${quickCreateMilestone.goal.title}`
    : "Tạo mục tiêu và cột mốc trước";
  const nearestGoal = dashboard.metadata.nearestDeadlineGoal;

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <section className="relative overflow-hidden rounded-[2.1rem] border border-[#e8dfd5] bg-white px-5 py-5 shadow-[0_20px_50px_-40px_rgba(28,25,23,0.22)]">
        <div className="pointer-events-none absolute -right-10 top-0 h-32 w-32 rounded-full bg-[#fff0e7] blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 top-0 h-28 w-28 rounded-full bg-[#f3f8ee] blur-3xl" />
        <PawTrail className="right-20 top-16 h-24 w-[14rem]" variant="mixed" />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="rounded-[1.75rem] border border-[#eee4da] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] p-4 shadow-[0_18px_36px_-30px_rgba(28,25,23,0.22)] sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd3] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  Dashboard
                </div>
                <div
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold",
                    brief.tone === "alert"
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-[#f2d8cc] bg-[#fff6f1] text-[#b8694d]"
                  )}
                >
                  {brief.tone === "alert" ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <PawPrint className="h-3.5 w-3.5" />
                  )}
                  {brief.label}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "gap-2 rounded-full !text-white shadow-[0_12px_24px_-18px_rgba(28,25,23,0.3)]"
                  )}
                  href={quickAddHref}
                >
                  <Plus className="h-4 w-4" />
                  {quickCreateMilestone ? "Thêm việc" : "Mở mục tiêu"}
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ size: "sm", variant: "secondary" }),
                    "rounded-full border-[#e5dbd0] bg-white"
                  )}
                  href="/tasks/board"
                >
                  Mở bảng kéo thả
                </Link>
              </div>
            </div>

            <div className="mt-5 max-w-3xl">
              <h1 className="text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
                Chọn đúng việc tiếp theo.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
                Dashboard này ưu tiên việc cần xử lý trước, mục tiêu đang chạy và nhật ký mới nhất trước khi bạn đi vào board kéo thả.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricTile
                hint={`${dashboard.summary.tasksToday} việc có hạn hôm nay`}
                icon={<Compass className="h-4 w-4" />}
                label="Đang mở"
                value={openTasks.length}
              />
              <MetricTile
                hint="Việc đang được đánh dấu ưu tiên"
                icon={<Target className="h-4 w-4" />}
                label="Tập trung"
                tone="focus"
                value={focusTasks.length}
              />
              <MetricTile
                hint="Cần kéo lại trạng thái hoặc cập nhật hạn"
                icon={<AlertTriangle className="h-4 w-4" />}
                label="Quá hạn"
                tone={overdueTasks > 0 ? "alert" : "success"}
                value={overdueTasks}
              />
              <MetricTile
                hint={`${completedTasks.length}/${tasks.length} việc đã xong`}
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Hoàn thành"
                tone="success"
                value={`${completionRate}%`}
              />
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-stone-950 bg-stone-950 p-5 text-white shadow-[0_22px_48px_-30px_rgba(12,10,9,0.88)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              Điều nên làm trước
            </p>
            <h2 className="mt-4 text-2xl font-black tracking-tight">
              {nextTask ? nextTask.title : "Board đang đủ thoáng"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              {nextTask
                ? getDueLabel(nextTask, referenceDate, referenceTime)
                : brief.description}
            </p>

            {nextTask ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    workStatusClassNames[nextTask.status]
                  )}
                >
                  {workStatusLabels[nextTask.status]}
                </span>
                {nextTask.isFocus ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                    Việc tập trung
                  </span>
                ) : null}
              </div>
            ) : null}

            <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                Quick add mặc định
              </p>
              <p className="mt-2 line-clamp-2 text-sm font-semibold text-white">
                {quickAddLabel}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full bg-white !text-stone-950 hover:bg-stone-100"
                )}
                href={nextTask ? (`/tasks/${nextTask.id}` as Route) : ("/tasks/board" as Route)}
              >
                {nextTask ? "Mở việc này" : "Mở bảng kéo thả"}
              </Link>
              <Link
                className="inline-flex h-8 items-center justify-center rounded-full border border-white/15 px-3 text-[13px] font-semibold text-white transition hover:bg-white/10"
                href={quickAddHref}
              >
                Thêm việc
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <SectionPanel
          action={
            <Link
              className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "rounded-full")}
              href="/tasks"
            >
              Xem tất cả
            </Link>
          }
          description="Danh sách này lấy việc có hạn trong 7 ngày và đẩy quá hạn hoặc việc tập trung lên đầu."
          eyebrow="Hàng đợi"
          title="Việc cần xử lý trước"
        >
          {priorityTasks.length > 0 ? (
            <div className="grid gap-3">
              {priorityTasks.slice(0, 5).map((task) => (
                <TaskQueueItem
                  key={task.id}
                  referenceDate={referenceDate}
                  referenceTime={referenceTime}
                  task={task}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-stone-300 bg-[#fcfaf8] px-5 py-8 text-center">
              <ListChecks className="mx-auto h-7 w-7 text-stone-400" />
              <p className="mt-3 text-base font-black text-stone-950">
                Chưa có việc gấp trong 7 ngày tới
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                Nếu hôm nay cần tạo nhịp mới, dùng quick add để thêm việc vào mốc gần nhất.
              </p>
            </div>
          )}
        </SectionPanel>

        <div className="grid gap-4">
          <SectionPanel
            action={
              <Link
                className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "rounded-full")}
                href="/goals"
              >
                Mở mục tiêu
              </Link>
            }
            description={
              nearestGoal
                ? `Deadline gần nhất: ${nearestGoal.title} · ${formatDisplayDate(nearestGoal.targetDate)}`
                : "Các mục tiêu đang chạy sẽ xuất hiện ở đây."
            }
            eyebrow="Mục tiêu"
            title="Đang chạy"
          >
            {dashboard.activeGoals.length > 0 ? (
              <div className="grid gap-3">
                {dashboard.activeGoals.map((goal) => (
                  <GoalSnapshotItem goal={goal} key={goal.id} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-stone-300 bg-[#fcfaf8] p-5 text-sm leading-6 text-stone-500">
                Chưa có mục tiêu đang chạy. Tạo mục tiêu đầu tiên để board có ngữ cảnh rõ hơn.
              </div>
            )}
          </SectionPanel>

          <SectionPanel
            description={`${dashboard.metadata.categories} danh mục · ${dashboard.metadata.tags} thẻ đang hỗ trợ phân loại.`}
            eyebrow="Dòng chảy"
            title="Nhật ký gần đây"
          >
            {dashboard.recentLogs.length > 0 ? (
              <div className="grid gap-2.5">
                {dashboard.recentLogs.slice(0, 5).map((log) => (
                  <RecentLogItem key={log.id} log={log} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-stone-300 bg-[#fcfaf8] p-5 text-sm leading-6 text-stone-500">
                Chưa có nhật ký. Khi bạn cập nhật tiến độ hoặc trạng thái, hoạt động mới sẽ hiện ở đây.
              </div>
            )}
          </SectionPanel>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Bảng kéo thả
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-950">
              Đã tách thành trang riêng
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600">
              Dashboard giữ vai trò tổng quan. Khi cần thao tác kéo thả, mở trang bảng riêng để không nhầm với danh sách hoặc nhật ký.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-stone-500">
            <span className="rounded-full border border-[#e8ddd2] bg-white px-3 py-1.5">
              <Clock3 className="mr-1 inline h-3.5 w-3.5" />
              {dashboard.summary.tasksToday} hạn hôm nay
            </span>
            <span className="rounded-full border border-[#e8ddd2] bg-white px-3 py-1.5">
              <Flame className="mr-1 inline h-3.5 w-3.5" />
              {focusTasks.length} tập trung
            </span>
            <span className="rounded-full border border-[#e8ddd2] bg-white px-3 py-1.5">
              <CalendarDays className="mr-1 inline h-3.5 w-3.5" />
              {openTasks.length} đang mở
            </span>
          </div>
        </div>

        <section className="rounded-[2rem] border border-[#e8dfd5] bg-white p-5 shadow-[0_20px_50px_-40px_rgba(28,25,23,0.2)]">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-lg font-black tracking-tight text-stone-950">
                Mở bảng kéo thả công việc
              </p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
                Trang này chỉ dùng để nắm ưu tiên. Bảng kéo thả có URL riêng, nav riêng và CTA riêng để người dùng nhận ra đó là nơi thao tác board.
              </p>
            </div>
            <Link
              className={cn(buttonVariants(), "gap-2 rounded-full !text-white")}
              href="/tasks/board"
            >
              Mở bảng kéo thả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
