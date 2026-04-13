"use client";

import { Check } from "lucide-react";
import { useFormStatus } from "react-dom";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { PendingSubmitButton } from "@/components/shared/pending-submit-button";
import type { SubtaskSummary } from "@/features/tasks/types";
import { createSubtaskAction } from "@/features/subtasks/actions/create-subtask";
import { deleteSubtaskAction } from "@/features/subtasks/actions/delete-subtask";
import { toggleSubtaskAction } from "@/features/subtasks/actions/toggle-subtask";
import { cn } from "@/lib/utils";

function ToggleSubtaskButton({
  completed,
  name
}: {
  completed: boolean;
  name: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-busy={pending}
      aria-label={
        completed
          ? `Đánh dấu chưa hoàn thành: ${name}`
          : `Đánh dấu hoàn thành: ${name}`
      }
      aria-pressed={completed}
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded border text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950",
        completed
          ? "border-emerald-500 bg-emerald-500 text-white"
          : "border-stone-300 bg-white text-stone-700 hover:border-stone-950"
      )}
      disabled={pending}
      type="submit"
    >
      {completed ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
    </button>
  );
}

export function TaskSubtasksPanel({
  subtasks,
  taskId
}: {
  subtasks: SubtaskSummary[];
  taskId: string;
}) {
  const completedCount = subtasks.filter(
    (subtask) => subtask.status === "completed"
  ).length;
  const inputId = `subtask-name-${taskId}`;
  const hintId = `subtask-hint-${taskId}`;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-stone-950">
            Việc con
          </h2>
          <p className="mt-1 text-sm leading-6 text-stone-500">
            Tách công việc thành các bước nhỏ đủ rõ để xử lý ngay.
          </p>
        </div>
        <div
          aria-live="polite"
          className="rounded-md border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600"
        >
          {subtasks.length > 0
            ? `${completedCount}/${subtasks.length} đã xong`
            : "Chưa có bước nhỏ"}
        </div>
      </div>

      {subtasks.length > 0 ? (
        <ul className="mt-4 divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200">
          {subtasks.map((subtask) => {
            const completed = subtask.status === "completed";

            return (
              <li
                className="grid gap-3 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                key={subtask.id}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <form action={toggleSubtaskAction}>
                    <input name="taskId" type="hidden" value={taskId} />
                    <input name="subtaskId" type="hidden" value={subtask.id} />
                    <ToggleSubtaskButton completed={completed} name={subtask.name} />
                  </form>
                  <p
                    className={cn(
                      "min-w-0 break-words text-sm font-medium leading-6",
                      completed
                        ? "text-stone-400 line-through"
                        : "text-stone-800"
                    )}
                  >
                    {subtask.name}
                  </p>
                </div>

                <form action={deleteSubtaskAction} className="sm:justify-self-end">
                  <input name="taskId" type="hidden" value={taskId} />
                  <input name="subtaskId" type="hidden" value={subtask.id} />
                  <ConfirmSubmitButton
                    className="h-8 rounded-lg px-3 text-stone-500 hover:bg-rose-50 hover:text-rose-700"
                    confirmMessage={`Xóa việc con "${subtask.name}"?`}
                    idleLabel="Xóa"
                    pendingLabel="Đang xóa..."
                    size="sm"
                    variant="ghost"
                  />
                </form>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 px-4 py-4 text-sm leading-6 text-stone-500">
          Chưa có việc con. Thêm bước đầu tiên để công việc dễ bắt đầu hơn.
        </div>
      )}

      <form action={createSubtaskAction} className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <input name="taskId" type="hidden" value={taskId} />
        <div className="min-w-0">
          <label className="sr-only" htmlFor={inputId}>
            Tên việc con mới
          </label>
          <input
            aria-describedby={hintId}
            className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            id={inputId}
            maxLength={180}
            minLength={2}
            name="name"
            placeholder="Thêm việc con mới"
            required
            type="text"
          />
          <p className="mt-1 text-xs text-stone-500" id={hintId}>
            Tối thiểu 2 ký tự, tối đa 180 ký tự.
          </p>
        </div>
        <PendingSubmitButton
          className="gap-2 rounded-lg"
          idleLabel="Thêm việc con"
          pendingLabel="Đang thêm..."
          size="sm"
          variant="secondary"
        />
      </form>
    </div>
  );
}
