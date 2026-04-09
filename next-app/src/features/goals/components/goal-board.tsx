"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, GripVertical } from "lucide-react";
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
  { status: "not_started", description: "Chưa bắt đầu" },
  { status: "in_progress", description: "Đang theo đuổi" },
  { status: "paused", description: "Tạm dừng" },
  { status: "completed", description: "Đã hoàn thành" },
  { status: "cancelled", description: "Đã hủy" }
];

export function GoalBoard({ goals }: { goals: GoalListItem[] }) {
  const [boardGoals, setBoardGoals] = useState(goals);
  const [draggedGoalId, setDraggedGoalId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<GoalStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [syncingGoalIds, setSyncingGoalIds] = useState<string[]>([]);
  const dropTargetStatusRef = useRef<GoalStatus | null>(null);

  useEffect(() => {
    setBoardGoals(goals);
  }, [goals]);

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
    if (dropTargetStatusRef.current === nextStatus) {
      return;
    }

    dropTargetStatusRef.current = nextStatus;
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

  return (
    <section className="ui-panel p-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
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

      <div className="mt-3 overflow-x-auto pb-1">
        <div className="grid min-w-[74rem] gap-3 xl:grid-cols-5">
          {goalColumns.map((column) => {
            const columnGoals = goalsByStatus.get(column.status) ?? [];
            const isActiveDropZone = dropTargetStatus === column.status;

            return (
              <section
                className={cn(
                  "ui-board-column min-h-[calc(100vh-16rem)] p-3 transition",
                  isActiveDropZone && "border-stone-950 bg-white"
                )}
                key={column.status}
                onDragLeave={() => {
                  if (dropTargetStatusRef.current === column.status) {
                    setActiveDropTarget(null);
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setActiveDropTarget(column.status);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setActiveDropTarget(null);

                  const goalId =
                    draggedGoalId || event.dataTransfer.getData("text/plain");

                  if (!goalId) {
                    return;
                  }

                  moveGoal(goalId, column.status);
                  setDraggedGoalId(null);
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        goalStatusClassNames[column.status]
                      )}
                    >
                      {goalStatusLabels[column.status]}
                    </span>
                    <p className="mt-2 text-xs leading-5 text-stone-500">
                      {column.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-500">
                    {columnGoals.length}
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {columnGoals.length > 0 ? (
                    columnGoals.map((goal) => (
                      <article
                        className={cn(
                          "ui-card-compact cursor-grab p-3 transition hover:border-stone-300",
                          draggedGoalId === goal.id && "opacity-70",
                          syncingGoalIds.includes(goal.id) && "ring-1 ring-stone-300"
                        )}
                        draggable={!syncingGoalIds.includes(goal.id)}
                        key={goal.id}
                        onDragEnd={() => {
                          setDraggedGoalId(null);
                          setActiveDropTarget(null);
                        }}
                        onDragStart={(event) => {
                          setDraggedGoalId(goal.id);
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/plain", goal.id);
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap gap-1.5">
                              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                                {goalPriorityLabels[goal.priority]}
                              </span>
                              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                                {goal.progress}%
                              </span>
                            </div>
                            <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-stone-950">
                              {goal.title}
                            </h3>
                          </div>
                          <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-stone-500">
                          {goal.category ? (
                            <span className="rounded-full bg-stone-100 px-2 py-0.5">
                              {goal.category.name}
                            </span>
                          ) : null}
                          <span className="rounded-full bg-stone-100 px-2 py-0.5">
                            {formatDisplayDate(goal.targetDate)}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] text-stone-500">
                            {goal.milestonesCount} cột mốc • {goal.tasksCount} việc
                          </span>
                          <Link
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-900"
                            href={`/goals/${goal.id}`}
                          >
                            Mở
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-stone-300 bg-white px-3 py-6 text-center text-xs leading-5 text-stone-500">
                      Kéo mục tiêu vào đây để đổi trạng thái.
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
