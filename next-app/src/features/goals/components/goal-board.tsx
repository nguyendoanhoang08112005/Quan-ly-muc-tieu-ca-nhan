"use client";

import Link from "next/link";
import type { Route } from "next";
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
import { ArrowRight, GripVertical, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  goalPriorityLabels,
  goalStatusClassNames,
  goalStatusLabels
} from "@/features/goals/goal-helpers";
import type { GoalListItem, GoalStatus } from "@/features/goals/types";
import { formatDisplayDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

const goalColumns: Array<{
  status: GoalStatus;
  description: string;
}> = [
  { description: "Chưa bắt đầu", status: "not_started" },
  { description: "Đang theo đuổi", status: "in_progress" },
  { description: "Tạm dừng", status: "paused" },
  { description: "Đã hoàn thành", status: "completed" },
  { description: "Đã hủy", status: "cancelled" }
];

function getGoalStatusFromDndData(
  data: Record<string, unknown> | undefined
): GoalStatus | null {
  const status = data?.status;

  if (
    status === "not_started" ||
    status === "in_progress" ||
    status === "paused" ||
    status === "completed" ||
    status === "cancelled"
  ) {
    return status;
  }

  return null;
}

function GoalCardContent({
  goal
}: {
  goal: GoalListItem;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1">
            <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[9px] font-semibold text-stone-600">
              {goalPriorityLabels[goal.priority]}
            </span>
            <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[9px] font-semibold text-stone-600">
              {goal.progress}%
            </span>
          </div>
          <h3 className="mt-1.5 line-clamp-2 text-[13px] font-semibold leading-4.5 text-stone-950">
            {goal.title}
          </h3>
        </div>
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
      </div>

      <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] text-stone-500">
        {goal.category ? (
          <span className="rounded-full bg-stone-100 px-1.5 py-0.5">
            {goal.category.name}
          </span>
        ) : null}
        <span className="rounded-full bg-stone-100 px-1.5 py-0.5">
          {formatDisplayDate(goal.targetDate)}
        </span>
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[10px] text-stone-500">
          {goal.milestonesCount} cột mốc • {goal.tasksCount} việc
        </span>
        <Link
          className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-900"
          href={`/goals/${goal.id}`}
        >
          Mở
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </>
  );
}

function GoalBoardCard({
  goal,
  syncing
}: {
  goal: GoalListItem;
  syncing: boolean;
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform
  } = useDraggable({
    data: {
      goalId: goal.id,
      status: goal.status,
      type: "goal"
    },
    disabled: syncing,
    id: `goal-${goal.id}`
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
      <GoalCardContent goal={goal} />
    </article>
  );
}

function GoalBoardColumn({
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
  status: GoalStatus;
}) {
  const { isOver, setNodeRef } = useDroppable({
    data: {
      status,
      type: "column"
    },
    id: `goal-column-${status}`
  });

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
              goalStatusClassNames[status]
            )}
          >
            {goalStatusLabels[status]}
          </span>
          <p className="mt-1.5 text-[11px] leading-4 text-stone-500">{description}</p>
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-stone-500">
          {count}
        </span>
      </div>

      <div className="mt-2.5 space-y-2">{children}</div>
    </section>
  );
}

export function GoalBoard({
  createHref = "/goals?create=1",
  goals
}: {
  createHref?: Route;
  goals: GoalListItem[];
}) {
  const [boardGoals, setBoardGoals] = useState(goals);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<GoalStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [syncingGoalIds, setSyncingGoalIds] = useState<string[]>([]);
  const lastDropTargetRef = useRef<GoalStatus | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4
      }
    })
  );

  useEffect(() => {
    setBoardGoals(goals);
  }, [goals]);

  const activeGoal = useMemo(() => {
    return activeGoalId
      ? boardGoals.find((goal) => goal.id === activeGoalId) ?? null
      : null;
  }, [activeGoalId, boardGoals]);

  const goalsByStatus = useMemo(() => {
    const grouped = new Map<GoalStatus, GoalListItem[]>();

    for (const column of goalColumns) {
      grouped.set(column.status, []);
    }

    for (const goal of boardGoals) {
      grouped.get(goal.status)?.push(goal);
    }

    return grouped;
  }, [boardGoals]);

  function setActiveDropTarget(nextStatus: GoalStatus | null) {
    if (lastDropTargetRef.current === nextStatus) {
      return;
    }

    lastDropTargetRef.current = nextStatus;
    setDropTargetStatus(nextStatus);
  }

  function moveGoal(goalId: string, nextStatus: GoalStatus) {
    const currentGoal = boardGoals.find((goal) => goal.id === goalId);

    if (!currentGoal || currentGoal.status === nextStatus) {
      return;
    }

    const previousStatus = currentGoal.status;
    const previousProgress = currentGoal.progress;
    const nextProgress =
      nextStatus === "completed"
        ? 100
        : currentGoal.progress === 100
          ? 0
          : currentGoal.progress;

    setErrorMessage(null);
    setBoardGoals((current) =>
      current.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              progress: nextProgress,
              status: nextStatus
            }
          : goal
      )
    );
    setSyncingGoalIds((current) =>
      current.includes(goalId) ? current : [...current, goalId]
    );

    void (async () => {
      try {
        const response = await fetch(`/api/v1/goals/${goalId}`, {
          body: JSON.stringify({
            status: nextStatus
          }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "PATCH"
        });

        if (!response.ok) {
          let message = "Không thể cập nhật trạng thái mục tiêu.";

          try {
            const payload = (await response.json()) as { message?: string };

            if (typeof payload.message === "string" && payload.message.trim()) {
              message = payload.message;
            }
          } catch {
            // Keep fallback message.
          }

          setBoardGoals((current) =>
            current.map((goal) =>
              goal.id === goalId
                ? {
                    ...goal,
                    progress: previousProgress,
                    status: previousStatus
                  }
                : goal
            )
          );
          setErrorMessage(message);
        }
      } catch {
        setBoardGoals((current) =>
          current.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  progress: previousProgress,
                  status: previousStatus
                }
              : goal
          )
        );
        setErrorMessage("Không thể kết nối để cập nhật trạng thái mục tiêu.");
      }

      setSyncingGoalIds((current) => current.filter((id) => id !== goalId));
    })();
  }

  function handleDragStart(event: DragStartEvent) {
    const goalId = String(event.active.id).replace(/^goal-/, "");
    setActiveGoalId(goalId);
    setErrorMessage(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const nextStatus = getGoalStatusFromDndData(
      event.over?.data.current as Record<string, unknown> | undefined
    );

    setActiveDropTarget(nextStatus);
  }

  function handleDragEnd(event: DragEndEvent) {
    const goalId = String(event.active.id).replace(/^goal-/, "");
    const nextStatus = getGoalStatusFromDndData(
      event.over?.data.current as Record<string, unknown> | undefined
    );

    setActiveGoalId(null);
    setActiveDropTarget(null);

    if (!nextStatus) {
      return;
    }

    moveGoal(goalId, nextStatus);
  }

  return (
    <section className="ui-panel p-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-2.5">
        <div className="flex flex-wrap gap-2">
          {goalColumns.map((column) => (
            <span className="ui-pill" key={column.status}>
              {goalStatusLabels[column.status]}
              <strong className="font-semibold text-stone-900">
                {(goalsByStatus.get(column.status) ?? []).length}
              </strong>
            </span>
          ))}
        </div>

        <div className="text-xs font-medium text-stone-500">
          {syncingGoalIds.length > 0
            ? `Đang lưu ${syncingGoalIds.length} thay đổi`
            : "Kéo thả để cập nhật"}
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-stone-500">
          Kéo thả để đổi trạng thái hoặc tạo mục tiêu mới ngay tại đây.
        </p>
        <Link
          className={cn(
            buttonVariants({ size: "sm" }),
            "gap-1.5 rounded-full !text-white"
          )}
          href={createHref}
        >
          <Plus className="h-3.5 w-3.5" />
          Tạo mục tiêu
        </Link>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <div className="mt-3 overflow-x-auto pb-1">
          <div className="grid min-w-[66rem] gap-2.5 xl:grid-cols-5">
            {goalColumns.map((column) => {
              const columnGoals = goalsByStatus.get(column.status) ?? [];

              return (
                <GoalBoardColumn
                  active={dropTargetStatus === column.status}
                  count={columnGoals.length}
                  description={column.description}
                  key={column.status}
                  status={column.status}
                >
                  {columnGoals.length > 0 ? (
                    columnGoals.map((goal) => (
                      <GoalBoardCard
                        goal={goal}
                        key={goal.id}
                        syncing={syncingGoalIds.includes(goal.id)}
                      />
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-stone-300 bg-white px-3 py-6 text-center text-xs leading-5 text-stone-500">
                      Kéo mục tiêu vào đây để đổi trạng thái.
                    </div>
                  )}
                </GoalBoardColumn>
              );
            })}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeGoal ? (
            <div className="ui-card-compact w-[14rem] rotate-[1.5deg] p-2.5 shadow-2xl">
              <GoalCardContent goal={activeGoal} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}
