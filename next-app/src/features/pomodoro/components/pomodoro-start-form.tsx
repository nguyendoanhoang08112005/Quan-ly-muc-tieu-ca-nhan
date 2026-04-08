"use client";

import { useActionState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getInitialPomodoroStartFormActionState
} from "@/features/pomodoro/actions/shared";
import { startPomodoroSessionAction } from "@/features/pomodoro/actions/start-pomodoro-session";
import type {
  PomodoroStartFormValues,
  PomodoroTaskOption
} from "@/features/pomodoro/types";

type PomodoroStartFormProps = {
  initialValues?: Partial<PomodoroStartFormValues>;
  taskOptions: PomodoroTaskOption[];
};

export function PomodoroStartForm({
  initialValues,
  taskOptions
}: PomodoroStartFormProps) {
  const initialState = useMemo(
    () => getInitialPomodoroStartFormActionState(initialValues),
    [initialValues]
  );
  const [state, formAction, isPending] = useActionState(
    startPomodoroSessionAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.message}
        </div>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-700">
          Chon task
        </span>
        <select
          className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
          defaultValue={state.values.taskId}
          name="taskId"
        >
          <option value="">Chon task de focus</option>
          {taskOptions.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title} | {task.goalTitle}
            </option>
          ))}
        </select>
        {state.fieldErrors?.taskId?.[0] ? (
          <p className="mt-2 text-sm text-rose-600">
            {state.fieldErrors.taskId[0]}
          </p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-700">
          Thoi luong
        </span>
        <Input
          defaultValue={state.values.durationMinutes}
          min="1"
          max="180"
          name="durationMinutes"
          type="number"
        />
        {state.fieldErrors?.durationMinutes?.[0] ? (
          <p className="mt-2 text-sm text-rose-600">
            {state.fieldErrors.durationMinutes[0]}
          </p>
        ) : null}
      </label>

      <Button disabled={isPending} type="submit">
        {isPending ? "Dang bat dau..." : "Bat dau pomodoro"}
      </Button>
    </form>
  );
}
