"use client";

import { useActionState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getInitialHabitLogFormActionState
} from "@/features/habits/actions/shared";
import { upsertHabitLogAction } from "@/features/habits/actions/upsert-habit-log";
import type { HabitLogFormValues } from "@/features/habits/types";

type HabitLogFormProps = {
  habitId: string;
  initialValues?: Partial<HabitLogFormValues>;
};

const textareaClassName =
  "min-h-24 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10";

export function HabitLogForm({
  habitId,
  initialValues
}: HabitLogFormProps) {
  const initialState = useMemo(
    () => getInitialHabitLogFormActionState(initialValues),
    [initialValues]
  );
  const [state, formAction, isPending] = useActionState(
    upsertHabitLogAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <input name="habitId" type="hidden" value={habitId} />

      {state.message ? (
        <div
          className={
            state.status === "success"
              ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
              : "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          }
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ngay log
          </span>
          <Input defaultValue={state.values.logDate} name="logDate" type="date" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            So lan hoan thanh
          </span>
          <Input
            defaultValue={state.values.completedCount}
            min="0"
            name="completedCount"
            type="number"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-700">
          Ghi chu log
        </span>
        <textarea
          className={textareaClassName}
          defaultValue={state.values.note}
          name="note"
        />
      </label>

      <Button disabled={isPending} type="submit">
        {isPending ? "Dang luu log..." : "Luu habit log"}
      </Button>
    </form>
  );
}
