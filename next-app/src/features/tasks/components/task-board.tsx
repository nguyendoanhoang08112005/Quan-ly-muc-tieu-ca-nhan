"use client";

import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CircleDot,
  Clock3,
  GripVertical,
  Layers3,
  LoaderCircle,
  Plus,
  Sparkles,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  goalPriorityLabels,
  workStatusClassNames,
  workStatusLabels
} from "@/features/goals/goal-helpers";
import type { GoalPriority, WorkStatus } from "@/features/goals/types";
import type {
  TaskListItem,
  TaskQuickCreateMilestoneOption
} from "@/features/tasks/types";
import { formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";

const taskColumns: Array<{
  accentClassName: string;
  status: WorkStatus;
  description: string;
}> = [
  {
    accentClassName: "from-stone-100 to-white",
    description: "Chưa bắt đầu",
    status: "not_started"
  },
  {
    accentClassName: "from-sky-100 to-white",
    description: "Đang làm",
    status: "in_progress"
  },
  {
    accentClassName: "from-amber-100 to-white",
    description: "Tạm dừng",
    status: "paused"
  },
  {
    accentClassName: "from-emerald-100 to-white",
    description: "Đã xong",
    status: "completed"
  }
];

type TaskApiResource = {
  id: number | string | null;
  goal_id: number | string | null;
  milestone_id: number | string | null;
  title: string;
  description: string;
  status: WorkStatus;
  sort_order: number;
  priority: GoalPriority;
  progress_percentage: number;
  due_at: string | null;
  estimated_minutes: number | null;
  actual_minutes: number | null;
  is_focus: boolean;
  project: {
    id: number | string | null;
    name: string;
    color: string | null;
  } | null;
  goal?: {
    id: number | string | null;
    title: string;
  };
  milestone?:
    | {
        id: number | string | null;
        title: string | null;
        sequence_no: number | null;
      }
    | null;
  subtasks: Array<{
    id: number | string | null;
    name: string;
    status: "pending" | "in_progress" | "completed";
    completed_at: string | null;
    sort_order: number;
  }>;
};

type InlineTaskDraft = {
  dueAt: string;
  isFocus: boolean;
  priority: GoalPriority;
  title: string;
};

type TaskBoardGoalOption = {
  id: string;
  milestonesCount: number;
  title: string;
};

function padDateTimePart(value: number) {
  return `${value}`.padStart(2, "0");
}

function formatDateTimeLocalValue(date: Date) {
  return [
    date.getFullYear(),
    padDateTimePart(date.getMonth() + 1),
    padDateTimePart(date.getDate())
  ].join("-") + `T${padDateTimePart(date.getHours())}:${padDateTimePart(date.getMinutes())}`;
}

function buildQuickDueAt(daysToAdd: number, hours: number, minutes = 0) {
  const date = new Date();

  date.setDate(date.getDate() + daysToAdd);
  date.setHours(hours, minutes, 0, 0);

  return formatDateTimeLocalValue(date);
}

function getTodayDateValue() {
  const date = new Date();

  return [
    date.getFullYear(),
    padDateTimePart(date.getMonth() + 1),
    padDateTimePart(date.getDate())
  ].join("-");
}

function getDatePartFromDateTimeLocalValue(value: string) {
  const [datePart] = value.split("T");

  return datePart ?? "";
}

function getTimePartFromDateTimeLocalValue(value: string) {
  const [, timePart] = value.split("T");

  return timePart ?? "09:00";
}

function joinDateAndTimeParts(datePart: string, timePart: string) {
  if (!datePart) {
    return "";
  }

  return `${datePart}T${timePart || "09:00"}`;
}

function toStringId(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return `${value}`;
}

function buildOptimisticTask({
  draft,
  milestone,
  sortOrder,
  status,
  taskId
}: {
  draft: InlineTaskDraft;
  milestone: TaskQuickCreateMilestoneOption;
  sortOrder: number;
  status: WorkStatus;
  taskId: string;
}): TaskListItem {
  return {
    id: taskId,
    title: draft.title.trim(),
    description: "",
    status,
    sortOrder,
    priority: draft.priority,
    progress: status === "completed" ? 100 : 0,
    dueAt: draft.dueAt ? new Date(draft.dueAt).toISOString() : null,
    estimatedMinutes: null,
    actualMinutes: null,
    isFocus: draft.isFocus,
    goalId: milestone.goal.id,
    goalTitle: milestone.goal.title,
    milestoneId: milestone.id,
    milestoneTitle: milestone.title,
    milestoneSequenceNo: milestone.sequenceNo,
    project: null,
    subtasks: [],
    subtasksCount: 0,
    completedSubtasksCount: 0
  };
}

function mapTaskApiResourceToTaskListItem(
  task: TaskApiResource,
  fallbackMilestone: TaskQuickCreateMilestoneOption
): TaskListItem {
  return {
    id: toStringId(task.id) ?? "",
    title: task.title,
    description: task.description,
    status: task.status,
    sortOrder: task.sort_order,
    priority: task.priority,
    progress: task.progress_percentage,
    dueAt: task.due_at,
    estimatedMinutes: task.estimated_minutes,
    actualMinutes: task.actual_minutes,
    isFocus: task.is_focus,
    goalId: toStringId(task.goal?.id ?? task.goal_id) ?? fallbackMilestone.goal.id,
    goalTitle: task.goal?.title ?? fallbackMilestone.goal.title,
    milestoneId:
      toStringId(task.milestone?.id ?? task.milestone_id) ?? fallbackMilestone.id,
    milestoneTitle: task.milestone?.title ?? fallbackMilestone.title,
    milestoneSequenceNo: task.milestone?.sequence_no ?? fallbackMilestone.sequenceNo,
    project: task.project?.id
      ? {
          id: toStringId(task.project.id) ?? "",
          name: task.project.name,
          color: task.project.color
        }
      : null,
    subtasks: task.subtasks.map((subtask) => ({
      id: toStringId(subtask.id) ?? "",
      name: subtask.name,
      status: subtask.status,
      completedAt: subtask.completed_at,
      sortOrder: subtask.sort_order
    })),
    subtasksCount: task.subtasks.length,
    completedSubtasksCount: task.subtasks.filter((subtask) => {
      return subtask.status === "completed";
    }).length
  };
}

function compareTasksForBoard(left: TaskListItem, right: TaskListItem) {
  if (left.sortOrder !== right.sortOrder) {
    return left.sortOrder - right.sortOrder;
  }

  return left.id.localeCompare(right.id, "vi");
}

function getOrderedStatusTasks(tasks: TaskListItem[], status: WorkStatus) {
  return tasks.filter((task) => task.status === status).sort(compareTasksForBoard);
}

function getTaskStatusFromDndData(
  data: Record<string, unknown> | undefined
): WorkStatus | null {
  const status = data?.status;

  if (
    status === "not_started" ||
    status === "in_progress" ||
    status === "paused" ||
    status === "completed"
  ) {
    return status;
  }

  return null;
}

function getTaskIdFromDndData(data: Record<string, unknown> | undefined) {
  const taskId = data?.taskId;

  return typeof taskId === "string" && taskId.trim() ? taskId : null;
}

function getEmptyColumnMessage(status: WorkStatus) {
  switch (status) {
    case "not_started":
      return "Chưa có việc chờ bắt đầu. Tạo nhanh một việc để lên kế hoạch rõ hơn.";
    case "in_progress":
      return "Chưa có việc đang làm. Kéo một việc sang đây khi bạn bắt đầu xử lý.";
    case "paused":
      return "Không có việc đang tạm dừng. Cột này dùng cho các việc cần quay lại sau.";
    case "completed":
      return "Chưa có việc hoàn thành. Khi xong, kéo việc sang đây để chốt trạng thái.";
  }
}

function buildReorderedBoardTasks(
  tasks: TaskListItem[],
  taskId: string,
  nextStatus: WorkStatus,
  overTaskId: string | null
) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return null;
  }

  const destinationTasks = getOrderedStatusTasks(tasks, nextStatus).filter(
    (item) => item.id !== taskId
  );
  const currentOrderedIds = getOrderedStatusTasks(tasks, nextStatus).map((item) => item.id);
  let insertIndex = destinationTasks.length;

  if (overTaskId) {
    const overIndex = destinationTasks.findIndex((item) => item.id === overTaskId);

    if (overIndex >= 0) {
      insertIndex = overIndex;
    }
  }

  const movedTask: TaskListItem = {
    ...task,
    progress:
      nextStatus === "completed" ? 100 : task.progress === 100 ? 0 : task.progress,
    sortOrder: 0,
    status: nextStatus
  };
  const reorderedDestinationTasks = [...destinationTasks];

  reorderedDestinationTasks.splice(insertIndex, 0, movedTask);

  const nextOrderedIds = reorderedDestinationTasks.map((item) => item.id);

  if (
    task.status === nextStatus &&
    nextOrderedIds.length === currentOrderedIds.length &&
    nextOrderedIds.every((value, index) => value === currentOrderedIds[index])
  ) {
    return null;
  }

  const nextSortOrders = new Map<string, number>();

  reorderedDestinationTasks.forEach((item, index) => {
    nextSortOrders.set(item.id, (index + 1) * 1000);
  });

  return {
    nextTasks: tasks.map((item) => {
      if (item.id === task.id) {
        return {
          ...movedTask,
          sortOrder: nextSortOrders.get(item.id) ?? item.sortOrder
        };
      }

      if (item.status === nextStatus && nextSortOrders.has(item.id)) {
        return {
          ...item,
          sortOrder: nextSortOrders.get(item.id) ?? item.sortOrder
        };
      }

      return item;
    }),
    orderedTaskIds: nextOrderedIds
  };
}

function TaskCardContent({
  referenceNow,
  task
}: {
  referenceNow: number;
  task: TaskListItem;
}) {
  const contextLabel = task.milestoneSequenceNo
    ? `Cột mốc ${task.milestoneSequenceNo}`
    : task.goalTitle;
  const isOverdue =
    task.dueAt !== null &&
    task.status !== "completed" &&
    new Date(task.dueAt).getTime() < referenceNow;

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5">
            {isOverdue ? (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-semibold text-rose-700">
                Quá hạn
              </span>
            ) : null}
            {task.isFocus ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                Tập trung
              </span>
            ) : null}
            <span className="rounded-full border border-stone-200 bg-white px-2 py-0.5 text-[9px] font-semibold text-stone-600">
              {goalPriorityLabels[task.priority]}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-[13px] font-semibold leading-5 text-stone-950">
            {task.title}
          </h3>
        </div>
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-stone-500">
        <span className="rounded-full bg-stone-100 px-2 py-0.5 font-medium text-stone-600">
          {contextLabel}
        </span>
        {task.project ? (
          <span className="rounded-full bg-stone-100 px-2 py-0.5 font-medium text-stone-600">
            {task.project.name}
          </span>
        ) : null}
        {task.dueAt ? (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-medium",
              isOverdue
                ? "bg-rose-100 text-rose-700"
                : "bg-stone-100 text-stone-700"
            )}
          >
            {formatDisplayDateTime(task.dueAt)}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-[10px] text-stone-500">
          {task.subtasksCount > 0 ? (
            <>
              <span className="inline-flex items-center gap-1">
                <Layers3 className="h-3 w-3" />
                {task.completedSubtasksCount}/{task.subtasksCount} việc con
              </span>
              <span className="text-stone-300">•</span>
              <span className="inline-flex items-center gap-1">
                <CircleDot className="h-3 w-3" />
                {task.progress}% tiến độ
              </span>
            </>
          ) : (
            <span className="truncate">{task.goalTitle}</span>
          )}
        </div>
        <Link
          className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-900 transition hover:text-stone-600"
          href={`/goals/${task.goalId}/tasks/${task.id}/edit`}
        >
          Mở
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </>
  );
}

function TaskBoardCard({
  referenceNow,
  syncing,
  task
}: {
  referenceNow: number;
  syncing: boolean;
  task: TaskListItem;
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef: setDragNodeRef,
    transform
  } = useDraggable({
    data: {
      status: task.status,
      taskId: task.id,
      type: "task"
    },
    disabled: syncing,
    id: `task-${task.id}`
  });
  const { isOver, setNodeRef: setDropNodeRef } = useDroppable({
    data: {
      status: task.status,
      taskId: task.id,
      type: "task"
    },
    id: `task-drop-${task.id}`
  });

  return (
    <article
      {...attributes}
      {...listeners}
      className={cn(
        "ui-card-compact cursor-grab touch-none p-3 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md",
        isDragging && "cursor-grabbing opacity-60 shadow-lg",
        syncing && "ring-1 ring-stone-300",
        isOver && !isDragging && "border-stone-950"
      )}
      ref={(node) => {
        setDragNodeRef(node);
        setDropNodeRef(node);
      }}
      style={{
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        willChange: isDragging ? "transform" : undefined
      }}
    >
      <TaskCardContent referenceNow={referenceNow} task={task} />
    </article>
  );
}

function TaskBoardColumn({
  accentClassName,
  active,
  canQuickCreate,
  children,
  creating,
  count,
  description,
  onQuickCreate,
  quickCreateMilestone,
  status,
  totalVisibleTasks
}: {
  accentClassName: string;
  active: boolean;
  canQuickCreate: boolean;
  children: ReactNode;
  creating: boolean;
  count: number;
  description: string;
  onQuickCreate: (
    status: WorkStatus,
    draft: InlineTaskDraft
  ) => Promise<boolean>;
  quickCreateMilestone: TaskQuickCreateMilestoneOption | null;
  status: WorkStatus;
  totalVisibleTasks: number;
}) {
  const { isOver, setNodeRef } = useDroppable({
    data: {
      status,
      type: "column"
    },
    id: `task-column-${status}`
  });
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("09:00");
  const [priority, setPriority] = useState<GoalPriority>("medium");
  const [isFocus, setIsFocus] = useState(status === "in_progress");
  const [showDetailedDueAt, setShowDetailedDueAt] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const ratio = totalVisibleTasks > 0 ? Math.round((count / totalVisibleTasks) * 100) : 0;

  function openComposer() {
    setIsComposerOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function updateDueAt(nextDueAt: string) {
    setDueAt(nextDueAt);
    setDueDate(getDatePartFromDateTimeLocalValue(nextDueAt));
    setDueTime(getTimePartFromDateTimeLocalValue(nextDueAt));
  }

  function closeComposer() {
    setIsComposerOpen(false);
    setTitle("");
    setDueAt("");
    setDueDate("");
    setDueTime("09:00");
    setPriority("medium");
    setIsFocus(status === "in_progress");
    setShowDetailedDueAt(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const success = await onQuickCreate(status, {
      dueAt,
      isFocus,
      priority,
      title
    });

    if (success) {
      setTitle("");
      setDueAt("");
      setDueDate("");
      setDueTime("09:00");
      setPriority("medium");
      setIsFocus(status === "in_progress");
      setShowDetailedDueAt(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  return (
    <section
      className={cn(
        "ui-board-column min-h-[calc(100vh-18rem)] overflow-hidden p-3 transition-colors",
        (active || isOver) && "border-stone-950 bg-white shadow-md"
      )}
      ref={setNodeRef}
    >
      <div className={cn("rounded-[1.25rem] bg-gradient-to-b p-3", accentClassName)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
              {description}
            </p>
          <span
            className={cn(
              "mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold",
              workStatusClassNames[status]
            )}
          >
            {workStatusLabels[status]}
          </span>
          </div>
          <span className="rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-stone-600">
            {count}
          </span>
        </div>
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-stone-900/70 transition-all"
              style={{ width: `${ratio}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] font-medium text-stone-500">
            {totalVisibleTasks > 0 ? `${ratio}% số việc đang hiển thị` : "Chưa có việc nào"}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">{children}</div>

      <div className="mt-3">
        {isComposerOpen ? (
          <form
            className="rounded-[1.5rem] border border-stone-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7f5f1_100%)] p-3.5 shadow-sm"
            onSubmit={handleSubmit}
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-600 shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  Thêm nhanh
                </div>
                <span className="text-[10px] font-medium text-stone-400">
                  {workStatusLabels[status]}
                </span>
              </div>

              <Input
                className="h-11 rounded-2xl border-stone-200 bg-white text-sm shadow-sm focus:ring-1 focus:ring-stone-950/10"
                disabled={!quickCreateMilestone || creating}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Tên việc cần làm tiếp theo"
                ref={inputRef}
                value={title}
              />

              <div className="grid gap-3">
                <div className="rounded-[1.25rem] border border-stone-200 bg-white/85 p-3 shadow-sm">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
                      Hạn hoàn thành
                    </p>
                    <p className="text-[11px] font-medium text-stone-500">
                      {dueAt ? formatDisplayDateTime(new Date(dueAt)) : "Không đặt hạn"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Không hạn", value: "" },
                      { label: "Hôm nay", value: buildQuickDueAt(0, 18) },
                      { label: "Ngày mai", value: buildQuickDueAt(1, 9) },
                      { label: "7 ngày", value: buildQuickDueAt(7, 9) }
                    ].map((option) => {
                      const isActive = dueAt === option.value;

                      return (
                        <button
                          key={option.label}
                          aria-pressed={isActive}
                          className={cn(
                            "rounded-2xl px-3 py-2 text-[12px] font-semibold transition",
                            isActive
                              ? "bg-stone-950 text-white shadow-sm"
                              : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                          )}
                          disabled={!quickCreateMilestone || creating}
                          onClick={() => {
                            updateDueAt(option.value);
                            setShowDetailedDueAt(false);
                          }}
                          type="button"
                        >
                          {option.label}
                        </button>
                      );
                    })}
                    <button
                      aria-pressed={showDetailedDueAt}
                      className={cn(
                        "rounded-2xl px-3 py-2 text-[12px] font-semibold transition col-span-2",
                        showDetailedDueAt
                          ? "bg-stone-950 text-white shadow-sm"
                          : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                      )}
                      disabled={!quickCreateMilestone || creating}
                      onClick={() => {
                        const nextOpen = !showDetailedDueAt;

                        setShowDetailedDueAt(nextOpen);

                        if (nextOpen && !dueDate) {
                          const nextDate = getTodayDateValue();

                          setDueDate(nextDate);
                          setDueAt(joinDateAndTimeParts(nextDate, dueTime));
                        }
                      }}
                      type="button"
                    >
                      Hạn chi tiết
                    </button>
                  </div>

                  {showDetailedDueAt ? (
                    <div className="mt-3 space-y-2">
                      <Input
                        className="h-10 rounded-2xl border-stone-200 bg-white text-[11px] shadow-sm focus:ring-1 focus:ring-stone-950/10"
                        disabled={!quickCreateMilestone || creating}
                        onChange={(event) => {
                          const nextDate = event.target.value;

                          setDueDate(nextDate);
                          setDueAt(joinDateAndTimeParts(nextDate, dueTime));
                        }}
                        type="date"
                        value={dueDate}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {["09:00", "12:00", "18:00", "21:00"].map((timeValue) => {
                          const isActive = dueTime === timeValue;

                          return (
                            <button
                              key={timeValue}
                              aria-pressed={isActive}
                              className={cn(
                                "rounded-2xl px-3 py-2 text-[12px] font-semibold transition",
                                isActive
                                  ? "bg-stone-950 text-white shadow-sm"
                                  : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                              )}
                              disabled={!quickCreateMilestone || creating}
                              onClick={() => {
                                setDueTime(timeValue);
                                setDueAt(joinDateAndTimeParts(dueDate, timeValue));
                              }}
                              type="button"
                            >
                              {timeValue}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem]">
                  <div className="rounded-[1.25rem] border border-stone-200 bg-white/85 p-3 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
                      Cột mốc
                    </p>
                    <p className="mt-1 text-sm font-semibold text-stone-800">
                      {quickCreateMilestone
                        ? `Mốc ${quickCreateMilestone.sequenceNo} · ${quickCreateMilestone.title}`
                        : "Chưa chọn cột mốc"}
                    </p>
                  </div>

                  <div className="rounded-[1.25rem] border border-stone-200 bg-white/85 p-3 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
                      Độ ưu tiên
                    </p>
                    <select
                      className="mt-2 h-10 w-full rounded-2xl border border-stone-200 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-stone-950 focus:ring-1 focus:ring-stone-950/10"
                      disabled={!quickCreateMilestone || creating}
                      onChange={(event) =>
                        setPriority(event.target.value as GoalPriority)
                      }
                      value={priority}
                    >
                      {Object.entries(goalPriorityLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  aria-pressed={isFocus}
                  className={cn(
                    "w-full rounded-2xl px-3 py-2.5 text-[12px] font-semibold transition",
                    isFocus
                      ? "bg-amber-100 text-amber-700 shadow-sm"
                      : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  )}
                  disabled={!quickCreateMilestone || creating}
                  onClick={() => setIsFocus((current) => !current)}
                  type="button"
                >
                  {isFocus ? "Đang đánh dấu ưu tiên" : "Đánh dấu là việc ưu tiên"}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-stone-200 pt-2">
                <button
                  className="rounded-full px-3 py-2 text-xs font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
                  disabled={creating}
                  onClick={closeComposer}
                  type="button"
                >
                  Hủy
                </button>
                <Button
                  className="gap-1.5 rounded-full"
                  disabled={!quickCreateMilestone || !title.trim() || creating}
                  size="sm"
                  type="submit"
                >
                  {creating ? (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  Thêm việc
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <button
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-[1.25rem] border border-dashed px-3.5 py-3 text-[13px] font-medium transition",
              canQuickCreate
                ? "border-stone-300 bg-white/70 text-stone-700 hover:border-stone-950 hover:bg-white hover:text-stone-950"
                : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
            )}
            disabled={!canQuickCreate || creating}
            onClick={openComposer}
            type="button"
          >
            <span className="inline-flex items-center gap-2">
              {creating ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="text-left">
                {creating
                  ? "Đang thêm công việc..."
                  : quickCreateMilestone
                    ? "Thêm công việc mới"
                    : "Thêm công việc"}
              </span>
            </span>
            {quickCreateMilestone ? (
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
                Mốc {quickCreateMilestone.sequenceNo}
              </span>
            ) : null}
          </button>
        )}

        {!canQuickCreate ? (
          <p className="mt-2 text-center text-xs text-stone-500">
            Hãy tạo ít nhất một cột mốc trước khi thêm công việc.
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function TaskBoard({
  goalOptions = [],
  quickCreateMilestones = [],
  referenceNow,
  tasks
}: {
  goalOptions?: TaskBoardGoalOption[];
  quickCreateMilestones?: TaskQuickCreateMilestoneOption[];
  referenceNow: string;
  tasks: TaskListItem[];
}) {
  const [boardTasks, setBoardTasks] = useState(tasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<WorkStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [creatingStatus, setCreatingStatus] = useState<WorkStatus | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState("all");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(
    quickCreateMilestones[0]?.id ?? ""
  );
  const [syncingTaskIds, setSyncingTaskIds] = useState<string[]>([]);
  const lastDropTargetRef = useRef<WorkStatus | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4
      }
    })
  );

  useEffect(() => {
    setBoardTasks(tasks);
  }, [tasks]);

  const availableGoals = useMemo(() => {
    const goalMap = new Map<string, TaskBoardGoalOption>();

    for (const goal of goalOptions) {
      goalMap.set(goal.id, goal);
    }

    for (const milestone of quickCreateMilestones) {
      if (!goalMap.has(milestone.goal.id)) {
        goalMap.set(milestone.goal.id, {
          id: milestone.goal.id,
          milestonesCount: 1,
          title: milestone.goal.title
        });
      }
    }

    for (const task of tasks) {
      if (!goalMap.has(task.goalId)) {
        goalMap.set(task.goalId, {
          id: task.goalId,
          milestonesCount: task.milestoneId ? 1 : 0,
          title: task.goalTitle
        });
      }
    }

    return [...goalMap.values()].sort((left, right) =>
      left.title.localeCompare(right.title, "vi")
    );
  }, [goalOptions, quickCreateMilestones, tasks]);

  const filteredMilestoneOptions = useMemo(() => {
    if (selectedGoalId === "all") {
      return quickCreateMilestones;
    }

    return quickCreateMilestones.filter((milestone) => {
      return milestone.goal.id === selectedGoalId;
    });
  }, [quickCreateMilestones, selectedGoalId]);

  const selectedGoal = useMemo(() => {
    if (selectedGoalId === "all") {
      return null;
    }

    return availableGoals.find((goal) => goal.id === selectedGoalId) ?? null;
  }, [availableGoals, selectedGoalId]);

  const visibleTasks = useMemo(() => {
    if (selectedGoalId === "all") {
      return boardTasks;
    }

    return boardTasks.filter((task) => task.goalId === selectedGoalId);
  }, [boardTasks, selectedGoalId]);
  const allTasksByStatus = useMemo(() => {
    const grouped = new Map<WorkStatus, TaskListItem[]>();

    for (const column of taskColumns) {
      grouped.set(column.status, getOrderedStatusTasks(boardTasks, column.status));
    }

    return grouped;
  }, [boardTasks]);

  useEffect(() => {
    if (
      selectedGoalId === "all" ||
      availableGoals.some((goal) => goal.id === selectedGoalId)
    ) {
      return;
    }

    setSelectedGoalId("all");
  }, [availableGoals, selectedGoalId]);

  useEffect(() => {
    if (
      selectedMilestoneId &&
      filteredMilestoneOptions.some((milestone) => milestone.id === selectedMilestoneId)
    ) {
      return;
    }

    setSelectedMilestoneId(filteredMilestoneOptions[0]?.id ?? "");
  }, [filteredMilestoneOptions, selectedMilestoneId]);

  const activeTask = useMemo(() => {
    return activeTaskId
      ? boardTasks.find((task) => task.id === activeTaskId) ?? null
      : null;
  }, [activeTaskId, boardTasks]);
  const selectedMilestone = useMemo(() => {
    return (
      filteredMilestoneOptions.find((milestone) => milestone.id === selectedMilestoneId) ??
      null
    );
  }, [filteredMilestoneOptions, selectedMilestoneId]);
  const stableNow = useMemo(() => new Date(referenceNow).getTime(), [referenceNow]);
  const overdueVisibleTasks = useMemo(() => {
    return visibleTasks.filter((task) => {
      return (
        task.dueAt !== null &&
        task.status !== "completed" &&
        new Date(task.dueAt).getTime() < stableNow
      );
    }).length;
  }, [stableNow, visibleTasks]);
  const focusVisibleTasks = useMemo(() => {
    return visibleTasks.filter((task) => task.isFocus).length;
  }, [visibleTasks]);
  const completedVisibleTasks = useMemo(() => {
    return visibleTasks.filter((task) => task.status === "completed").length;
  }, [visibleTasks]);

  const tasksByStatus = useMemo(() => {
    const grouped = new Map<WorkStatus, TaskListItem[]>();

    for (const column of taskColumns) {
      grouped.set(
        column.status,
        visibleTasks
          .filter((task) => task.status === column.status)
          .sort(compareTasksForBoard)
      );
    }

    return grouped;
  }, [visibleTasks]);

  function setActiveDropTarget(nextStatus: WorkStatus | null) {
    if (lastDropTargetRef.current === nextStatus) {
      return;
    }

    lastDropTargetRef.current = nextStatus;
    setDropTargetStatus(nextStatus);
  }

  function moveTask(
    taskId: string,
    nextStatus: WorkStatus,
    overTaskId: string | null
  ) {
    const reordered = buildReorderedBoardTasks(
      boardTasks,
      taskId,
      nextStatus,
      overTaskId && overTaskId !== taskId ? overTaskId : null
    );

    if (!reordered) {
      return;
    }
    const previousTasks = boardTasks;

    setErrorMessage(null);
    setBoardTasks(reordered.nextTasks);
    setSyncingTaskIds((current) =>
      current.includes(taskId) ? current : [...current, taskId]
    );

    void (async () => {
      try {
        const response = await fetch(`/api/v1/tasks/${taskId}`, {
          body: JSON.stringify({
            ordered_task_ids: reordered.orderedTaskIds,
            status: nextStatus
          }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "PATCH"
        });

        if (!response.ok) {
          let message = "Không thể cập nhật trạng thái công việc.";

          try {
            const payload = (await response.json()) as { message?: string };

            if (typeof payload.message === "string" && payload.message.trim()) {
              message = payload.message;
            }
          } catch {
            // Keep fallback message.
          }

          setBoardTasks(previousTasks);
          setErrorMessage(message);
        }
      } catch {
        setBoardTasks(previousTasks);
        setErrorMessage("Không thể kết nối để cập nhật trạng thái công việc.");
      }

      setSyncingTaskIds((current) => current.filter((id) => id !== taskId));
    })();
  }

  async function createTaskInColumn(
    status: WorkStatus,
    draft: InlineTaskDraft
  ) {
    if (!selectedMilestone) {
      setErrorMessage("Hãy chọn một cột mốc để tạo công việc.");
      return false;
    }

    const trimmedTitle = draft.title.trim();

    if (!trimmedTitle) {
      setErrorMessage("Tên công việc không được để trống.");
      return false;
    }

    const tempTaskId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? `temp-${crypto.randomUUID()}`
        : `temp-${Date.now()}`;
    const nextSortOrder =
      ((allTasksByStatus.get(status)?.at(-1)?.sortOrder ?? 0) || 0) + 1000;
    const optimisticTask = buildOptimisticTask({
      draft,
      milestone: selectedMilestone,
      sortOrder: nextSortOrder,
      status,
      taskId: tempTaskId
    });

    setCreatingStatus(status);
    setErrorMessage(null);
    setBoardTasks((current) => [...current, optimisticTask]);

    try {
      const response = await fetch(
        `/api/v1/milestones/${selectedMilestone.id}/tasks`,
        {
          body: JSON.stringify({
            due_at: draft.dueAt || undefined,
            is_focus: draft.isFocus,
            priority: draft.priority,
            status,
            title: trimmedTitle
          }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        }
      );

      if (!response.ok) {
        let message = "Không thể tạo công việc mới trong cột này.";

        try {
          const payload = (await response.json()) as { message?: string };

          if (typeof payload.message === "string" && payload.message.trim()) {
            message = payload.message;
          }
        } catch {
          // Keep fallback message.
        }

        setBoardTasks((current) =>
          current.filter((task) => task.id !== tempTaskId)
        );
        setErrorMessage(message);
        return false;
      }

      const payload = (await response.json()) as {
        data?: TaskApiResource;
      };

      if (!payload.data) {
        setBoardTasks((current) =>
          current.filter((task) => task.id !== tempTaskId)
        );
        setErrorMessage("Đã tạo công việc nhưng không đọc được dữ liệu trả về.");
        return false;
      }

      const nextTask = mapTaskApiResourceToTaskListItem(
        payload.data,
        selectedMilestone
      );

      setBoardTasks((current) =>
        current.map((task) => (task.id === tempTaskId ? nextTask : task))
      );

      return true;
    } catch {
      setBoardTasks((current) => current.filter((task) => task.id !== tempTaskId));
      setErrorMessage("Không thể kết nối để tạo công việc mới.");
      return false;
    } finally {
      setCreatingStatus(null);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const taskId = String(event.active.id).replace(/^task-/, "");
    setActiveTaskId(taskId);
    setErrorMessage(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const nextStatus = getTaskStatusFromDndData(
      event.over?.data.current as Record<string, unknown> | undefined
    );

    setActiveDropTarget(nextStatus);
  }

  function handleDragEnd(event: DragEndEvent) {
    const taskId = String(event.active.id).replace(/^task-/, "");
    const nextStatus = getTaskStatusFromDndData(
      event.over?.data.current as Record<string, unknown> | undefined
    );
    const overTaskId = getTaskIdFromDndData(
      event.over?.data.current as Record<string, unknown> | undefined
    );

    setActiveTaskId(null);
    setActiveDropTarget(null);

    if (!nextStatus) {
      return;
    }

    moveTask(taskId, nextStatus, overTaskId);
  }

  return (
    <section className="ui-panel overflow-hidden p-3">
      <div className="rounded-[1.5rem] border border-stone-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f4_100%)] p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-600">
                <Sparkles className="h-3 w-3" />
                Board
              </div>
              <h2 className="text-base font-semibold tracking-tight text-stone-950">
                Bảng công việc
              </h2>
              <span className="ui-pill">
                {visibleTasks.length}/{boardTasks.length} việc đang hiển thị
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
                {selectedGoal ? selectedGoal.title : "Tất cả mục tiêu"}
              </span>
              {selectedMilestone ? (
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
                  Tạo nhanh vào mốc {selectedMilestone.sequenceNo}
                </span>
              ) : null}
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-[1rem] border border-stone-200 bg-white px-3 py-2.5">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">
                  <Target className="h-3.5 w-3.5" />
                  Tập trung
                </div>
                <p className="mt-1.5 text-lg font-black text-stone-950">{focusVisibleTasks}</p>
              </div>
              <div className="rounded-[1rem] border border-stone-200 bg-white px-3 py-2.5">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Quá hạn
                </div>
                <p className="mt-1.5 text-lg font-black text-stone-950">{overdueVisibleTasks}</p>
              </div>
              <div className="rounded-[1rem] border border-stone-200 bg-white px-3 py-2.5">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">
                  <CircleDot className="h-3.5 w-3.5" />
                  Hoàn thành
                </div>
                <p className="mt-1.5 text-lg font-black text-stone-950">{completedVisibleTasks}</p>
              </div>
            </div>

            {availableGoals.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
                    <Target className="h-3.5 w-3.5" />
                    Mục tiêu
                  </span>
                  <select
                    className="h-10 min-w-[14rem] w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
                    onChange={(event) => setSelectedGoalId(event.target.value)}
                    value={selectedGoalId}
                  >
                    <option value="all">Tất cả mục tiêu</option>
                    {availableGoals.map((goal) => (
                      <option key={goal.id} value={goal.id}>
                        {goal.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
                    <Layers3 className="h-3.5 w-3.5" />
                    Cột mốc để thêm nhanh
                  </span>
                  <select
                    className="h-10 min-w-[15rem] w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
                    disabled={filteredMilestoneOptions.length === 0}
                    onChange={(event) => setSelectedMilestoneId(event.target.value)}
                    value={selectedMilestoneId}
                  >
                    {filteredMilestoneOptions.length > 0 ? (
                      filteredMilestoneOptions.map((milestone) => (
                        <option key={milestone.id} value={milestone.id}>
                          {milestone.goal.title} · Cột mốc {milestone.sequenceNo}
                        </option>
                      ))
                    ) : (
                      <option value="">Mục tiêu này chưa có cột mốc</option>
                    )}
                  </select>
                </label>
              </div>
            ) : (
              <p className="text-xs font-medium text-amber-700">
                Cần có ít nhất một cột mốc để tạo công việc ngay trên board.
              </p>
            )}
          </div>

          <div className="rounded-[1.25rem] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 shadow-sm">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
              <Clock3 className="h-3.5 w-3.5" />
              Trạng thái hệ thống
            </div>
            <p className="mt-2 font-medium text-stone-800">
              {syncingTaskIds.length > 0
                ? `Đang lưu ${syncingTaskIds.length} thay đổi`
                : creatingStatus
                  ? "Đang tạo công việc mới"
                  : "Kéo thả hoặc thêm việc ngay trong từng cột"}
            </p>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {selectedGoal && filteredMilestoneOptions.length === 0 ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <span>
            Mục tiêu này chưa có cột mốc nên chưa thể tạo việc trực tiếp trên board.
          </span>
          <Link
            className="font-semibold text-amber-900 underline-offset-2 hover:underline"
            href={`/goals/${selectedGoal.id}`}
          >
            Mở mục tiêu để thêm cột mốc
          </Link>
        </div>
      ) : null}

      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <div className="mt-3 overflow-x-auto pb-1">
          <div className="grid min-w-[58rem] gap-2.5 xl:grid-cols-4">
            {taskColumns.map((column) => {
              const columnTasks = tasksByStatus.get(column.status) ?? [];

              return (
                <TaskBoardColumn
                  accentClassName={column.accentClassName}
                  active={dropTargetStatus === column.status}
                  canQuickCreate={filteredMilestoneOptions.length > 0}
                  count={columnTasks.length}
                  creating={creatingStatus === column.status}
                  description={column.description}
                  key={column.status}
                  onQuickCreate={createTaskInColumn}
                  quickCreateMilestone={selectedMilestone}
                  status={column.status}
                  totalVisibleTasks={visibleTasks.length}
                >
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                      <TaskBoardCard
                        key={task.id}
                        referenceNow={stableNow}
                        syncing={syncingTaskIds.includes(task.id)}
                        task={task}
                      />
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-stone-300 bg-white/80 px-4 py-5 text-center text-xs leading-5 text-stone-500">
                      {getEmptyColumnMessage(column.status)}
                    </div>
                  )}
                </TaskBoardColumn>
              );
            })}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div className="ui-card-compact w-[14rem] rotate-[1.5deg] p-2.5 shadow-2xl">
              <TaskCardContent referenceNow={stableNow} task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}
