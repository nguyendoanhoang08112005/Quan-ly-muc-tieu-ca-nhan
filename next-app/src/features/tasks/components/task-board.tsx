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
import { ArrowRight, GripVertical, LoaderCircle, Plus } from "lucide-react";
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
  status: WorkStatus;
  description: string;
}> = [
  {
    description: "Chưa bắt đầu",
    status: "not_started"
  },
  {
    description: "Đang làm",
    status: "in_progress"
  },
  {
    description: "Tạm dừng",
    status: "paused"
  },
  {
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

function toStringId(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return `${value}`;
}

function buildOptimisticTask({
  draft,
  milestone,
  status,
  taskId
}: {
  draft: InlineTaskDraft;
  milestone: TaskQuickCreateMilestoneOption;
  status: WorkStatus;
  taskId: string;
}): TaskListItem {
  return {
    id: taskId,
    title: draft.title.trim(),
    description: "",
    status,
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
          <div className="flex flex-wrap gap-1">
            {isOverdue ? (
              <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-semibold text-rose-700">
                Quá hạn
              </span>
            ) : null}
            {task.isFocus ? (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                Tập trung
              </span>
            ) : null}
            <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[9px] font-semibold text-stone-600">
              {goalPriorityLabels[task.priority]}
            </span>
          </div>
          <h3 className="mt-1.5 line-clamp-2 text-[13px] font-semibold leading-4.5 text-stone-950">
            {task.title}
          </h3>
        </div>
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px] text-stone-500">
        <span className="rounded-full bg-stone-100 px-1.5 py-0.5 font-medium text-stone-600">
          {contextLabel}
        </span>
        {task.project ? (
          <span className="rounded-full bg-stone-100 px-1.5 py-0.5 font-medium text-stone-600">
            {task.project.name}
          </span>
        ) : null}
        {task.dueAt ? (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 font-medium",
              isOverdue
                ? "bg-rose-100 text-rose-700"
                : "bg-stone-100 text-stone-700"
            )}
          >
            {formatDisplayDateTime(task.dueAt)}
          </span>
        ) : null}
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-1 text-[10px] text-stone-500">
          {task.subtasksCount > 0 ? (
            <>
              <span>
                {task.completedSubtasksCount}/{task.subtasksCount} việc con
              </span>
              <span className="text-stone-300">•</span>
              <span>{task.progress}% tiến độ</span>
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
    setNodeRef,
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

  return (
    <article
      {...attributes}
      {...listeners}
      className={cn(
        "ui-card-compact cursor-grab touch-none p-2.5 transition hover:border-stone-300",
        isDragging && "cursor-grabbing opacity-60 shadow-lg",
        syncing && "ring-1 ring-stone-300"
      )}
      ref={setNodeRef}
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
  active,
  canQuickCreate,
  children,
  creating,
  count,
  description,
  onQuickCreate,
  quickCreateMilestone,
  status
}: {
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
  const [priority, setPriority] = useState<GoalPriority>("medium");
  const [isFocus, setIsFocus] = useState(status === "in_progress");
  const inputRef = useRef<HTMLInputElement | null>(null);

  function openComposer() {
    setIsComposerOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function closeComposer() {
    setIsComposerOpen(false);
    setTitle("");
    setDueAt("");
    setPriority("medium");
    setIsFocus(status === "in_progress");
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
      setPriority("medium");
      setIsFocus(status === "in_progress");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  return (
    <section
      className={cn(
        "ui-board-column min-h-[calc(100vh-18rem)] p-2.5 transition-colors",
        (active || isOver) && "border-stone-950 bg-white"
      )}
      ref={setNodeRef}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
              workStatusClassNames[status]
            )}
          >
            {workStatusLabels[status]}
          </span>
          <p className="mt-1.5 text-[11px] leading-4 text-stone-500">{description}</p>
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-stone-500">
          {count}
        </span>
      </div>

      <div className="mt-2.5 space-y-2">{children}</div>

      <div className="mt-2.5">
        {isComposerOpen ? (
          <form
            className="rounded-lg border border-stone-200 bg-stone-50/80 p-2.5"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <Input
                className="h-8 rounded-lg border-stone-200 bg-white text-sm focus:ring-1 focus:ring-stone-950/10"
                disabled={!quickCreateMilestone || creating}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={`Tên việc ở cột ${workStatusLabels[status].toLowerCase()}`}
                ref={inputRef}
                value={title}
              />

              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_8rem]">
                <Input
                  className="h-8 rounded-lg border-stone-200 bg-white text-[11px] focus:ring-1 focus:ring-stone-950/10"
                  disabled={!quickCreateMilestone || creating}
                  onChange={(event) => setDueAt(event.target.value)}
                  type="datetime-local"
                  value={dueAt}
                />
                <select
                  className="h-8 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-stone-950 focus:ring-1 focus:ring-stone-950/10"
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

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600">
                  {quickCreateMilestone
                    ? `Mốc ${quickCreateMilestone.sequenceNo} · ${quickCreateMilestone.title}`
                    : "Chưa chọn cột mốc"}
                </span>

                <button
                  aria-pressed={isFocus}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-semibold transition",
                    isFocus
                      ? "bg-amber-100 text-amber-700"
                      : "bg-white text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                  )}
                  disabled={!quickCreateMilestone || creating}
                  onClick={() => setIsFocus((current) => !current)}
                  type="button"
                >
                  {isFocus ? "Đang ưu tiên" : "Đánh dấu ưu tiên"}
                </button>

                <div className="ml-auto flex items-center gap-2">
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
                    Thêm
                  </Button>
                  <button
                    className="rounded-full px-2 py-1 text-xs font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
                    disabled={creating}
                    onClick={closeComposer}
                    type="button"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <button
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2 text-[13px] font-medium transition",
              canQuickCreate
                ? "border-stone-300 bg-stone-50 text-stone-700 hover:border-stone-950 hover:bg-white hover:text-stone-950"
                : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
            )}
            disabled={!canQuickCreate || creating}
            onClick={openComposer}
            type="button"
          >
            {creating ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {creating
              ? "Đang thêm công việc..."
              : quickCreateMilestone
                ? `Thêm vào mốc ${quickCreateMilestone.sequenceNo}`
                : "Thêm công việc"}
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

  const tasksByStatus = useMemo(() => {
    const grouped = new Map<WorkStatus, TaskListItem[]>();

    for (const column of taskColumns) {
      grouped.set(column.status, []);
    }

    for (const task of visibleTasks) {
      grouped.get(task.status)?.push(task);
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

  function moveTask(taskId: string, nextStatus: WorkStatus) {
    const currentTask = boardTasks.find((task) => task.id === taskId);

    if (!currentTask || currentTask.status === nextStatus) {
      return;
    }

    const previousStatus = currentTask.status;
    const previousProgress = currentTask.progress;

    setErrorMessage(null);
    setBoardTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              progress:
                nextStatus === "completed"
                  ? 100
                  : task.progress === 100
                    ? 0
                    : task.progress,
              status: nextStatus
            }
          : task
      )
    );
    setSyncingTaskIds((current) =>
      current.includes(taskId) ? current : [...current, taskId]
    );

    void (async () => {
      try {
        const response = await fetch(`/api/v1/tasks/${taskId}`, {
          body: JSON.stringify({
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

          setBoardTasks((current) =>
            current.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    progress: previousProgress,
                    status: previousStatus
                  }
                : task
            )
          );
          setErrorMessage(message);
        }
      } catch {
        setBoardTasks((current) =>
          current.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  progress: previousProgress,
                  status: previousStatus
                }
              : task
          )
        );
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
    const optimisticTask = buildOptimisticTask({
      draft,
      milestone: selectedMilestone,
      status,
      taskId: tempTaskId
    });

    setCreatingStatus(status);
    setErrorMessage(null);
    setBoardTasks((current) => [optimisticTask, ...current]);

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

    setActiveTaskId(null);
    setActiveDropTarget(null);

    if (!nextStatus) {
      return;
    }

    moveTask(taskId, nextStatus);
  }

  return (
    <section className="ui-panel p-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-2.5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">
              Đang xem
            </p>
            {selectedGoal ? (
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
                {selectedGoal.title}
              </span>
            ) : (
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
                Tất cả mục tiêu
              </span>
            )}
            {selectedMilestone ? (
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
                Tạo nhanh vào mốc {selectedMilestone.sequenceNo}
              </span>
            ) : null}
          </div>
          {availableGoals.length > 0 ? (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500">
              <select
                className="h-8 min-w-[14rem] max-w-[18rem] rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
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
              <select
                className="h-8 min-w-[15rem] max-w-[20rem] rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
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
            </div>
          ) : (
            <p className="mt-1 text-xs font-medium text-amber-700">
              Cần có ít nhất một cột mốc để tạo công việc ngay trên board.
            </p>
          )}
        </div>

        <div className="text-xs font-medium text-stone-500">
          {syncingTaskIds.length > 0
            ? `Đang lưu ${syncingTaskIds.length} thay đổi`
            : creatingStatus
              ? "Đang tạo công việc mới"
              : "Kéo thả hoặc thêm việc ngay trong từng cột"}
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
                  active={dropTargetStatus === column.status}
                  canQuickCreate={filteredMilestoneOptions.length > 0}
                  count={columnTasks.length}
                  creating={creatingStatus === column.status}
                  description={column.description}
                  key={column.status}
                  onQuickCreate={createTaskInColumn}
                  quickCreateMilestone={selectedMilestone}
                  status={column.status}
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
                    <div className="rounded-xl border border-dashed border-stone-300 bg-white px-3 py-6 text-center text-xs leading-5 text-stone-500">
                      Kéo việc vào đây để chuyển trạng thái.
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
