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
import { ArrowRight, GripVertical } from "lucide-react";
import {
  goalPriorityLabels,
  workStatusClassNames,
  workStatusLabels
} from "@/features/goals/goal-helpers";
import type { WorkStatus } from "@/features/goals/types";
import type { TaskListItem } from "@/features/tasks/types";
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
  task
}: {
  task: TaskListItem;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5">
            {task.isFocus ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                Tập trung
              </span>
            ) : null}
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
              {goalPriorityLabels[task.priority]}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-stone-950">
            {task.title}
          </h3>
        </div>
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-stone-500">
        <span className="rounded-full bg-stone-100 px-2 py-0.5">
          {task.goalTitle}
        </span>
        {task.dueAt ? (
          <span className="rounded-full bg-stone-100 px-2 py-0.5">
            {formatDisplayDateTime(task.dueAt)}
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-stone-500">
          {task.completedSubtasksCount}/{task.subtasksCount} việc con • {task.progress}%
        </span>
        <Link
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-900"
          href={`/goals/${task.goalId}/tasks/${task.id}/edit`}
        >
          Mở
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </>
  );
}

function TaskBoardCard({
  syncing,
  task
}: {
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
        "ui-card-compact cursor-grab touch-none p-3 transition hover:border-stone-300",
        isDragging && "cursor-grabbing opacity-60 shadow-lg",
        syncing && "ring-1 ring-stone-300"
      )}
      ref={setNodeRef}
      style={{
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        willChange: isDragging ? "transform" : undefined
      }}
    >
      <TaskCardContent task={task} />
    </article>
  );
}

function TaskBoardColumn({
  active,
  children,
  count,
  description,
  status
}: {
  active: boolean;
  children: ReactNode;
  count: number;
  description: string;
  status: WorkStatus;
}) {
  const { isOver, setNodeRef } = useDroppable({
    data: {
      status,
      type: "column"
    },
    id: `task-column-${status}`
  });

  return (
    <section
      className={cn(
        "ui-board-column min-h-[calc(100vh-15rem)] p-3 transition-colors",
        (active || isOver) && "border-stone-950 bg-white"
      )}
      ref={setNodeRef}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
              workStatusClassNames[status]
            )}
          >
            {workStatusLabels[status]}
          </span>
          <p className="mt-2 text-xs leading-5 text-stone-500">{description}</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-500">
          {count}
        </span>
      </div>

      <div className="mt-3 space-y-2.5">{children}</div>
    </section>
  );
}

export function TaskBoard({ tasks }: { tasks: TaskListItem[] }) {
  const [boardTasks, setBoardTasks] = useState(tasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<WorkStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const activeTask = useMemo(() => {
    return activeTaskId
      ? boardTasks.find((task) => task.id === activeTaskId) ?? null
      : null;
  }, [activeTaskId, boardTasks]);

  const tasksByStatus = useMemo(() => {
    const grouped = new Map<WorkStatus, TaskListItem[]>();

    for (const column of taskColumns) {
      grouped.set(column.status, []);
    }

    for (const task of boardTasks) {
      grouped.get(task.status)?.push(task);
    }

    return grouped;
  }, [boardTasks]);

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
    <section className="ui-panel p-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap gap-2">
          {taskColumns.map((column) => (
            <span className="ui-pill" key={column.status}>
              {workStatusLabels[column.status]}
              <strong className="font-semibold text-stone-900">
                {(tasksByStatus.get(column.status) ?? []).length}
              </strong>
            </span>
          ))}
        </div>

        <div className="text-xs font-medium text-stone-500">
          {syncingTaskIds.length > 0
            ? `Đang lưu ${syncingTaskIds.length} thay đổi`
            : "Kéo thả để cập nhật"}
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
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
          <div className="grid min-w-[68rem] gap-3 xl:grid-cols-4">
            {taskColumns.map((column) => {
              const columnTasks = tasksByStatus.get(column.status) ?? [];

              return (
                <TaskBoardColumn
                  active={dropTargetStatus === column.status}
                  count={columnTasks.length}
                  description={column.description}
                  key={column.status}
                  status={column.status}
                >
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                      <TaskBoardCard
                        key={task.id}
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
            <div className="ui-card-compact w-[17rem] rotate-[1.5deg] p-3 shadow-2xl">
              <TaskCardContent task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}
