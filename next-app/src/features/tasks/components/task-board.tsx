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
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CircleDot,
  GripVertical,
  Layers3,
  LoaderCircle,
  PawPrint,
  Plus,
  Sparkles,
  Target
} from "lucide-react";
import { PawTrail } from "@/components/ornaments/paw-trail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  goalPriorityLabels,
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
  dotClassName: string;
}> = [
  {
    accentClassName: "from-[#fbfaf8] to-white",
    description: "Chưa bắt đầu",
    dotClassName: "bg-stone-400",
    status: "not_started"
  },
  {
    accentClassName: "from-[#fff3ec] to-white",
    description: "Đang làm",
    dotClassName: "bg-[#e69675]",
    status: "in_progress"
  },
  {
    accentClassName: "from-[#fff9ee] to-white",
    description: "Tạm dừng",
    dotClassName: "bg-[#d8a64f]",
    status: "paused"
  },
  {
    accentClassName: "from-[#f0f8f2] to-white",
    description: "Đã xong",
    dotClassName: "bg-[#78a36a]",
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

type TaskQuickFilter = "all" | "completed" | "focus" | "overdue";

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

function buildMilestoneFallbackFromTask(
  task: TaskListItem
): TaskQuickCreateMilestoneOption {
  return {
    id: task.milestoneId ?? "",
    sequenceNo: task.milestoneSequenceNo ?? 0,
    targetDate: "",
    tasksCount: 0,
    title: task.milestoneTitle ?? task.goalTitle,
    goal: {
      id: task.goalId,
      title: task.goalTitle
    }
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

function isTaskOverdue(task: TaskListItem, referenceNow: number) {
  return (
    task.dueAt !== null &&
    task.status !== "completed" &&
    new Date(task.dueAt).getTime() < referenceNow
  );
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
      return "Chưa có việc mới.";
    case "in_progress":
      return "Chưa có việc đang làm.";
    case "paused":
      return "Không có việc tạm dừng.";
    case "completed":
      return "Chưa có việc hoàn thành.";
  }
}

function getQuickFilterButtonClass(value: TaskQuickFilter, active: boolean) {
  if (!active) {
    return "border border-stone-200 bg-white text-stone-700 hover:border-stone-950 hover:text-stone-950";
  }

  switch (value) {
    case "focus":
      return "border border-[#f0d6a2] bg-[#fff4d8] text-[#8f5a11]";
    case "overdue":
      return "border border-rose-200 bg-rose-50 text-rose-700";
    case "completed":
      return "border border-emerald-200 bg-emerald-50 text-emerald-700";
    case "all":
    default:
      return "border border-stone-900 bg-stone-900 text-white";
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
  onQuickMarkDone,
  onQuickStart,
  onQuickToggleFocus,
  referenceNow,
  syncing,
  task
}: {
  onQuickMarkDone: (taskId: string) => void;
  onQuickStart: (taskId: string) => void;
  onQuickToggleFocus: (taskId: string) => void;
  referenceNow: number;
  syncing: boolean;
  task: TaskListItem;
}) {
  const contextLabel = task.milestoneSequenceNo
    ? `Mốc ${task.milestoneSequenceNo}`
    : task.goalTitle;
  const isOverdue = isTaskOverdue(task, referenceNow);
  const statusActionLabel =
    task.status === "in_progress"
      ? "Xong"
      : task.status === "paused"
        ? "Tiếp"
        : task.status === "not_started"
          ? "Làm"
          : null;
  const stopCardDrag = (event: ReactPointerEvent<HTMLElement>) => {
    event.stopPropagation();
  };

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

        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 shadow-sm">
          <GripVertical className="h-3.5 w-3.5" />
        </span>
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

      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-1.5 text-[10px] text-stone-500">
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

      <div
        className="mt-3 flex items-center justify-between gap-2 border-t border-stone-200 pt-2.5"
        onPointerDown={stopCardDrag}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {statusActionLabel ? (
            <button
              className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
              disabled={syncing}
              onClick={() => {
                if (task.status === "in_progress") {
                  onQuickMarkDone(task.id);
                  return;
                }

                onQuickStart(task.id);
              }}
              type="button"
            >
              {statusActionLabel}
            </button>
          ) : null}
          {task.status !== "completed" ? (
            <button
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold transition",
                task.isFocus
                  ? "bg-[#fff0cf] text-[#925a10] hover:bg-[#fde7b2]"
                  : "border border-stone-200 bg-white text-stone-700 hover:border-stone-950 hover:text-stone-950"
              )}
              disabled={syncing}
              onClick={() => onQuickToggleFocus(task.id)}
              type="button"
            >
              {task.isFocus ? "Đang ưu tiên" : "Ưu tiên"}
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {syncing ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-500">
              <LoaderCircle className="h-3 w-3 animate-spin" />
              Đang lưu
            </span>
          ) : null}
          <Link
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-900 transition hover:text-stone-600"
            href={`/tasks/${task.id}`}
            onPointerDown={stopCardDrag}
          >
            Chi tiết
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </>
  );
}

function TaskBoardCard({
  onQuickMarkDone,
  onQuickStart,
  onQuickToggleFocus,
  referenceNow,
  syncing,
  task
}: {
  onQuickMarkDone: (taskId: string) => void;
  onQuickStart: (taskId: string) => void;
  onQuickToggleFocus: (taskId: string) => void;
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
        "cursor-grab touch-none rounded-[1.35rem] border border-[#eadfd4] bg-white p-3 transition hover:-translate-y-0.5 hover:border-[#d9c9ba] hover:shadow-[0_16px_30px_-24px_rgba(28,25,23,0.32)]",
        isDragging && "cursor-grabbing opacity-60 shadow-lg",
        syncing && "ring-1 ring-stone-300",
        isOver && !isDragging && "border-[#e8a887] shadow-[0_18px_32px_-24px_rgba(232,168,135,0.55)]"
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
      <TaskCardContent
        onQuickMarkDone={onQuickMarkDone}
        onQuickStart={onQuickStart}
        onQuickToggleFocus={onQuickToggleFocus}
        referenceNow={referenceNow}
        syncing={syncing}
        task={task}
      />
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
  dotClassName,
  dragging,
  focusCount,
  onQuickCreate,
  overdueCount,
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
  dotClassName: string;
  dragging: boolean;
  focusCount: number;
  onQuickCreate: (
    status: WorkStatus,
    draft: InlineTaskDraft
  ) => Promise<boolean>;
  overdueCount: number;
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
  const isDropHighlighted = dragging && (active || isOver);

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
        "relative min-h-[calc(100vh-18rem)] overflow-hidden rounded-[1.6rem] border border-[#eadfd4] bg-white p-3 transition-all duration-150",
        isDropHighlighted &&
          "border-[#e8a887] bg-[linear-gradient(180deg,#fffdfa_0%,#fff5ef_100%)] shadow-[0_26px_50px_-34px_rgba(232,168,135,0.4)] ring-2 ring-[#f6d9cb]"
      )}
      ref={setNodeRef}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-2 rounded-[1.5rem] border-2 border-dashed transition-all duration-150",
          isDropHighlighted
            ? "border-[#e9b79f] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(255,243,235,0.9))] opacity-100"
            : "border-transparent opacity-0"
        )}
      />

      <div className="relative z-10">
        <div className={cn("rounded-[1.3rem] border border-[#efe6dd] bg-gradient-to-b p-3", accentClassName)}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", dotClassName)} />
                <p className="text-sm font-bold text-stone-900">{workStatusLabels[status]}</p>
              </div>
              <p className="mt-1 text-[11px] font-medium text-stone-500">{description}</p>
            </div>
            <span className="rounded-full border border-[#eadfd4] bg-white px-2.5 py-1 text-[10px] font-semibold text-stone-600 shadow-sm">
              {count}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-white/80 bg-white/90 px-2 py-1 text-[10px] font-medium text-stone-600">
              {totalVisibleTasks > 0 ? `${count}/${totalVisibleTasks}` : "Trống"}
            </span>
            {focusCount > 0 ? (
              <span className="rounded-full border border-[#f3dfb4] bg-[#fff4d8] px-2 py-1 text-[10px] font-medium text-[#8f5a11]">
                {focusCount} ưu tiên
              </span>
            ) : null}
            {overdueCount > 0 ? (
              <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-medium text-rose-700">
                {overdueCount} quá hạn
              </span>
            ) : null}
            {isDropHighlighted ? (
              <span className="rounded-full border border-[#ebb89d] bg-[#fff0e8] px-2.5 py-1 text-[10px] font-semibold text-[#b66343] shadow-sm">
                Thả vào đây
              </span>
            ) : null}
          </div>
        </div>

        <div
          className={cn(
            "mt-3 space-y-2.5 transition-transform duration-150",
            isDropHighlighted && "scale-[1.01]"
          )}
        >
          {children}
        </div>

        <div className="mt-3">
          {isComposerOpen ? (
            <form
              className="rounded-[1.45rem] border border-[#eadfd4] bg-white p-3.5 shadow-[0_16px_32px_-28px_rgba(28,25,23,0.3)]"
              onSubmit={handleSubmit}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#f2d8cc] bg-[#fff6f1] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b8694d]">
                    <Sparkles className="h-3 w-3" />
                    Thêm nhanh
                  </div>
                  {quickCreateMilestone ? (
                    <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[10px] font-medium text-stone-600">
                      Mốc {quickCreateMilestone.sequenceNo}
                    </span>
                  ) : null}
                </div>

                <Input
                  className="h-11 rounded-2xl border-[#eadfd4] bg-white text-sm shadow-sm focus:ring-1 focus:ring-[#f2d8cc]"
                  disabled={!quickCreateMilestone || creating}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Việc tiếp theo"
                  ref={inputRef}
                  value={title}
                />

                <div className="flex flex-wrap gap-2">
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
                          "rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                          isActive
                            ? "border border-[#f2d8cc] bg-[#fff0e8] text-[#b66343]"
                            : "border border-stone-200 bg-white text-stone-600 hover:border-[#e8c8b4] hover:text-stone-950"
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
                      "rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                      showDetailedDueAt
                        ? "border border-[#f2d8cc] bg-[#fff0e8] text-[#b66343]"
                        : "border border-stone-200 bg-white text-stone-600 hover:border-[#e8c8b4] hover:text-stone-950"
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
                    {showDetailedDueAt ? "Ẩn giờ" : "Chi tiết"}
                  </button>
                </div>

                {showDetailedDueAt ? (
                  <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                    <Input
                      className="h-10 rounded-2xl border-[#eadfd4] bg-white text-[12px] shadow-sm focus:ring-1 focus:ring-[#f2d8cc]"
                      disabled={!quickCreateMilestone || creating}
                      onChange={(event) => {
                        const nextDate = event.target.value;

                        setDueDate(nextDate);
                        setDueAt(joinDateAndTimeParts(nextDate, dueTime));
                      }}
                      type="date"
                      value={dueDate}
                    />
                    <div className="flex flex-wrap gap-2">
                      {["09:00", "12:00", "18:00", "21:00"].map((timeValue) => {
                        const isActive = dueTime === timeValue;

                        return (
                          <button
                            key={timeValue}
                            aria-pressed={isActive}
                            className={cn(
                              "rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                              isActive
                                ? "border border-[#f2d8cc] bg-[#fff0e8] text-[#b66343]"
                                : "border border-stone-200 bg-white text-stone-600 hover:border-[#e8c8b4] hover:text-stone-950"
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

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="h-9 rounded-full border border-stone-200 bg-white px-3 text-[12px] font-medium text-stone-950 outline-none transition focus:border-[#e8c8b4] focus:ring-1 focus:ring-[#f2d8cc]"
                    disabled={!quickCreateMilestone || creating}
                    onChange={(event) =>
                      setPriority(event.target.value as GoalPriority)
                    }
                    value={priority}
                  >
                    {Object.entries(goalPriorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        Ưu tiên {label}
                      </option>
                    ))}
                  </select>

                  <button
                    aria-pressed={isFocus}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                      isFocus
                        ? "border border-[#f3dfb4] bg-[#fff4d8] text-[#8f5a11]"
                        : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
                    )}
                    disabled={!quickCreateMilestone || creating}
                    onClick={() => setIsFocus((current) => !current)}
                    type="button"
                  >
                    {isFocus ? "Đang ưu tiên" : "Ưu tiên"}
                  </button>

                  {quickCreateMilestone ? (
                    <span className="rounded-full bg-stone-100 px-3 py-1.5 text-[11px] font-medium text-stone-600">
                      {quickCreateMilestone.title}
                    </span>
                  ) : null}
                </div>

                {dueAt ? (
                  <p className="text-[11px] font-medium text-stone-500">
                    Hạn {formatDisplayDateTime(new Date(dueAt))}
                  </p>
                ) : null}

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
                    className="gap-1.5 rounded-full bg-stone-950 text-white hover:bg-stone-800"
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
                  ? "border-[#eadfd4] bg-[#fffaf6] text-stone-700 hover:border-[#e8c8b4] hover:bg-white hover:text-stone-950"
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
                  {creating ? "Đang thêm..." : "Thêm nhanh"}
                </span>
              </span>
              {quickCreateMilestone ? (
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600 shadow-sm">
                  Mốc {quickCreateMilestone.sequenceNo}
                </span>
              ) : null}
            </button>
          )}

          {!canQuickCreate ? (
            <p className="mt-2 text-center text-xs text-stone-500">
              Cần có ít nhất một cột mốc.
            </p>
          ) : null}
        </div>
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
  const [quickFilter, setQuickFilter] = useState<TaskQuickFilter>("all");
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

  const goalFilteredTasks = useMemo(() => {
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
  const visibleTasks = useMemo(() => {
    switch (quickFilter) {
      case "focus":
        return goalFilteredTasks.filter(
          (task) => task.isFocus && task.status !== "completed"
        );
      case "overdue":
        return goalFilteredTasks.filter((task) => isTaskOverdue(task, stableNow));
      case "completed":
        return goalFilteredTasks.filter((task) => task.status === "completed");
      case "all":
      default:
        return goalFilteredTasks;
    }
  }, [goalFilteredTasks, quickFilter, stableNow]);
  const overdueVisibleTasks = useMemo(() => {
    return goalFilteredTasks.filter((task) => isTaskOverdue(task, stableNow)).length;
  }, [goalFilteredTasks, stableNow]);
  const focusVisibleTasks = useMemo(() => {
    return goalFilteredTasks.filter(
      (task) => task.isFocus && task.status !== "completed"
    ).length;
  }, [goalFilteredTasks]);
  const completedVisibleTasks = useMemo(() => {
    return goalFilteredTasks.filter((task) => task.status === "completed").length;
  }, [goalFilteredTasks]);

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
  const quickFilterOptions = useMemo(
    () => [
      {
        count: goalFilteredTasks.length,
        label: "Tất cả",
        value: "all" as const
      },
      {
        count: focusVisibleTasks,
        label: "Tập trung",
        value: "focus" as const
      },
      {
        count: overdueVisibleTasks,
        label: "Quá hạn",
        value: "overdue" as const
      },
      {
        count: completedVisibleTasks,
        label: "Hoàn thành",
        value: "completed" as const
      }
    ],
    [completedVisibleTasks, focusVisibleTasks, goalFilteredTasks.length, overdueVisibleTasks]
  );
  const boardStateLabel =
    syncingTaskIds.length > 0
      ? `Đang lưu ${syncingTaskIds.length}`
      : creatingStatus
        ? "Đang thêm việc"
        : "Sẵn sàng";
  const boardContextChips = [
    {
      label: "Trạng thái",
      value: boardStateLabel
    },
    {
      label: "Mục tiêu",
      value: selectedGoal ? selectedGoal.title : "Tất cả mục tiêu"
    },
    {
      label: "Quick add",
      value: selectedMilestone ? `Mốc ${selectedMilestone.sequenceNo}` : "Chưa chọn"
    }
  ];

  async function patchTaskInline(
    taskId: string,
    payload: Record<string, unknown>,
    optimisticUpdater: (task: TaskListItem) => TaskListItem,
    fallbackMessage: string
  ) {
    const previousTasks = boardTasks;
    const previousTask = boardTasks.find((task) => task.id === taskId);

    if (!previousTask) {
      return;
    }

    setErrorMessage(null);
    setSyncingTaskIds((current) =>
      current.includes(taskId) ? current : [...current, taskId]
    );
    setBoardTasks((current) =>
      current.map((task) => (task.id === taskId ? optimisticUpdater(task) : task))
    );

    try {
      const response = await fetch(`/api/v1/tasks/${taskId}`, {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        },
        method: "PATCH"
      });

      if (!response.ok) {
        let message = fallbackMessage;

        try {
          const responsePayload = (await response.json()) as { message?: string };

          if (
            typeof responsePayload.message === "string" &&
            responsePayload.message.trim()
          ) {
            message = responsePayload.message;
          }
        } catch {
          // Keep fallback message.
        }

        setBoardTasks(previousTasks);
        setErrorMessage(message);
        return;
      }

      const responsePayload = (await response.json()) as {
        data?: TaskApiResource;
      };

      if (!responsePayload.data) {
        setBoardTasks(previousTasks);
        setErrorMessage("Đã cập nhật công việc nhưng không đọc được dữ liệu trả về.");
        return;
      }

      const nextTask = mapTaskApiResourceToTaskListItem(
        responsePayload.data,
        buildMilestoneFallbackFromTask(previousTask)
      );

      setBoardTasks((current) =>
        current.map((task) => (task.id === taskId ? nextTask : task))
      );
    } catch {
      setBoardTasks(previousTasks);
      setErrorMessage("Không thể kết nối để cập nhật công việc.");
    } finally {
      setSyncingTaskIds((current) => current.filter((id) => id !== taskId));
    }
  }

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

  function handleQuickStart(taskId: string) {
    moveTask(taskId, "in_progress", null);
  }

  function handleQuickMarkDone(taskId: string) {
    moveTask(taskId, "completed", null);
  }

  function handleQuickToggleFocus(taskId: string) {
    const task = boardTasks.find((item) => item.id === taskId);

    if (!task) {
      return;
    }

    void patchTaskInline(
      taskId,
      {
        is_focus: !task.isFocus
      },
      (currentTask) => ({
        ...currentTask,
        isFocus: !currentTask.isFocus
      }),
      "Không thể cập nhật trạng thái ưu tiên của công việc."
    );
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
    <section className="relative overflow-hidden rounded-[2rem] border border-[#e8dfd5] bg-white p-4 shadow-[0_20px_50px_-40px_rgba(28,25,23,0.22)]">
      <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#fff1e9] blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-24 w-24 rounded-full bg-[#faf7f2] blur-3xl" />

      <div className="rounded-[1.7rem] border border-[#ece2d8] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] p-4 shadow-[0_18px_40px_-32px_rgba(28,25,23,0.2)] sm:p-5">
        <PawTrail className="right-8 top-6 h-16 w-[11rem]" variant="mixed" />

        <div className="min-w-0">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#f2d8cc] bg-[#fff6f1] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b8694d]">
                  <PawPrint className="h-3.5 w-3.5" />
                  Mèo board
                </div>
                <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-medium text-stone-600">
                  {visibleTasks.length}/{boardTasks.length} việc
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {quickFilterOptions.map((option) => {
                  const isActive = quickFilter === option.value;

                  return (
                    <button
                      key={option.value}
                      aria-pressed={isActive}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                        getQuickFilterButtonClass(option.value, isActive)
                      )}
                      onClick={() => setQuickFilter(option.value)}
                      type="button"
                    >
                      {option.label}
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px]",
                          isActive
                            ? option.value === "all"
                              ? "bg-white/15 text-white"
                              : "bg-white/75 text-current"
                            : "bg-stone-100 text-stone-600"
                        )}
                      >
                        {option.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-stone-950">
                  Việc trong ngày
                </h2>
                <p className="mt-1 text-sm text-stone-600">
                  Kéo thả, lọc nhanh và thêm việc ngay trong đúng mốc.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {boardContextChips.map((chip) => (
                  <div
                    className="rounded-full border border-[#e8ddd2] bg-white px-3 py-1.5 text-xs text-stone-700"
                    key={chip.label}
                  >
                    <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                      {chip.label}
                    </span>
                    <span className="font-medium">{chip.value}</span>
                  </div>
                ))}
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
                    className="h-10 min-w-[14rem] w-full rounded-xl border border-[#eadfd4] bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-[#e8c8b4] focus:ring-2 focus:ring-[#f6ddd0]"
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
                    Cột mốc
                  </span>
                  <select
                    className="h-10 min-w-[15rem] w-full rounded-xl border border-[#eadfd4] bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-[#e8c8b4] focus:ring-2 focus:ring-[#f6ddd0]"
                    disabled={filteredMilestoneOptions.length === 0}
                    onChange={(event) => setSelectedMilestoneId(event.target.value)}
                    value={selectedMilestoneId}
                  >
                    {filteredMilestoneOptions.length > 0 ? (
                      filteredMilestoneOptions.map((milestone) => (
                        <option key={milestone.id} value={milestone.id}>
                          {milestone.goal.title} · Mốc {milestone.sequenceNo}
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
                Cần có ít nhất một cột mốc để thêm việc.
              </p>
            )}
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
        <PawTrail className="right-[18rem] top-6 h-24 w-[15rem]" variant="mixed" />

        <div className="mt-2 overflow-x-auto pb-1">
          <div className="grid min-w-[52rem] gap-2.5 xl:grid-cols-4">
            {taskColumns.map((column) => {
              const columnTasks = tasksByStatus.get(column.status) ?? [];
              const columnFocusCount = columnTasks.filter(
                (task) => task.isFocus && task.status !== "completed"
              ).length;
              const columnOverdueCount = columnTasks.filter((task) =>
                isTaskOverdue(task, stableNow)
              ).length;

              return (
                <TaskBoardColumn
                  accentClassName={column.accentClassName}
                  active={dropTargetStatus === column.status}
                  canQuickCreate={filteredMilestoneOptions.length > 0}
                  count={columnTasks.length}
                  creating={creatingStatus === column.status}
                  description={column.description}
                  dotClassName={column.dotClassName}
                  dragging={activeTaskId !== null}
                  focusCount={columnFocusCount}
                  key={column.status}
                  onQuickCreate={createTaskInColumn}
                  overdueCount={columnOverdueCount}
                  quickCreateMilestone={selectedMilestone}
                  status={column.status}
                  totalVisibleTasks={visibleTasks.length}
                >
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                      <TaskBoardCard
                        key={task.id}
                        onQuickMarkDone={handleQuickMarkDone}
                        onQuickStart={handleQuickStart}
                        onQuickToggleFocus={handleQuickToggleFocus}
                        referenceNow={stableNow}
                        syncing={syncingTaskIds.includes(task.id)}
                        task={task}
                      />
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-stone-300 bg-white/80 px-4 py-5 text-center text-xs leading-5 text-stone-500">
                      <PawPrint className="mx-auto mb-2 h-5 w-5 text-[#d8b8a3]" />
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
            <div className="w-[14rem] rotate-[1.5deg] rounded-[1.35rem] border border-[#e8c8b4] bg-white p-2.5 shadow-2xl">
              <TaskCardContent
                onQuickMarkDone={handleQuickMarkDone}
                onQuickStart={handleQuickStart}
                onQuickToggleFocus={handleQuickToggleFocus}
                referenceNow={stableNow}
                syncing={false}
                task={activeTask}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}
